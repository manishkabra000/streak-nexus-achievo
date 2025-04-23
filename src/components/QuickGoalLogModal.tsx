
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Goal, TrackingUnit } from "@/types";
import { useGoals } from "@/contexts/GoalContext";
import { toast } from "sonner";

interface QuickGoalLogModalProps {
  open: boolean;
  onClose: () => void;
  goal: Goal | null;
}

export const QuickGoalLogModal: React.FC<QuickGoalLogModalProps> = ({
  open,
  onClose,
  goal
}) => {
  const { trackProgress, getProgressForGoal, getGoalById } = useGoals();
  const [progressValue, setProgressValue] = useState<number>(goal?.tracking_unit === "binary" ? 1 : goal?.target_value || 0);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (goal) {
      setProgressValue(goal.tracking_unit === "binary" ? 1 : goal.target_value);
      setNotes("");
    }
  }, [goal, open]);

  if (!goal) return null;

  const today = new Date().toISOString().split('T')[0];
  const alreadyLogged = getProgressForGoal(goal.id).some(p => p.date === today && p.completed);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await trackProgress(goal.id, today, progressValue, notes);
      // Optionally refresh UI
      toast.success(`Progress for "${goal.name}" logged!`);
      onClose();
    } catch (err) {
      toast.error("Failed to log progress");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full">
        <DialogHeader>
          <DialogTitle>Log Progress - {goal.name}</DialogTitle>
        </DialogHeader>

        {goal.tracking_unit === "binary" ? (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={progressValue === 1}
              id="completed"
              onCheckedChange={(checked) => setProgressValue(checked ? 1 : 0)}
              disabled={alreadyLogged}
            />
            <label htmlFor="completed" className="text-sm font-medium">
              Mark as completed for today
            </label>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {goal.tracking_unit === "duration" ? "Minutes" : "Count"}
            </label>
            <Input
              type="number"
              value={progressValue}
              min={0}
              onChange={(e) => setProgressValue(Number(e.target.value))}
              disabled={alreadyLogged}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes (optional)</label>
          <Textarea
            placeholder="Progress notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={alreadyLogged}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || alreadyLogged}
            className="w-full"
          >
            {alreadyLogged ? "Already logged today" : isSubmitting ? "Logging..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
