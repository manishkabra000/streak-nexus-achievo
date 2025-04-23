
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Goal, GoalProgress } from '@/types';

interface StreakHeatMapProps {
  goal: Goal;
  progressData: GoalProgress[];
  numWeeks?: number; // Number of weeks to display, default 12
}

export const StreakHeatMap: React.FC<StreakHeatMapProps> = ({ goal, progressData, numWeeks = 12 }) => {
  // Generate dates for the past weeks (default 12 weeks = ~3 months)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    const daysToShow = numWeeks * 7;
    
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (daysToShow - i - 1));
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const dates = generateDates();
  
  // Group dates by week
  const groupByWeek = () => {
    const weekArray = [];
    let currentWeek = [];
    
    for (let i = 0; i < dates.length; i++) {
      currentWeek.push(dates[i]);
      
      if (currentWeek.length === 7 || i === dates.length - 1) {
        weekArray.push(currentWeek);
        currentWeek = [];
      }
    }
    
    return weekArray;
  };
  
  const weekData = groupByWeek();
  
  // Get intensity (0-4) for a date based on progress
  const getIntensity = (dateStr: string) => {
    const progress = progressData.find(p => p.date === dateStr);
    
    if (!progress) return 0;
    if (!progress.completed) return 1;
    
    if (goal.tracking_unit === 'binary') return 3;
    
    // For count or duration, calculate intensity based on how much over target
    const ratio = progress.value / goal.target_value;
    if (ratio <= 1) return 2;
    if (ratio <= 1.5) return 3;
    return 4;
  };
  
  // Get color for intensity level
  const getColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-secondary';
      case 1: return 'bg-streak-danger/30';
      case 2: return 'bg-streak-primary/30';
      case 3: return 'bg-streak-primary/70';
      case 4: return 'bg-streak-primary';
      default: return 'bg-secondary';
    }
  };
  
  // Format date for tooltip
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Streak History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex min-w-max">
            {weekData.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className="flex flex-col mr-1">
                {week.map(date => {
                  const intensity = getIntensity(date);
                  const color = getColor(intensity);
                  const progress = progressData.find(p => p.date === date);
                  
                  return (
                    <TooltipProvider key={date}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div 
                            className={`heat-map-cell ${color} w-4 h-4 mb-1 rounded-sm`}
                          ></div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-bold">{formatDate(date)}</p>
                            {progress ? (
                              <>
                                <p>Value: {progress.value}</p>
                                <p>Status: {progress.completed ? 'Completed' : 'Incomplete'}</p>
                                {progress.notes && <p>Notes: {progress.notes}</p>}
                              </>
                            ) : (
                              <p>No data</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            ))}
          </div>
          
          <div className="flex mt-2 text-xs text-muted-foreground">
            <div className="flex items-center mr-4">
              <div className={`w-3 h-3 ${getColor(0)} rounded-sm mr-1`}></div>
              <span>No Data</span>
            </div>
            <div className="flex items-center mr-4">
              <div className={`w-3 h-3 ${getColor(1)} rounded-sm mr-1`}></div>
              <span>Missed</span>
            </div>
            <div className="flex items-center mr-4">
              <div className={`w-3 h-3 ${getColor(2)} rounded-sm mr-1`}></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 ${getColor(4)} rounded-sm mr-1`}></div>
              <span>Exceeded</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
