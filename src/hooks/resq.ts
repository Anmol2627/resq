import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptIncident,
  createIncident,
  getMyEmergencyContacts,
  getMyProfile,
  getOpenIncidents,
  setAvailability,
  updateMyProfile,
  upsertMyEmergencyContacts,
  type IncidentRow,
  type IncidentSeverity,
  type IncidentType,
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

export function useAcceptIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (incidentId: string) => acceptIncident(incidentId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["incidents", "open"] });
    },
  });
}

export type { IncidentRow };

