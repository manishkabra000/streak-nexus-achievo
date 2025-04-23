
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAchievements } from '@/contexts/AchievementContext';
import { AchievementCard } from '@/components/AchievementCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AchievementsPage = () => {
  const { achievements, isLoading } = useAchievements();
  const [searchTerm, setSearchTerm] = useState('');
  
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  
  const filteredUnlocked = unlockedAchievements.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredLocked = lockedAchievements.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Achievements</h1>
          <div className="text-muted-foreground">
            {unlockedAchievements.length} of {achievements.length} unlocked
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search achievements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 max-w-md"
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1.5"
              onClick={() => setSearchTerm('')}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="unlocked" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="unlocked">Unlocked ({filteredUnlocked.length})</TabsTrigger>
            <TabsTrigger value="locked">Locked ({filteredLocked.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="unlocked" className="pt-4">
            {isLoading ? (
              <div className="text-center py-8">Loading achievements...</div>
            ) : filteredUnlocked.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredUnlocked.map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? (
                  <div>
                    <p>No unlocked achievements match your search</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <p>You haven't unlocked any achievements yet</p>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="locked" className="pt-4">
            {isLoading ? (
              <div className="text-center py-8">Loading achievements...</div>
            ) : filteredLocked.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredLocked.map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? (
                  <div>
                    <p>No locked achievements match your search</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <p>You've unlocked all achievements!</p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AchievementsPage;
