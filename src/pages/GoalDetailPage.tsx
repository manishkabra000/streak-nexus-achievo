
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useGoals } from '@/contexts/GoalContext';
import { StreakHeatMap } from '@/components/StreakHeatMap';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Check,
  Edit,
  Github,
  Code,
  Dumbbell,
  BookOpen,
  CalendarClock,
  Trash,
} from 'lucide-react';
import { GoalFrequency, TrackingUnit } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';

const GoalDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getGoalById, trackProgress, getProgressForGoal, updateGoal, deleteGoal } = useGoals();
  const { isAuthenticated } = useAuth();
  const [goal, setGoal] = useState(getGoalById(id || ''));
  const [progressData, setProgressData] = useState(getProgressForGoal(id || ''));
  const [isTracking, setIsTracking] = useState(false);
  const [progressValue, setProgressValue] = useState<number>(goal?.tracking_unit === 'binary' ? 1 : goal?.target_value || 0);
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!id || !goal) {
      navigate('/goals');
      return;
    }
    
    // Refresh goal data
    setGoal(getGoalById(id));
    setProgressData(getProgressForGoal(id));
  }, [id, isAuthenticated, navigate, getGoalById, getProgressForGoal]);
  
  if (!goal) {
    return null;
  }
  
  const getTypeIcon = () => {
    switch (goal.type) {
      case 'github':
        return <Github className="h-6 w-6 text-streak-github" />;
      case 'leetcode':
        return <Code className="h-6 w-6 text-streak-leetcode" />;
      case 'custom':
        if (goal.icon === 'dumbbell') return <Dumbbell className="h-6 w-6 text-streak-success" />;
        if (goal.icon === 'book') return <BookOpen className="h-6 w-6 text-streak-info" />;
        return <CalendarClock className="h-6 w-6 text-streak-default" />;
      default:
        return <CalendarClock className="h-6 w-6 text-streak-default" />;
    }
  };
  
  const getFrequencyText = (frequency: GoalFrequency) => {
    switch (frequency) {
      case 'daily':
        return 'Every day';
      case 'weekdays':
        return 'Weekdays only';
      case 'weekends':
        return 'Weekends only';
      case 'custom':
        return 'Custom days';
      default:
        return 'Every day';
    }
  };

  const getTrackingUnitText = (unit: TrackingUnit, value: number) => {
    switch (unit) {
      case 'binary':
        return 'Complete';
      case 'count':
        return `${value} times`;
      case 'duration':
        return `${value} minutes`;
      default:
        return `${value}`;
    }
  };
  
  const handleTrackProgress = async () => {
    setIsTracking(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await trackProgress(goal.id, today, progressValue, notes);
      
      // Refresh progress data
      setProgressData(getProgressForGoal(goal.id));
      setGoal(getGoalById(goal.id)); // Update goal to get latest streak
      
      toast.success('Progress tracked successfully!');
      setNotes('');
    } catch (error) {
      console.error('Failed to track progress', error);
      toast.error('Failed to track progress');
    } finally {
      setIsTracking(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      try {
        await deleteGoal(goal.id);
        toast.success('Goal deleted successfully');
        navigate('/goals');
      } catch (error) {
        console.error('Failed to delete goal', error);
        toast.error('Failed to delete goal');
      }
    }
  };
  
  // Check if goal was completed today
  const today = new Date().toISOString().split('T')[0];
  const completedToday = progressData.some(p => p.date === today && p.completed);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/goals')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Button>
          
          <div className="ml-auto flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/goals/${goal.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDelete}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${goal.color}25` }}
                  >
                    {getTypeIcon()}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{goal.name}</CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Frequency</h4>
                    <p className="font-medium">{getFrequencyText(goal.frequency)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Target</h4>
                    <p className="font-medium">{getTrackingUnitText(goal.tracking_unit, goal.target_value)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Current Streak</h4>
                    <p className="font-medium">{goal.current_streak} days</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Longest Streak</h4>
                    <p className="font-medium">{goal.longest_streak} days</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                    <p className="font-medium">
                      {new Date(goal.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Last Completed</h4>
                    <p className="font-medium">
                      {goal.last_completed ? new Date(goal.last_completed).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Completion History</CardTitle>
              </CardHeader>
              <CardContent>
                <StreakHeatMap goal={goal} progressData={progressData} numWeeks={12} />
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-96 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  {completedToday 
                    ? 'You\'ve already completed this goal today!' 
                    : 'Record your progress for today'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {goal.tracking_unit === 'binary' ? (
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="completed" 
                      checked={progressValue === 1}
                      onCheckedChange={(checked) => setProgressValue(checked ? 1 : 0)}
                    />
                    <label
                      htmlFor="completed"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Mark as completed
                    </label>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {goal.tracking_unit === 'duration' ? 'Minutes' : 'Count'}
                    </label>
                    <Input
                      type="number"
                      value={progressValue}
                      onChange={(e) => setProgressValue(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes (optional)</label>
                  <Textarea
                    placeholder="Add notes about your progress..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleTrackProgress}
                  disabled={isTracking || completedToday}
                >
                  {isTracking ? 'Saving...' : completedToday ? 'Already Completed' : 'Save Progress'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.length > 0 ? (
                    progressData
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map((progress) => (
                        <div key={progress.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <p className="font-medium">
                                  {new Date(progress.date).toLocaleDateString()}
                                </p>
                              </div>
                              
                              <div className="flex items-center mt-1">
                                {progress.completed ? (
                                  <Check className="h-4 w-4 text-green-500 mr-2" />
                                ) : (
                                  <span className="h-4 w-4 mr-2" />
                                )}
                                <p className="text-sm text-muted-foreground">
                                  {goal.tracking_unit === 'binary' 
                                    ? (progress.completed ? 'Completed' : 'Not completed')
                                    : `${progress.value} ${goal.tracking_unit === 'duration' ? 'minutes' : 'times'}`}
                                </p>
                              </div>
                            </div>
                            
                            {progress.completed && (
                              <div className="ml-auto flex items-center justify-center h-8 w-8 rounded-full bg-green-500/10">
                                <Check className="h-4 w-4 text-green-500" />
                              </div>
                            )}
                          </div>
                          
                          {progress.notes && (
                            <p className="mt-2 text-sm text-muted-foreground">{progress.notes}</p>
                          )}
                        </div>
                      ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No activity recorded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GoalDetailPage;
