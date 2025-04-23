
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Goal, GoalProgress, MOCK_DATA, GoalType, GoalFrequency, TrackingUnit } from '@/types';
import { useAuth } from './AuthContext';

interface GoalContextType {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  addGoal: (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'current_streak' | 'longest_streak'>) => Promise<Goal>;
  updateGoal: (id: string, goalData: Partial<Goal>) => Promise<Goal>;
  deleteGoal: (id: string) => Promise<void>;
  getGoalById: (id: string) => Goal | undefined;
  trackProgress: (goalId: string, date: string, value: number, notes?: string) => Promise<void>;
  getProgressForGoal: (goalId: string, startDate?: string, endDate?: string) => GoalProgress[];
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [progress, setProgress] = useState<GoalProgress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoals = async () => {
      if (!user) {
        setGoals([]);
        setProgress([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call to fetch goals
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, we would fetch from the backend
        // For demo, we use mock data
        setGoals(MOCK_DATA.goals);
        
        // Generate mock progress data
        const mockProgress: GoalProgress[] = [];
        const today = new Date();
        
        MOCK_DATA.goals.forEach(goal => {
          // Create progress entries for the last 30 days
          for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Skip some days randomly to simulate incomplete streaks
            if (Math.random() > 0.8 && i > 0) continue;
            
            // For current streak days, always add progress
            if (i < goal.current_streak) {
              mockProgress.push({
                id: `progress-${goal.id}-${dateStr}`,
                goal_id: goal.id,
                date: dateStr,
                value: goal.tracking_unit === 'binary' ? 1 : Math.floor(Math.random() * goal.target_value * 1.5) + goal.target_value / 2,
                completed: true,
                notes: i === 0 ? 'Great job today!' : undefined
              });
            }
          }
        });
        
        setProgress(mockProgress);
      } catch (err) {
        console.error('Failed to load goals', err);
        setError('Failed to load goals. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadGoals();
  }, [user]);

  const addGoal = async (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'current_streak' | 'longest_streak'>): Promise<Goal> => {
    if (!user) throw new Error('Must be logged in to add a goal');
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newGoal: Goal = {
        ...goalData,
        id: `goal-${Date.now()}`,
        user_id: user.id,
        created_at: new Date().toISOString(),
        current_streak: 0,
        longest_streak: 0
      };
      
      setGoals(prevGoals => [...prevGoals, newGoal]);
      return newGoal;
    } catch (err) {
      console.error('Failed to add goal', err);
      setError('Failed to add goal. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoal = async (id: string, goalData: Partial<Goal>): Promise<Goal> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let updatedGoal: Goal | undefined;
      
      setGoals(prevGoals => 
        prevGoals.map(goal => {
          if (goal.id === id) {
            updatedGoal = { ...goal, ...goalData };
            return updatedGoal;
          }
          return goal;
        })
      );
      
      if (!updatedGoal) throw new Error('Goal not found');
      return updatedGoal;
    } catch (err) {
      console.error('Failed to update goal', err);
      setError('Failed to update goal. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGoal = async (id: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
      setProgress(prevProgress => prevProgress.filter(p => p.goal_id !== id));
    } catch (err) {
      console.error('Failed to delete goal', err);
      setError('Failed to delete goal. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getGoalById = (id: string): Goal | undefined => {
    return goals.find(goal => goal.id === id);
  };

  const trackProgress = async (goalId: string, date: string, value: number, notes?: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const goal = goals.find(g => g.id === goalId);
      if (!goal) throw new Error('Goal not found');
      
      const isCompleted = goal.tracking_unit === 'binary' ? value === 1 : value >= goal.target_value;
      
      // Check if we already have progress for this date
      const existingProgressIndex = progress.findIndex(p => p.goal_id === goalId && p.date === date);
      
      let newProgress: GoalProgress;
      
      if (existingProgressIndex !== -1) {
        // Update existing progress
        newProgress = {
          ...progress[existingProgressIndex],
          value,
          completed: isCompleted,
          notes: notes || progress[existingProgressIndex].notes
        };
        
        setProgress(prevProgress => [
          ...prevProgress.slice(0, existingProgressIndex),
          newProgress,
          ...prevProgress.slice(existingProgressIndex + 1)
        ]);
      } else {
        // Add new progress
        newProgress = {
          id: `progress-${goalId}-${date}`,
          goal_id: goalId,
          date,
          value,
          completed: isCompleted,
          notes
        };
        
        setProgress(prevProgress => [...prevProgress, newProgress]);
      }
      
      // Update streak if completed today
      if (isCompleted && date === new Date().toISOString().split('T')[0]) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        // Check if there was a completion yesterday
        const completedYesterday = progress.some(
          p => p.goal_id === goalId && p.date === yesterdayStr && p.completed
        );
        
        let newStreak = 1;
        if (completedYesterday) {
          newStreak = goal.current_streak + 1;
        }
        
        // Update the goal with the new streak
        setGoals(prevGoals => 
          prevGoals.map(g => {
            if (g.id === goalId) {
              return {
                ...g,
                current_streak: newStreak,
                longest_streak: Math.max(g.longest_streak, newStreak),
                last_completed: today
              };
            }
            return g;
          })
        );
      }
    } catch (err) {
      console.error('Failed to track progress', err);
      setError('Failed to track progress. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressForGoal = (goalId: string, startDate?: string, endDate?: string): GoalProgress[] => {
    let filteredProgress = progress.filter(p => p.goal_id === goalId);
    
    if (startDate) {
      filteredProgress = filteredProgress.filter(p => p.date >= startDate);
    }
    
    if (endDate) {
      filteredProgress = filteredProgress.filter(p => p.date <= endDate);
    }
    
    return filteredProgress.sort((a, b) => a.date.localeCompare(b.date));
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        isLoading,
        error,
        addGoal,
        updateGoal,
        deleteGoal,
        getGoalById,
        trackProgress,
        getProgressForGoal
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};
