import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptIncident,
  createIncident,
  getAvailableResponders,
  getIncidentHistory,
  getIncidentById,
  getMyEmergencyContacts,
  getMyIncidents,
  getMapUsers,
  getMyProfile,
  getOpenIncidents,
  resolveIncident,
  setAvailability,
  updateMyLocation,
  updateMyProfile,
  upsertMyEmergencyContacts,
  type IncidentRow,
  type IncidentSeverity,
  type IncidentType,
  type MapUser,
  type ResponderPreview,
} from "@/lib/resq";

export function useMyProfile() {
  return useQuery({
    queryKey: ["me", "profile"],
    queryFn: getMyProfile,
  });
}

export function useMyEmergencyContacts() {
  return useQuery({
    queryKey: ["me", "emergency_contacts"],
    queryFn: getMyEmergencyContacts,
  });
}

export function useSetAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (available: boolean) => setAvailability(available),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me", "profile"] });
    },
  });
}

export function useUpdateMyProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me", "profile"] });
    },
  });
}

export function useUpsertMyEmergencyContacts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertMyEmergencyContacts,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me", "emergency_contacts"] });
    },
  });
}

export function useCreateIncident() {
  return useMutation({
    mutationFn: (input: {
      type: IncidentType;
      severity: IncidentSeverity;
      description?: string;
      lat?: number;
      lng?: number;
    }) => createIncident(input),
  });
}

export function useOpenIncidents() {
  return useQuery({
    queryKey: ["incidents", "open"],
    queryFn: getOpenIncidents,
    refetchInterval: 3000,
  });
}

export function useIncidentHistory() {
  return useQuery({
    queryKey: ["incidents", "history"],
    queryFn: getIncidentHistory,
    refetchInterval: 5000,
  });
}

export function useMyIncidents() {
  return useQuery({
    queryKey: ["incidents", "mine"],
    queryFn: getMyIncidents,
    refetchInterval: 5000,
  });
}

export function useMapUsers() {
  return useQuery({
    queryKey: ["map", "users"],
    queryFn: getMapUsers,
    refetchInterval: 5000,
  });
}

export function useIncident(incidentId?: string) {
  return useQuery({
    queryKey: ["incidents", "one", incidentId],
    queryFn: () => (incidentId ? getIncidentById(incidentId) : Promise.resolve(null)),
    enabled: !!incidentId,
    refetchInterval: 3000,
  });
}

export function useAvailableResponders() {
  return useQuery({
    queryKey: ["responders", "available"],
    queryFn: getAvailableResponders,
    refetchInterval: 5000,
  });
}

export function useAcceptIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (incidentId: string) => acceptIncident(incidentId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["incidents", "open"] });
    },
  });
}

export function useResolveIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (incidentId: string) => resolveIncident(incidentId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["incidents", "open"] });
      await qc.invalidateQueries({ queryKey: ["incidents", "history"] });
      await qc.invalidateQueries({ queryKey: ["incidents", "mine"] });
    },
  });
}

export function useUpdateMyLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) => updateMyLocation(lat, lng),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["map", "users"] });
    },
  });
}

export type { IncidentRow };
export type { MapUser };
export type { ResponderPreview };

