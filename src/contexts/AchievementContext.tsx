
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Achievement, MOCK_DATA } from '@/types';
import { useAuth } from './AuthContext';
import { useGoals } from './GoalContext';

interface AchievementContextType {
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
  getUnlockedAchievements: () => Achievement[];
  getInProgressAchievements: () => Achievement[];
  checkNewAchievements: () => Promise<Achievement[]>;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { goals } = useGoals();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAchievements = async () => {
      if (!user) {
        setAchievements([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call to fetch achievements
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // In a real app, we would fetch from the backend
        // For demo, we use mock data
        setAchievements(MOCK_DATA.achievements);
      } catch (err) {
        console.error('Failed to load achievements', err);
        setError('Failed to load achievements. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAchievements();
  }, [user]);

  const getUnlockedAchievements = (): Achievement[] => {
    return achievements.filter(achievement => achievement.unlocked);
  };

  const getInProgressAchievements = (): Achievement[] => {
    return achievements.filter(achievement => !achievement.unlocked && achievement.progress !== undefined);
  };

  const checkNewAchievements = async (): Promise<Achievement[]> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const newAchievements: Achievement[] = [];
      
      // Check for streak achievements
      const highestStreak = Math.max(...goals.map(goal => goal.current_streak), 0);
      
      const streakAchievements = [
        { id: 'achievement-1', threshold: 3, tier: 'bronze' },
        { id: 'achievement-2', threshold: 7, tier: 'silver' },
        { id: 'achievement-3', threshold: 30, tier: 'gold' },
      ];
      
      streakAchievements.forEach(({ id, threshold, tier }) => {
        const achievement = achievements.find(a => a.id === id);
        if (achievement && !achievement.unlocked && highestStreak >= threshold) {
          const updatedAchievement: Achievement = {
            ...achievement,
            unlocked: true,
            unlocked_at: new Date().toISOString()
          };
          
          newAchievements.push(updatedAchievement);
        }
      });
      
      if (newAchievements.length > 0) {
        setAchievements(prevAchievements => 
          prevAchievements.map(a => {
            const updated = newAchievements.find(na => na.id === a.id);
            return updated || a;
          })
        );
      }
      
      return newAchievements;
    } catch (err) {
      console.error('Failed to check for achievements', err);
      setError('Failed to check for achievements. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        isLoading,
        error,
        getUnlockedAchievements,
        getInProgressAchievements,
        checkNewAchievements
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};
