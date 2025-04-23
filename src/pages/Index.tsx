
import React from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useGoals } from '@/contexts/GoalContext';
import { useAchievements } from '@/contexts/AchievementContext';
import { DashboardSummary } from '@/components/DashboardSummary';
import { StreakCard } from '@/components/StreakCard';
import { AchievementCard } from '@/components/AchievementCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, BarChart2, Github, Code } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { goals, isLoading: goalsLoading } = useGoals();
  const { achievements, isLoading: achievementsLoading } = useAchievements();
  const navigate = useNavigate();

  const isLoading = authLoading || goalsLoading || achievementsLoading;

  const handleStreakCardClick = (goalId: string) => {
    navigate(`/goals/${goalId}`);
  };

  const handleAddGoalClick = () => {
    navigate('/goals/new');
  };

  // Only show unlocked achievements from user data
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  if (!isAuthenticated && !isLoading) {
    return <LandingPage />;
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleAddGoalClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </div>

        {/* Dashboard Summary */}
        <DashboardSummary goals={goals} />

        {/* Current Streaks */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Current Streaks</h2>
            <Button variant="outline" onClick={() => navigate('/goals')}>
              <BarChart2 className="mr-2 h-4 w-4" />
              View All Goals
            </Button>
          </div>
          {goals.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No goals yet. <Button variant="link" onClick={handleAddGoalClick}>Create your first goal</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map(goal => (
                <StreakCard 
                  key={goal.id} 
                  goal={goal} 
                  progress={0} // No mock progress, real progress logic would be separate
                  onClick={() => handleStreakCardClick(goal.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Achievements */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Recent Achievements</h2>
            <Button variant="outline" onClick={() => navigate('/achievements')}>
              <Trophy className="mr-2 h-4 w-4" />
              View All
            </Button>
          </div>
          {unlockedAchievements.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No achievements unlocked yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {unlockedAchievements.slice(0, 4).map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          )}
        </div>

        {/* Platform Stats Preview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GitHub Stats */}
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center mb-4">
                <Github className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-semibold">GitHub Activity</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Current Streak:</span>
                  <span className="font-bold text-muted-foreground">–</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Contributions:</span>
                  <span className="font-bold text-muted-foreground">–</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Longest Streak:</span>
                  <span className="font-bold text-muted-foreground">–</span>
                </div>
              </div>
            </div>
            {/* LeetCode Stats */}
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center mb-4">
                <Code className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-semibold">LeetCode Progress</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Daily Streak:</span>
                  <span className="font-bold text-muted-foreground">–</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Problems Solved:</span>
                  <span className="font-bold text-muted-foreground">–</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Difficulty Breakdown:</span>
                  <span className="font-bold text-muted-foreground">–</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Landing page for unauthenticated users - Extracted as a separate component that doesn't use useAuth
const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="dark min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-primary text-2xl font-bold">Achievo</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate('/login')}>Log in</Button>
            <Button onClick={() => navigate('/register')}>Sign up</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-slide-up">
                <span className="text-gradient">Build Consistent Habits</span>
              </h1>
              <p className="text-xl mb-8 text-muted-foreground">
                Track your goals across multiple platforms and maintain streaks to build lasting habits.
                Achievo helps you stay consistent with your coding, fitness, reading, and more.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" onClick={() => navigate('/register')}>
                  Start Tracking Now
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-secondary/20">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="text-center">
                  <div className="bg-primary/10 p-3 rounded-full inline-block mb-4">
                    <BarChart2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Goal Tracking</h3>
                  <p className="text-muted-foreground">Track your progress across custom goals and integrated platforms.</p>
                </div>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="text-center">
                  <div className="bg-primary/10 p-3 rounded-full inline-block mb-4">
                    <Github className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">GitHub Integration</h3>
                  <p className="text-muted-foreground">Monitor your coding contributions and maintain your GitHub streak.</p>
                </div>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="text-center">
                  <div className="bg-primary/10 p-3 rounded-full inline-block mb-4">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Achievements</h3>
                  <p className="text-muted-foreground">Unlock badges and achievements as you maintain streaks and reach milestones.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 text-center">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Building Habits?</h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join Achievo today and take control of your consistency across all aspects of your life.
            </p>
            <Button size="lg" onClick={() => navigate('/register')}>
              Sign Up for Free
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Achievo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

