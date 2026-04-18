// Realistic placeholder data for NEXUS RESPONSE
import {
  Heart, Flame, Shield, Cpu, Activity, Wrench, Stethoscope, Zap,
} from "lucide-react";

export type SkillType = "medical" | "fire" | "safety" | "technical";

export const skillColors: Record<SkillType, { color: string; bg: string; border: string; text: string }> = {
  medical: { color: "hsl(var(--emergency))", bg: "bg-emergency-dim", border: "border-emergency", text: "text-emergency" },
  fire: { color: "hsl(var(--orange))", bg: "bg-orange-dim", border: "border-orange-acc", text: "text-orange-acc" },
  safety: { color: "hsl(var(--amber))", bg: "bg-amber-dim", border: "border-amber-acc", text: "text-amber-acc" },
  technical: { color: "hsl(var(--info))", bg: "bg-info-dim", border: "border-info", text: "text-info" },
};

export const responders = [
  { id: 1, name: "Maya Chen", initials: "MC", skill: "Trauma RN", type: "medical" as SkillType, distance: "0.4 km", eta: "~3 min", status: "available" },
  { id: 2, name: "Diego Marquez", initials: "DM", skill: "Firefighter", type: "fire" as SkillType, distance: "0.7 km", eta: "~4 min", status: "available" },
  { id: 3, name: "Aisha Patel", initials: "AP", skill: "EMT-Paramedic", type: "medical" as SkillType, distance: "1.2 km", eta: "~6 min", status: "available" },
  { id: 4, name: "Jonas Berg", initials: "JB", skill: "Security Lead", type: "safety" as SkillType, distance: "1.8 km", eta: "~8 min", status: "busy" },
  { id: 5, name: "Lila Okafor", initials: "LO", skill: "Network Eng.", type: "technical" as SkillType, distance: "2.1 km", eta: "~9 min", status: "available" },
  { id: 6, name: "Ravi Singh", initials: "RS", skill: "CPR Certified", type: "medical" as SkillType, distance: "2.4 km", eta: "~10 min", status: "available" },
];

export const recentActivity = [
  { id: 1, title: "Cardiac event responded", time: "12 min ago", status: "RESOLVED", type: "resolved" as const, icon: Heart },
  { id: 2, title: "Kitchen fire alert", time: "1h 04m ago", status: "RESOLVED", type: "resolved" as const, icon: Flame },
  { id: 3, title: "Power grid fluctuation", time: "3h 22m ago", status: "ACTIVE", type: "info" as const, icon: Zap },
];

export const incomingAlert = {
  type: "MEDICAL" as const,
  severity: "CRITICAL" as const,
  address: "47 Brunswick Ave, 3rd Floor",
  city: "Toronto, ON M5T 2M3",
  distance: "0.8 KM AWAY",
  etaFoot: "~4 MIN BY FOOT",
  triggeredAgo: 47,
  matchedSkills: ["Trauma RN", "CPR", "AED"],
};

export const userProfile = {
  name: "Maya Chen",
  tagline: "Trauma RN · Toronto, ON",
  initials: "MC",
  primaryType: "medical" as SkillType,
  responses: 47,
  rating: 4.9,
  verified: true,
  score: 94,
  rank: "TOP 8% IN YOUR AREA",
  skills: [
    { name: "Trauma Nursing", issuer: "CNO Ontario · 2024", status: "verified", proficiency: 95, type: "medical" as SkillType },
    { name: "CPR / AED", issuer: "Heart & Stroke Foundation", status: "verified", proficiency: 100, type: "medical" as SkillType },
    { name: "Wilderness First Aid", issuer: "SOLO Schools · 2023", status: "verified", proficiency: 80, type: "safety" as SkillType },
    { name: "Hazmat Response", issuer: "Pending review", status: "pending", proficiency: 60, type: "fire" as SkillType },
  ],
  achievements: ["First Response x10", "Verified ID", "Certified Trainer", "Night Shift"],
  history: [
    { type: "medical" as SkillType, date: "Apr 12, 2026", outcome: "HELPED", icon: Stethoscope },
    { type: "safety" as SkillType, date: "Apr 09, 2026", outcome: "HELPED", icon: Shield },
    { type: "technical" as SkillType, date: "Apr 02, 2026", outcome: "DECLINED", icon: Wrench },
  ],
};

export const emergencyTypes = [
  { id: "medical", name: "MEDICAL", desc: "Injury, cardiac, breathing", icon: Heart, color: "emergency" },
  { id: "fire", name: "FIRE", desc: "Smoke, flames, gas leak", icon: Flame, color: "orange" },
  { id: "safety", name: "SAFETY", desc: "Threat, assault, intrusion", icon: Shield, color: "amber" },
  { id: "technical", name: "TECHNICAL", desc: "Power, network, hazard", icon: Cpu, color: "info" },
];

export const liveResponders = [
  { id: 1, name: "Maya Chen", initials: "MC", skill: "Trauma RN", type: "medical" as SkillType, distance: "0.4 km", eta: "2 MIN", etaSec: 120, status: "responding" },
  { id: 2, name: "Diego Marquez", initials: "DM", skill: "Firefighter", type: "fire" as SkillType, distance: "0.9 km", eta: "5 MIN", etaSec: 300, status: "responding" },
  { id: 3, name: "Aisha Patel", initials: "AP", skill: "Paramedic", type: "medical" as SkillType, distance: "1.2 km", eta: "6 MIN", etaSec: 360, status: "responding" },
];

export const pendingResponders = [
  { id: 4, name: "Jonas Berg", skill: "Security", type: "safety" as SkillType, distance: "1.8 km" },
  { id: 5, name: "Lila Okafor", skill: "Network Eng.", type: "technical" as SkillType, distance: "2.1 km" },
  { id: 6, name: "Ravi Singh", skill: "CPR", type: "medical" as SkillType, distance: "2.4 km" },
  { id: 7, name: "Sara Lindqvist", skill: "EMT", type: "medical" as SkillType, distance: "2.6 km" },
  { id: 8, name: "Marcus Vale", skill: "Firefighter", type: "fire" as SkillType, distance: "3.0 km" },
];
