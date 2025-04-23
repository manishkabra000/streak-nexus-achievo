
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Goal } from '@/types';
import { Calendar, Award, Zap, Flame, Github, Code, Dumbbell, Book } from 'lucide-react';

interface StreakCardProps {
  goal: Goal;
  progress?: number; // 0-100
  onClick?: () => void;
}

export const StreakCard: React.FC<StreakCardProps> = ({ goal, progress = 0, onClick }) => {
  const getIcon = () => {
    switch (goal.icon) {
      case 'github':
        return <Github className="h-6 w-6" />;
      case 'code':
        return <Code className="h-6 w-6" />;
      case 'dumbbell':
        return <Dumbbell className="h-6 w-6" />;
      case 'book':
        return <Book className="h-6 w-6" />;
      default:
        return <Calendar className="h-6 w-6" />;
    }
  };

  const getFrequencyText = () => {
    switch (goal.frequency) {
      case 'daily':
        return 'Daily';
      case 'weekdays':
        return 'Weekdays';
      case 'weekends':
        return 'Weekends';
      case 'custom':
        return 'Custom';
      default:
        return 'Daily';
    }
  };

  const renderProgress = () => {
    if (goal.tracking_unit === 'binary') {
      return null;
    }
    
    return (
      <div className="mt-2">
        <Progress value={progress} className="h-2" />
        <div className="mt-1 text-xs text-muted-foreground flex justify-between">
          <span>Today's progress</span>
          <span>{progress}%</span>
        </div>
      </div>
    );
  };

  return (
    <Card 
      className={`streak-card overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
        goal.current_streak > 0 ? 'streak-glow' : ''
      }`}
      style={{ 
        borderColor: goal.color,
        borderWidth: '2px'
      }}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Badge 
            variant="outline"
            className="bg-muted"
          >
            {getFrequencyText()}
          </Badge>
          <span className="flex items-center text-sm">
            <Flame className="h-4 w-4 mr-1 text-streak-primary" />
            <span className="font-bold">{goal.current_streak}</span>
            <span className="mx-1">|</span>
            <Award className="h-4 w-4 mr-1 text-streak-success" />
            <span>{goal.longest_streak}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <div 
            className="rounded-full p-2 mr-3"
            style={{ backgroundColor: `${goal.color}25` }}
          >
            {getIcon()}
          </div>
          <div>
            <CardTitle className="text-base">{goal.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          </div>
        </div>
        {renderProgress()}
      </CardContent>
      <CardFooter className="bg-card border-t border-border pt-3 pb-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <Zap className="h-4 w-4 mr-1 text-streak-warning" />
            <span className="text-sm">
              {goal.tracking_unit === 'binary' ? 'Complete today' : `Target: ${goal.target_value} ${goal.tracking_unit === 'duration' ? 'mins' : 'times'}`}
            </span>
          </div>
          {goal.current_streak > 0 && (
            <Badge 
              className={`animate-pulse-streak`}
              style={{ backgroundColor: goal.color }}
            >
              {goal.current_streak} day streak
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
