import type { ActivityEvent } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TimelineItemProps {
  event: ActivityEvent;
  isLastItem: boolean;
}

const getEventTypeLabel = (type: ActivityEvent['type']): string => {
  switch (type) {
    case 'APP_USAGE': return 'Application Usage';
    case 'FILE_ACCESS': return 'File Access';
    case 'SYSTEM_EVENT': return 'System Event';
    case 'USER_NOTE': return 'User Note';
    default: return 'Event';
  }
};

export function TimelineItem({ event, isLastItem }: TimelineItemProps) {
  const IconComponent = event.icon;

  return (
    <div className="relative pl-10 pb-8">
      {/* Dot on the timeline */}
      <div
        className={cn(
          "absolute left-[18px] top-1 flex h-4 w-4 items-center justify-center rounded-full",
          event.type === 'USER_NOTE' ? 'bg-accent' : 'bg-primary'
        )}
      >
        <div className="h-2 w-2 rounded-full bg-card" />
      </div>

      {/* Connector line */}
      {!isLastItem && (
        <div
          className="absolute left-5 top-6 bottom-0 w-0.5"
          style={{ background: 'hsl(var(--border))' }}
        />
      )}

      <Card className="ml-5 shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center space-x-3 p-4 bg-muted/50">
          <IconComponent className={cn(
            "h-6 w-6",
            event.type === 'USER_NOTE' ? 'text-accent-foreground' : 'text-primary-foreground'
            )}
            style={ event.type === 'USER_NOTE' ? { color: 'hsl(var(--accent))' } : {color: 'hsl(var(--primary))'} }
           />
          <CardTitle className="text-base font-medium font-headline">{getEventTypeLabel(event.type)}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm">{event.description}</p>
          {event.details && (
            <div className="mt-2 text-xs text-muted-foreground">
              {Object.entries(event.details).map(([key, value]) => (
                <div key={key}>
                  <span className="font-semibold">{key}: </span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 bg-muted/50 border-t">
          <p className="text-xs text-muted-foreground">
            {event.timestamp.toLocaleString()}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
