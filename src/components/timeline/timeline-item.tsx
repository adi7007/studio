
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

// Helper function to convert searchParams-like objects or other objects to plain records
const getPlainDetails = (details: any): Record<string, any> | undefined => {
  if (!details) {
    return undefined;
  }

  // Check if it behaves like URLSearchParams (has an .entries() method returning an iterator)
  if (typeof details.entries === 'function') {
    try {
      const entries = details.entries();
      // Ensure entries() returns an iterable
      if (entries && typeof entries[Symbol.iterator] === 'function') {
        return Object.fromEntries(entries);
      }
    } catch (e) {
      // If .entries() exists but fails or doesn't return an iterable,
      // proceed to treat it as a general object if possible.
      console.warn("Failed to process details.entries(), attempting fallback:", e);
    }
  }

  // If it's a plain object (or not URLSearchParams-like but still an object)
  if (typeof details === 'object' && !Array.isArray(details) && details !== null) {
    // Ensure it's not a special object that Object.entries would misinterpret for this context
    // For example, a Date object also fits `typeof details === 'object'`
    // A simple check is if its constructor is Object, or if it doesn't have a complex prototype chain.
    // For simplicity here, we assume if it's not URLSearchParams-like and is an object, it's intended as a key-value map.
    if (Object.getPrototypeOf(details) === Object.prototype || details.constructor.name === 'Object') {
       return details;
    }
    // If it's some other kind of object (e.g. Date, custom class instance not meant for iteration here)
    // it might be better to return undefined or log an issue, depending on expected data.
    // For now, we'll try to pass it through if it's an object.
    return details;
  }

  // If details is not an object or could not be processed
  return undefined;
};


export function TimelineItem({ event, isLastItem }: TimelineItemProps) {
  const IconComponent = event.icon;
  const displayableDetails = getPlainDetails(event.details);

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
          {displayableDetails && Object.keys(displayableDetails).length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              {Object.entries(displayableDetails).map(([key, value]) => (
                <div key={key}>
                  <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
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
