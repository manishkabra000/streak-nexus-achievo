
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGoals } from "@/contexts/GoalContext";
import { toast } from "sonner";

/**
 * Simple Pomodoro Timer with goal selection and automatic log on completion.
 */
export const PomodoroTimer: React.FC = () => {
  const { goals, trackProgress } = useGoals();

  const [selectedGoalId, setSelectedGoalId] = useState<string>(goals[0]?.id ?? "");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60); // Default 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer when break toggled
  useEffect(() => {
    if (isBreak) {
      setSecondsLeft(5 * 60); // 5 min break
    } else {
      setSecondsLeft(25 * 60); // 25 min pomodoro
    }
  }, [isBreak]);

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
    setSecondsLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const handleGoalChange = (goalId: string) => {
    setSelectedGoalId(goalId);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handlePomodoroEnd = async () => {
    if (!selectedGoalId) return;

    const today = new Date().toISOString().split("T")[0];
    const selectedGoal = goals.find(g => g.id === selectedGoalId);

    let progressValue = 1;
    if (selectedGoal?.tracking_unit === "duration") progressValue = 25;
    if (selectedGoal?.tracking_unit === "count") progressValue = selectedGoal.target_value;

    try {
      await trackProgress(selectedGoalId, today, progressValue, "Auto-logged by Pomodoro Timer");
      toast.success(`Pomodoro complete! Progress logged for "${selectedGoal?.name}".`);
    } catch {
      toast.error("Failed to log progress for this goal.");
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8 shadow animate-fade-in max-w-lg mx-auto">
      <h3 className="text-xl font-semibold mb-4">Pomodoro Timer</h3>
      {!isBreak && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Goal</label>
          <Select value={selectedGoalId} onValueChange={handleGoalChange}>
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
      <div className="flex flex-col items-center space-y-4">
        <div className="text-5xl font-mono mb-2">{formatTime(secondsLeft)}</div>
        <div className="flex gap-2">
          {isRunning ? (
            <Button variant="outline" onClick={handlePause}>Pause</Button>
          ) : (
            <Button onClick={handleStart}>{secondsLeft === (isBreak ? 5 * 60 : 25 * 60) ? "Start" : "Resume"}</Button>
          )}
          <Button variant="ghost" onClick={handleReset}>Reset</Button>
        </div>
        <div className="text-muted-foreground text-xs">
          {isBreak ? "Break Time" : "Focus Session"}
        </div>
      </div>
    </div>
  );
};

