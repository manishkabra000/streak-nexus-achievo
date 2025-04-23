
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SessionNotesDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  goalName: string;
  initialNotes: string;
  onSave: (notes: string) => void;
}

export const SessionNotesDialog: React.FC<SessionNotesDialogProps> = ({
  open,
  onOpenChange,
  goalName,
  initialNotes,
  onSave,
}) => {
  const [notes, setNotes] = useState(initialNotes || "");

  // Reset internal state if dialog is reopened with different notes
  React.useEffect(() => {
    if (open) setNotes(initialNotes || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialNotes]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add notes for "{goalName}"</DialogTitle>
          <DialogDescription>
            You can add or update notes for this Pomodoro session. These notes will be saved with today's progress.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe what you accomplished, challenges, or thoughts..."
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => { onSave(notes); }}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
