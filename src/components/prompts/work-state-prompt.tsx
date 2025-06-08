"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface WorkStatePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
}

export function WorkStatePrompt({ isOpen, onClose, onSave }: WorkStatePromptProps) {
  const [note, setNote] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onSave(note.trim());
      setNote(""); // Clear textarea after save
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline">Welcome Back!</DialogTitle>
            <DialogDescription>
              It looks like you've been away for a while.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="work-context-note">
                Where were you in your work when you left the system?
              </Label>
              <Textarea
                id="work-context-note"
                placeholder="E.g., 'Finalizing the report on Q3 sales...'"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Skip
            </Button>
            <Button type="submit" variant="default">Save Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
