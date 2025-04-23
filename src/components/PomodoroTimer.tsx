import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useGoals } from "@/contexts/GoalContext";
import { toast } from "sonner";
import { SessionNotesDialog } from "@/components/SessionNotesDialog";

export const PomodoroTimer: React.FC = () => {
  const { goals, trackProgress } = useGoals();

  // Adjustable session length (in minutes), default 25
  const [sessionMinutes, setSessionMinutes] = useState(25);
  // Internal state for session time in seconds
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [selectedGoalId, setSelectedGoalId] = useState<string>(goals[0]?.id ?? "");
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [pendingNotes, setPendingNotes] = useState("");
  const [progressDate, setProgressDate] = useState(""); // ISO date string for progress
  const [notesLoading, setNotesLoading] = useState(false);

  // Reset timer when break toggled or sessionMinutes changes and not running
  useEffect(() => {
    if (isBreak) {
      setSecondsLeft(5 * 60); // 5 min break
    } else if (!isRunning) {
      setSecondsLeft(sessionMinutes * 60);
    }
  }, [isBreak, sessionMinutes, isRunning]);

  // Timer countdown effect
  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // When timer hits 0
  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      if (!isBreak) {
        // Only log when focus session is done
        handlePomodoroEnd();
      } else {
        toast("Break complete! Ready for another session?");
      }
      setIsBreak(isBreakPrev => !isBreakPrev);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const handleStart = () => {
    if (!selectedGoalId && !isBreak) {
      toast.error("Select a goal before starting.");
      return;
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(isBreak ? 5 * 60 : sessionMinutes * 60);
  };

  const handleGoalChange = (goalId: string) => {
    setSelectedGoalId(goalId);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSessionMinutesChange = (value: number) => {
    setSessionMinutes(value);
  };

  const handleSessionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 10;
    val = Math.max(10, Math.min(val, 60));
    setSessionMinutes(val);
  };

  const handleSessionInputBlur = () => {
    // If not running and in focus, update timer
    if (!isBreak && !isRunning) {
      setSecondsLeft(sessionMinutes * 60);
    }
  };

  const handlePomodoroEnd = async () => {
    if (!selectedGoalId) return;
    const today = new Date().toISOString().split("T")[0];
    const selectedGoal = goals.find(g => g.id === selectedGoalId);

    let progressValue = 1;
    if (selectedGoal?.tracking_unit === "duration") progressValue = sessionMinutes;
    if (selectedGoal?.tracking_unit === "count") progressValue = selectedGoal.target_value;

    // Show notes dialog after session completes. We want to have the goal name
    setProgressDate(today);
    setPendingNotes(""); // Reset pending notes
    setShowNotesDialog(true);
    // Do NOT log progress here yet! Wait for user to save from popup.
  };

  const handleSaveSessionNotes = async (notes: string) => {
    setNotesLoading(true);
    try {
      await trackProgress(selectedGoalId, progressDate, 
        goals.find(g => g.id === selectedGoalId)?.tracking_unit === "duration"
          ? sessionMinutes
          : goals.find(g => g.id === selectedGoalId)?.target_value ?? 1,
        notes
      );
      toast.success("Progress and notes updated!");
      setShowNotesDialog(false);
    } catch {
      toast.error("Failed to save notes. Please try again.");
    } finally {
      setNotesLoading(false);
    }
  };

  const canAdjustSettings = !isRunning && !isBreak;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8 shadow animate-fade-in max-w-lg mx-auto">
      <h3 className="text-xl font-semibold mb-4">Pomodoro Timer</h3>
      {/* Goal Select only visible in focus session */}
      {!isBreak && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Goal</label>
          <Select value={selectedGoalId} onValueChange={handleGoalChange} disabled={isRunning}>
            <SelectTrigger>
              <SelectValue placeholder="Pick goal" />
            </SelectTrigger>
            <SelectContent>
              {goals.map(goal => (
                <SelectItem value={goal.id} key={goal.id}>
                  {goal.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {/* Adjustable session length before starting focus session */}
      {!isBreak && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Session Length (minutes)</label>
          <div className="flex items-center gap-2">
            <Slider
              min={10}
              max={60}
              step={1}
              value={[sessionMinutes]}
              onValueChange={([v]) => handleSessionMinutesChange(v)}
              disabled={!canAdjustSettings}
              className="flex-1"
              aria-label="Session Minutes"
            />
            <Input
              type="number"
              min={10}
              max={60}
              step={1}
              disabled={!canAdjustSettings}
              value={sessionMinutes}
              onChange={handleSessionInput}
              onBlur={handleSessionInputBlur}
              className="w-20 px-2 py-1"
            />
          </div>
        </div>
      )}
      <div className="flex flex-col items-center space-y-4">
        <div className="text-5xl font-mono mb-2">{formatTime(secondsLeft)}</div>
        <div className="flex gap-2">
          {isRunning ? (
            <Button variant="outline" onClick={handlePause}>Pause</Button>
          ) : (
            <Button onClick={handleStart} disabled={secondsLeft === 0}>
              {secondsLeft === (isBreak ? 5 * 60 : sessionMinutes * 60) ? "Start" : "Resume"}
            </Button>
          )}
          <Button variant="ghost" onClick={handleReset}>Reset</Button>
        </div>
        <div className="text-muted-foreground text-xs">
          {isBreak ? "Break Time" : "Focus Session"}
        </div>
      </div>

      {showNotesDialog && selectedGoalId && (
        <SessionNotesDialog
          open={showNotesDialog}
          onOpenChange={open => setShowNotesDialog(open)}
          goalName={goals.find(g => g.id === selectedGoalId)?.name ?? ""}
          initialNotes={pendingNotes}
          onSave={handleSaveSessionNotes}
        />
      )}
    </div>
  );
};
