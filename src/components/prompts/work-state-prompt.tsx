
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
import { useToast } from "@/hooks/use-toast";

interface WorkStatePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
}

export function WorkStatePrompt({ isOpen, onClose, onSave }: WorkStatePromptProps) {
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onSave(note.trim());
      setNote(""); // Clear textarea after save
      onClose();
    } else {
      // Optionally, you could also toast here if they try to submit an empty note,
      // but the button click will simply not proceed if the note is empty.
      toast({
        title: "Note Required",
        description: "Please enter a note to save.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(newOpenState) => {
        if (!newOpenState) { // If the dialog is attempting to close
          if (note.trim() === "") {
            toast({
              title: "Note Required",
              description: "Please write a note about your work before closing this dialog.",
              variant: "destructive",
            });
            // By not calling onClose(), we prevent the dialog from closing
            // if the note is empty. The `isOpen` prop will remain true.
          } else {
            onClose(); // Note is filled, allow closing
          }
        }
        // If newOpenState is true, the dialog is attempting to open.
        // The `isOpen` prop (controlled by the parent) handles this, so no action needed here.
      }}
    >
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
                required // HTML5 required attribute for form submission
              />
            </div>
          </div>
          <DialogFooter>
            {/* The "Skip" button has been removed to enforce note entry */}
            <Button type="submit" variant="default">Save Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
