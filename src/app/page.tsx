
"use client";

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { Timeline } from '@/components/timeline/timeline';
import { WorkStatePrompt } from '@/components/prompts/work-state-prompt';
import type { ActivityEvent } from '@/types';
import { AppWindow, FileText, Power, MessageSquare, Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for initial activities
const MOCK_INITIAL_ACTIVITIES: ActivityEvent[] = [
  { 
    id: 'evt-001', 
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), 
    type: 'SYSTEM_EVENT', 
    description: 'System startup sequence initiated.', 
    icon: Power 
  },
  { 
    id: 'evt-002', 
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000 - 30 * 60 * 1000), 
    type: 'APP_USAGE', 
    description: 'Microsoft Outlook opened. Spent 45 minutes reading emails.', 
    icon: AppWindow,
    details: { application: 'Microsoft Outlook', duration: '45 minutes' }
  },
  { 
    id: 'evt-003', 
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), 
    type: 'FILE_ACCESS', 
    description: 'Accessed document: C:/Users/DemoUser/Documents/QuarterlyReport_Q3.docx', 
    icon: FileText,
    details: { path: 'C:/Users/DemoUser/Documents/QuarterlyReport_Q3.docx', operation: 'Read' }
  },
  { 
    id: 'evt-004', 
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), 
    type: 'APP_USAGE', 
    description: 'Visual Studio Code active. Worked on "sentinel-tracker" project.', 
    icon: AppWindow,
    details: { application: 'Visual Studio Code', project: 'sentinel-tracker' } 
  },
  { 
    id: 'note-001', 
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 - 15 * 60 * 1000), 
    type: 'USER_NOTE', 
    description: 'Paused work on the UI styling for the timeline component. Need to adjust color contrasts.', 
    icon: MessageSquare 
  },
  { 
    id: 'evt-005', 
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), 
    type: 'SYSTEM_EVENT', 
    description: 'System entered sleep mode due to inactivity.', 
    icon: Power,
    details: { reason: 'User inactivity' }
  },
];


export default function HomePage() {
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
  const [showWorkStatePrompt, setShowWorkStatePrompt] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Simulate fetching initial data
    setActivityEvents(MOCK_INITIAL_ACTIVITIES);

    // Simulate showing prompt after a "login" (short delay after page load for demo)
    // In a real app, this would be triggered by detecting a login after a significant idle period.
    const timer = setTimeout(() => {
      // Check if a "significant" sleep/shutdown event happened recently
      // For this demo, we'll always show it if there's a recent sleep/shutdown event in mock data
      const recentSleepEvent = MOCK_INITIAL_ACTIVITIES.find(
        event => event.type === 'SYSTEM_EVENT' && (event.description.includes('sleep') || event.description.includes('shutdown'))
      );
      if (recentSleepEvent) {
         setShowWorkStatePrompt(true);
      }
    }, 1500); // Show prompt 1.5 seconds after page load for demo

    return () => clearTimeout(timer);
  }, []);

  const handleSaveWorkNote = (note: string) => {
    const newNote: ActivityEvent = {
      id: `note-${Date.now()}`,
      timestamp: new Date(),
      type: 'USER_NOTE',
      description: note,
      icon: MessageSquare,
    };
    // Add to events and re-sort (newest first)
    setActivityEvents(prevEvents => 
      [newNote, ...prevEvents].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    );
    setShowWorkStatePrompt(false);
  };

  const handleRefreshTimeline = () => {
    setActivityEvents(MOCK_INITIAL_ACTIVITIES);
    // Note: This does not re-trigger the WorkStatePrompt logic from useEffect,
    // as that is typically for a "welcome back" scenario.
    // If the prompt should also reset, additional logic would be needed here.
  };
  
  if (!isClient) {
     // Render nothing or a loading indicator on the server to avoid hydration mismatch
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-headline font-semibold text-primary">Activity Timeline</h2>
          <Button variant="outline" size="sm" onClick={handleRefreshTimeline}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Timeline
          </Button>
        </div>
        <Timeline events={activityEvents} />
      </main>
      <WorkStatePrompt
        isOpen={showWorkStatePrompt}
        onClose={() => setShowWorkStatePrompt(false)}
        onSave={handleSaveWorkNote}
      />
    </div>
  );
}
