import { Phone, Smartphone, Apple, Sparkles, Users, Globe, type LucideIcon } from "lucide-react";

export const serviceIcons: Record<string, LucideIcon> = {
  "virtual-number": Smartphone,
  "google-voice": Phone,
  "apple-id": Apple,
  subscriptions: Sparkles,
  social: Users,
  "static-ip": Globe,
};
