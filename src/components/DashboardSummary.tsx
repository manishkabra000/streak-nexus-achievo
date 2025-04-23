
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Award, Calendar, BarChart2 } from 'lucide-react';
import { Goal } from '@/types';

interface DashboardSummaryProps {
  goals: Goal[];
}

// All values blank if no goals
export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ goals }) => {
  // If no goals for the user, show empty states (no dummy values)
  if (!goals || goals.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Longest Active Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-muted-foreground"></div>
              <div className="bg-streak-primary/10 text-streak-primary p-2 rounded-full">
                <Flame size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Longest Ever Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-muted-foreground"></div>
              <div className="bg-streak-success/10 text-streak-success p-2 rounded-full">
                <Award size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-muted-foreground"></div>
              <div className="bg-streak-info/10 text-streak-info p-2 rounded-full">
                <Calendar size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-muted-foreground"></div>
              <div className="bg-streak-warning/10 text-streak-warning p-2 rounded-full">
                <BarChart2 size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Only show real values
  const longestActiveStreak = Math.max(...goals.map(g => g.current_streak), 0) || '';
  const longestEverStreak = Math.max(...goals.map(g => g.longest_streak), 0) || '';
  const totalActiveGoals = goals.length || '';
  // if we ever add completion rate again, use real data only
  const completionRate = '';

  const summaryCards = [
    {
      title: 'Longest Active Streak',
      value: longestActiveStreak ? longestActiveStreak : '',
      icon: Flame,
      color: 'text-streak-primary',
      bg: 'bg-streak-primary/10',
    },
    {
      title: 'Longest Ever Streak',
      value: longestEverStreak ? longestEverStreak : '',
      icon: Award,
      color: 'text-streak-success',
      bg: 'bg-streak-success/10',
    },
    {
      title: 'Active Goals',
      value: totalActiveGoals ? totalActiveGoals : '',
      icon: Calendar,
      color: 'text-streak-info',
      bg: 'bg-streak-info/10',
    },
    {
      title: 'Completion Rate',
      value: completionRate,
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
