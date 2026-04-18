import { useCallback, useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import type { IncidentRow, MapUser } from "@/hooks/resq";

const defaultCenter: [number, number] = [43.6532, -79.3832];
const darkLayer = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const darkAttribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

type LeafletMapProps = {
  height?: number;
  users?: MapUser[];
  incidents?: IncidentRow[];
};

export const LeafletMap = ({ height = 420, users = [], incidents = [] }: LeafletMapProps) => {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);
  const markerRef = useRef<Leaflet.CircleMarker | null>(null);
  const accuracyRef = useRef<Leaflet.Circle | null>(null);
  const usersLayerRef = useRef<Leaflet.LayerGroup | null>(null);
  const incidentsLayerRef = useRef<Leaflet.LayerGroup | null>(null);
  const [status, setStatus] = useState("Locating current position...");

  const setPosition = useCallback((coords: [number, number], accuracy?: number) => {
    if (!mapRef.current || !leafletRef.current) return;
    const L = leafletRef.current;

    mapRef.current.setView(coords, 14, { animate: true });

    if (markerRef.current) {
      markerRef.current.setLatLng(coords);
    } else {
      markerRef.current = L.circleMarker(coords, {
        radius: 8,
        color: "#ffffff",
        weight: 2,
        fillColor: "#66d9ff",
        fillOpacity: 1,
      }).addTo(mapRef.current);
    }

    if (accuracy !== undefined) {
      if (accuracyRef.current) {
        accuracyRef.current.setLatLng(coords).setRadius(accuracy);
      } else {
        accuracyRef.current = L.circle(coords, {
          radius: accuracy,
          color: "#66d9ff",
          opacity: 0.35,
          weight: 1,
          fillColor: "#66d9ff",
          fillOpacity: 0.08,
        }).addTo(mapRef.current);
      }
    }
  }, []);

  const locateCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported");
      return;
    }

    setStatus("Finding current location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setStatus("Current location set");
        setPosition(coords, position.coords.accuracy);
      },
      (error) => {
        setStatus(error.message || "Unable to access location");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 10000 }
    );
  }, [setPosition]);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;

    let cancelled = false;

    const initMap = async () => {
      const L = (await import("leaflet")).default as unknown as typeof Leaflet;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapNode.current) return;

      leafletRef.current = L;
      mapRef.current = L.map(mapNode.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        minZoom: 3,
      });

      L.tileLayer(darkLayer, {
        attribution: darkAttribution,
        maxZoom: 19,
        subdomains: ["a", "b", "c", "d"],
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(mapRef.current);

      L.control.zoom({ position: "topright" }).addTo(mapRef.current);
      L.control.attribution({ prefix: false, position: "bottomright" }).addTo(mapRef.current);
      usersLayerRef.current = L.layerGroup().addTo(mapRef.current);
      incidentsLayerRef.current = L.layerGroup().addTo(mapRef.current);

      locateCurrentPosition();
    };

    initMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [locateCurrentPosition]);

  useEffect(() => {
    if (!leafletRef.current || !mapRef.current || !usersLayerRef.current) return;
    const L = leafletRef.current;
    usersLayerRef.current.clearLayers();

    users.forEach((u) => {
      if (u.current_lat == null || u.current_lng == null) return;
      const isResponder = u.role === "responder" || u.role === "both";
      const color = isResponder ? "#4ade80" : "#38bdf8";
      const marker = L.circleMarker([u.current_lat, u.current_lng], {
        radius: 6,
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: u.availability ? 0.85 : 0.45,
      });
      marker.bindTooltip(
        `${u.first_name} ${u.last_name} ${u.availability ? "(active)" : "(offline)"}`,
        { direction: "top" }
      );
      usersLayerRef.current?.addLayer(marker);
    });
  }, [users]);

  useEffect(() => {
    if (!leafletRef.current || !mapRef.current || !incidentsLayerRef.current) return;
    const L = leafletRef.current;
    incidentsLayerRef.current.clearLayers();

    incidents
      .filter((inc) => inc.status === "OPEN" && typeof inc.lat === "number" && typeof inc.lng === "number")
      .forEach((inc) => {
        const center: [number, number] = [inc.lat as number, inc.lng as number];
        const pulseOuter = L.circle(center, {
          radius: 85,
          color: "#ef4444",
          weight: 1,
          opacity: 0.7,
          fillColor: "#ef4444",
          fillOpacity: 0.1,
        });
        const pulseInner = L.circleMarker(center, {
          radius: 8,
          color: "#fee2e2",
          weight: 2,
          fillColor: "#ef4444",
          fillOpacity: 1,
        });

        pulseInner.bindPopup(
          `SOS: ${inc.type.toUpperCase()} (${inc.severity})<br/>` +
            `${inc.description || "No description"}`
        );
        incidentsLayerRef.current?.addLayer(pulseOuter);
        incidentsLayerRef.current?.addLayer(pulseInner);
      });
  }, [incidents]);

  return (
    <div className="relative rounded-[32px] overflow-hidden border border-subtle bg-black" style={{ height }}>
      <div ref={mapNode} className="h-full w-full" />
      <div className="absolute left-4 top-4 rounded-3xl bg-void/90 border border-subtle p-3 shadow-lg backdrop-blur-sm">
        <div className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase">Live location</div>
        <div className="mt-1 text-[12px] leading-5 text-primary-fg">{status}</div>
      </div>
      <button
        type="button"
        onClick={locateCurrentPosition}
        className="absolute right-4 top-4 rounded-full border border-subtle bg-surface/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary-fg shadow-sm transition hover:bg-surface"
      >
        My location
      </button>
    </div>
  );
};
