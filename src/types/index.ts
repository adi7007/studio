import type { LucideIcon } from 'lucide-react';

export type ActivityType = 'APP_USAGE' | 'FILE_ACCESS' | 'SYSTEM_EVENT' | 'USER_NOTE';

export interface ActivityEvent {
  id: string;
  timestamp: Date;
  type: ActivityType;
  description: string;
  icon: LucideIcon;
  details?: Record<string, any>;
}
