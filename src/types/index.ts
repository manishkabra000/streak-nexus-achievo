
// Types for Achievo application

// Goal Types
export type GoalType = 'github' | 'leetcode' | 'custom';

export type GoalFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom';

export type TrackingUnit = 'binary' | 'count' | 'duration';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  created_at: string;
  integrations: {
    github?: boolean;
    leetcode?: boolean;
  };
}

// Goal interface
export interface Goal {
  id: string;
  name: string;
  description: string;
  type: GoalType;
  icon: string;
  color: string;
  user_id: string;
  created_at: string;
  frequency: GoalFrequency;
  tracking_unit: TrackingUnit;
  target_value: number;
  custom_days?: number[]; // 0-6 for custom days (0 = Sunday)
  current_streak: number;
  longest_streak: number;
  last_completed?: string;
}

// Goal Progress
export interface GoalProgress {
  id: string;
  goal_id: string;
  date: string;
  value: number;
  completed: boolean;
  notes?: string;
}

// GitHub Stats
export interface GitHubStats {
  total_contributions: number;
  current_streak: number;
  longest_streak: number;
  contributions_by_day: Record<string, number>;
}

// LeetCode Stats
export interface LeetCodeStats {
  solved_problems: number;
  easy_count: number;
  medium_count: number;
  hard_count: number;
  daily_streak: number;
  submissions_by_day: Record<string, number>;
}

// Achievement
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
  unlocked_at?: string;
  progress?: number; // 0-100
  goal?: number;
  user_id: string;
}

// Mock data for development
export const MOCK_DATA = {
  user: {
    id: 'user-1',
    name: 'Jane Developer',
    email: 'jane@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Developer&background=8B5CF6&color=fff',
    created_at: '2023-01-01T00:00:00Z',
    integrations: {
      github: true,
      leetcode: true
    }
  } as User,
  
  goals: [
    {
      id: 'goal-1',
      name: 'GitHub Contribution',
      description: 'Make at least one GitHub contribution daily',
      type: 'github',
      icon: 'github',
      color: '#8B5CF6',
      user_id: 'user-1',
      created_at: '2023-01-01T00:00:00Z',
      frequency: 'daily',
      tracking_unit: 'count',
      target_value: 1,
      current_streak: 12,
      longest_streak: 30
    },
    {
      id: 'goal-2',
      name: 'LeetCode Problem',
      description: 'Solve at least one LeetCode problem daily',
      type: 'leetcode',
      icon: 'code',
      color: '#FFA116',
      user_id: 'user-1',
      created_at: '2023-01-01T00:00:00Z',
      frequency: 'daily',
      tracking_unit: 'count',
      target_value: 1,
      current_streak: 8,
      longest_streak: 15
    },
    {
      id: 'goal-3',
      name: 'Workout',
      description: 'Exercise for at least 30 minutes',
      type: 'custom',
      icon: 'dumbbell',
      color: '#10B981',
      user_id: 'user-1',
      created_at: '2023-01-10T00:00:00Z',
      frequency: 'weekdays',
      tracking_unit: 'duration',
      target_value: 30,
      current_streak: 5,
      longest_streak: 10
    },
    {
      id: 'goal-4',
      name: 'Reading',
      description: 'Read for at least 20 minutes',
      type: 'custom',
      icon: 'book',
      color: '#3B82F6',
      user_id: 'user-1',
      created_at: '2023-01-15T00:00:00Z',
      frequency: 'daily',
      tracking_unit: 'duration',
      target_value: 20,
      current_streak: 3,
      longest_streak: 7
    }
  ] as Goal[],
  
  achievements: [
    {
      id: 'achievement-1',
      name: 'Streak Starter',
      description: 'Maintain a 3-day streak on any goal',
      icon: 'award',
      tier: 'bronze',
      unlocked: true,
      unlocked_at: '2023-01-04T00:00:00Z',
      user_id: 'user-1'
    },
    {
      id: 'achievement-2',
      name: 'Consistency King',
      description: 'Maintain a 7-day streak on any goal',
      icon: 'crown',
      tier: 'silver',
      unlocked: true,
      unlocked_at: '2023-01-08T00:00:00Z',
      user_id: 'user-1'
    },
    {
      id: 'achievement-3',
      name: 'GitHub Champion',
      description: 'Maintain a 30-day GitHub contribution streak',
      icon: 'github',
      tier: 'gold',
      unlocked: false,
      progress: 40,
      goal: 30,
      user_id: 'user-1'
    },
    {
      id: 'achievement-4',
      name: 'LeetCode Master',
      description: 'Solve 100 LeetCode problems',
      icon: 'code',
      tier: 'platinum',
      unlocked: false,
      progress: 65,
      goal: 100,
      user_id: 'user-1'
    }
  ] as Achievement[],
  
  github_stats: {
    total_contributions: 756,
    current_streak: 12,
    longest_streak: 30,
    contributions_by_day: {
      '2023-03-01': 3,
      '2023-03-02': 5,
      '2023-03-03': 2,
      '2023-03-04': 0,
      '2023-03-05': 1,
      '2023-03-06': 7,
      '2023-03-07': 4,
      // Add more dates...
    }
  } as GitHubStats,
  
  leetcode_stats: {
    solved_problems: 65,
    easy_count: 30,
    medium_count: 25,
    hard_count: 10,
    daily_streak: 8,
    submissions_by_day: {
      '2023-03-01': 1,
      '2023-03-02': 2,
      '2023-03-03': 1,
      '2023-03-04': 1,
      '2023-03-05': 0,
      '2023-03-06': 1,
      '2023-03-07': 1,
      // Add more dates...
    }
  } as LeetCodeStats
};
