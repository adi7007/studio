import type { ActivityEvent } from '@/types';
import { TimelineItem } from './timeline-item';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimelineProps {
  events: ActivityEvent[];
}

export function Timeline({ events }: TimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive-x mb-4"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-v-11"/><path d="m10 12 4 4"/><path d="m14 12-4 4"/></svg>
        <p className="text-lg">No activity to display.</p>
        <p className="text-sm">System events and your notes will appear here.</p>
      </div>
    );
  }

  // Sort events by timestamp, newest first
  const sortedEvents = [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="relative">
       {/* This div is a container for the timeline items and the line itself if needed for overall structure */}
      <ScrollArea className="h-[calc(100vh-12rem)] pr-4"> {/* Adjust height as needed */}
        {sortedEvents.map((event, index) => (
          <TimelineItem key={event.id} event={event} isLastItem={index === sortedEvents.length - 1} />
        ))}
      </ScrollArea>
    </div>
  );
}
