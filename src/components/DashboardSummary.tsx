
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Award, Calendar, BarChart2 } from 'lucide-react';
import { Goal } from '@/types';

interface DashboardSummaryProps {
  goals: Goal[];
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ goals }) => {
  // Calculate longest active streak across all goals
  const longestActiveStreak = Math.max(...goals.map(goal => goal.current_streak), 0);
  
  // Calculate longest ever streak
  const longestEverStreak = Math.max(...goals.map(goal => goal.longest_streak), 0);
  
  // Calculate total number of active goals
  const totalActiveGoals = goals.length;
  
  // Calculate completion rate (if we had more data, this would be more accurate)
  const completionRate = 85; // Mocked value, in a real app this would be calculated from historical data
  
  const summaryCards = [
    {
      title: 'Longest Active Streak',
      value: longestActiveStreak,
      icon: Flame,
      color: 'text-streak-primary',
      bg: 'bg-streak-primary/10',
    },
    {
      title: 'Longest Ever Streak',
      value: longestEverStreak,
      icon: Award,
      color: 'text-streak-success',
      bg: 'bg-streak-success/10',
    },
    {
      title: 'Active Goals',
      value: totalActiveGoals,
      icon: Calendar,
      color: 'text-streak-info',
      bg: 'bg-streak-info/10',
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: BarChart2,
      color: 'text-streak-warning',
      bg: 'bg-streak-warning/10',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {summaryCards.map((card, index) => (
        <Card key={index} className="border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{card.value}</div>
              <div className={`${card.bg} ${card.color} p-2 rounded-full`}>
                <card.icon size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
