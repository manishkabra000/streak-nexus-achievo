
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useGoals } from '@/contexts/GoalContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Github, Code, CalendarClock, Dumbbell, BookOpen } from 'lucide-react';
import { GoalType, GoalFrequency, TrackingUnit } from '@/types';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const goalTypeOptions = [
  { value: 'github', label: 'GitHub', icon: Github, color: '#8B5CF6' },
  { value: 'leetcode', label: 'LeetCode', icon: Code, color: '#FFA116' },
  { value: 'custom', label: 'Custom', icon: CalendarClock, color: '#10B981' },
];

const customIconOptions = [
  { value: 'calendar', label: 'Calendar', icon: CalendarClock, color: '#3B82F6' },
  { value: 'dumbbell', label: 'Workout', icon: Dumbbell, color: '#10B981' },
  { value: 'book', label: 'Reading', icon: BookOpen, color: '#EC4899' },
];

const frequencyOptions = [
  { value: 'daily', label: 'Every day' },
  { value: 'weekdays', label: 'Weekdays only' },
  { value: 'weekends', label: 'Weekends only' },
  { value: 'custom', label: 'Custom days' },
];

const trackingUnitOptions = [
  { value: 'binary', label: 'Completion (yes/no)' },
  { value: 'count', label: 'Count (number of times)' },
  { value: 'duration', label: 'Duration (minutes)' },
];

const NewGoalPage = () => {
  const navigate = useNavigate();
  const { addGoal } = useGoals();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GoalType>('custom');
  const [icon, setIcon] = useState('calendar');
  const [color, setColor] = useState('#3B82F6');
  const [frequency, setFrequency] = useState<GoalFrequency>('daily');
  const [trackingUnit, setTrackingUnit] = useState<TrackingUnit>('binary');
  const [targetValue, setTargetValue] = useState(1);
  const [customDays, setCustomDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri by default
  
  // UI state
  const [isCustomType, setIsCustomType] = useState(false);
  const [isCustomFrequency, setIsCustomFrequency] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const handleTypeChange = (value: string) => {
    const selectedType = value as GoalType;
    setType(selectedType);
    setIsCustomType(selectedType === 'custom');
    
    // Set default color based on type
    if (selectedType === 'github') {
      setColor('#8B5CF6');
      setIcon('github');
    } else if (selectedType === 'leetcode') {
      setColor('#FFA116');
      setIcon('code');
    } else {
      setColor('#10B981');
      setIcon('calendar');
    }
  };
  
  const handleFrequencyChange = (value: string) => {
    const selectedFrequency = value as GoalFrequency;
    setFrequency(selectedFrequency);
    setIsCustomFrequency(selectedFrequency === 'custom');
  };
  
  const handleCustomIconChange = (value: string) => {
    setIcon(value);
    
    // Set default color based on icon
    if (value === 'dumbbell') {
      setColor('#10B981');
    } else if (value === 'book') {
      setColor('#EC4899');
    } else {
      setColor('#3B82F6');
    }
  };
  
  const handleDayToggle = (day: number) => {
    if (customDays.includes(day)) {
      setCustomDays(customDays.filter(d => d !== day));
    } else {
      setCustomDays([...customDays, day].sort());
    }
  };
  
  const getDayName = (day: number) => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Please enter a goal name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newGoal = await addGoal({
        name,
        description,
        type,
        icon,
        color,
        frequency,
        tracking_unit: trackingUnit,
        target_value: targetValue,
        custom_days: frequency === 'custom' ? customDays : undefined,
      });
      
      toast.success('Goal created successfully!');
      navigate(`/goals/${newGoal.id}`);
    } catch (error) {
      console.error('Failed to create goal', error);
      toast.error('Failed to create goal');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/goals')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Button>
          
          <h1 className="text-2xl font-bold ml-4">Create New Goal</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Goal Details</CardTitle>
              <CardDescription>
                Set up your goal with a name, description, and other basic details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">
                  Goal Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter goal name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="description">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Goal Type
                </label>
                <Select value={type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <option.icon className="mr-2 h-4 w-4" style={{ color: option.color }} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {isCustomType && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Icon
                  </label>
                  <Select value={icon} onValueChange={handleCustomIconChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {customIconOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            <option.icon className="mr-2 h-4 w-4" style={{ color: option.color }} />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Frequency
                </label>
                <Select value={frequency} onValueChange={handleFrequencyChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {isCustomFrequency && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Select Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5, 6].map(day => (
                      <Button
                        key={day}
                        type="button"
                        variant={customDays.includes(day) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDayToggle(day)}
                      >
                        {getDayName(day).slice(0, 3)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" type="button" size="sm" className="w-full">
                    {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Tracking Method
                    </label>
                    <Select value={trackingUnit} onValueChange={(value) => setTrackingUnit(value as TrackingUnit)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tracking method" />
                      </SelectTrigger>
                      <SelectContent>
                        {trackingUnitOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {trackingUnit !== 'binary' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="targetValue">
                        Target Value {trackingUnit === 'duration' ? '(minutes)' : '(count)'}
                      </label>
                      <Input
                        id="targetValue"
                        type="number"
                        min={1}
                        value={targetValue}
                        onChange={(e) => setTargetValue(Number(e.target.value))}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="color">
                      Color
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="color"
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate('/goals')}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Goal'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default NewGoalPage;
