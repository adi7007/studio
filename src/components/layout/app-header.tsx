import { Activity } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-8 w-8 mr-3 text-accent" />
            <h1 className="text-2xl font-headline font-semibold">Employee Tracker</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
