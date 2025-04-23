
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useGoals } from '@/contexts/GoalContext';
import { StreakCard } from '@/components/StreakCard';
import { StreakHeatMap } from '@/components/StreakHeatMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Goal, GoalType } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, XCircle, CalendarClock, Github, Code, Dumbbell, BookOpen } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GoalsPage = () => {
  const { goals, isLoading, getProgressForGoal } = useGoals();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'streak' | 'name'>('streak');
  
  // Filter and sort goals
  const filteredGoals = goals
    .filter(goal => {
      const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           goal.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || goal.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'streak') {
        return b.current_streak - a.current_streak;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  
  const getGoalIcon = (type: GoalType) => {
    switch (type) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'leetcode':
        return <Code className="h-4 w-4" />;
      case 'custom':
        return <CalendarClock className="h-4 w-4" />;
      default:
        return <CalendarClock className="h-4 w-4" />;
    }
  };

  const handleStreakCardClick = (goalId: string) => {
    navigate(`/goals/${goalId}`);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType(null);
    setSortBy('streak');
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Goals</h1>
          <Button onClick={() => navigate('/goals/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={selectedType || ''} onValueChange={(value) => setSelectedType(value || null)}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="github">
                <div className="flex items-center">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </div>
              </SelectItem>
              <SelectItem value="leetcode">
                <div className="flex items-center">
                  <Code className="mr-2 h-4 w-4" />
                  LeetCode
                </div>
              </SelectItem>
              <SelectItem value="custom">
                <div className="flex items-center">
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Custom
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'streak' | 'name')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="streak">Longest Streak</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          
          {(searchTerm || selectedType) && (
            <Button variant="outline" onClick={clearFilters} size="icon">
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cards" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full text-center py-8">Loading goals...</div>
              ) : filteredGoals.length > 0 ? (
                filteredGoals.map(goal => (
                  <StreakCard 
                    key={goal.id} 
                    goal={goal} 
                    progress={75} // Mocked progress value
                    onClick={() => handleStreakCardClick(goal.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <div className="text-muted-foreground mb-4">No goals match your filters</div>
                  <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="pt-4">
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">Loading goals...</div>
              ) : filteredGoals.length > 0 ? (
                filteredGoals.map((goal) => (
                  <DetailedGoalView 
                    key={goal.id}
                    goal={goal}
                    progressData={getProgressForGoal(goal.id)}
                    onViewClick={() => handleStreakCardClick(goal.id)}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">No goals match your filters</div>
                  <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface DetailedGoalViewProps {
  goal: Goal;
  progressData: any[];
  onViewClick: () => void;
}

const DetailedGoalView: React.FC<DetailedGoalViewProps> = ({ goal, progressData, onViewClick }) => {
  const getTypeIcon = () => {
    switch (goal.type) {
      case 'github':
        return <Github className="h-5 w-5 text-streak-github" />;
      case 'leetcode':
        return <Code className="h-5 w-5 text-streak-leetcode" />;
      case 'custom':
        if (goal.icon === 'dumbbell') return <Dumbbell className="h-5 w-5 text-streak-success" />;
        if (goal.icon === 'book') return <BookOpen className="h-5 w-5 text-streak-info" />;
        return <CalendarClock className="h-5 w-5 text-streak-default" />;
      default:
        return <CalendarClock className="h-5 w-5 text-streak-default" />;
    }
  };
  
  const getFrequencyText = () => {
    switch (goal.frequency) {
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

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div 
              className="p-2 rounded-full mr-3"
              style={{ backgroundColor: `${goal.color}25` }}
            >
              {getTypeIcon()}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{goal.name}</h3>
              <p className="text-muted-foreground">{goal.description}</p>
            </div>
          </div>
          
          <Button variant="outline" onClick={onViewClick}>View Details</Button>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Current Streak:</span>
            <span className="font-semibold">{goal.current_streak} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Longest Streak:</span>
            <span className="font-semibold">{goal.longest_streak} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Frequency:</span>
            <span className="font-semibold">{getFrequencyText()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Target:</span>
            <span className="font-semibold">
              {goal.tracking_unit === 'binary' ? 'Complete' : `${goal.target_value} ${goal.tracking_unit === 'duration' ? 'minutes' : 'times'}`}
            </span>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <StreakHeatMap goal={goal} progressData={progressData} numWeeks={6} />
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
