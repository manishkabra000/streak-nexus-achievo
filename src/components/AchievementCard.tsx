
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Achievement } from '@/types';
import { Award, Star, Crown, Github, Code, Zap } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const getIcon = () => {
    switch (achievement.icon) {
      case 'award':
        return <Award className="h-6 w-6" />;
      case 'star':
        return <Star className="h-6 w-6" />;
      case 'crown':
        return <Crown className="h-6 w-6" />;
      case 'github':
        return <Github className="h-6 w-6" />;
      case 'code':
        return <Code className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  const getTierColor = () => {
    switch (achievement.tier) {
      case 'bronze':
        return 'text-achievement-bronze';
      case 'silver':
        return 'text-achievement-silver';
      case 'gold':
        return 'text-achievement-gold';
      case 'platinum':
        return 'text-achievement-platinum';
      default:
        return 'text-achievement-bronze';
    }
  };

  const getBgColor = () => {
    switch (achievement.tier) {
      case 'bronze':
        return 'bg-achievement-bronze/10';
      case 'silver':
        return 'bg-achievement-silver/10';
      case 'gold':
        return 'bg-achievement-gold/10';
      case 'platinum':
        return 'bg-achievement-platinum/10';
      default:
        return 'bg-achievement-bronze/10';
    }
  };

  const getBorderColor = () => {
    switch (achievement.tier) {
      case 'bronze':
        return 'border-achievement-bronze/30';
      case 'silver':
        return 'border-achievement-silver/30';
      case 'gold':
        return 'border-achievement-gold/30';
      case 'platinum':
        return 'border-achievement-platinum/30';
      default:
        return 'border-achievement-bronze/30';
    }
  };

  return (
    <Card 
      className={`border-2 ${getBorderColor()} ${achievement.unlocked ? 'animate-achievement' : 'opacity-70'}`}
    >
      <CardContent className="pt-6 pb-3">
        <div className="flex flex-col items-center">
          <div className={`rounded-full p-3 mb-4 ${getBgColor()}`}>
            <div className={getTierColor()}>
              {getIcon()}
            </div>
          </div>
          <h3 className="font-bold text-center mb-1">{achievement.name}</h3>
          <p className="text-sm text-muted-foreground text-center">{achievement.description}</p>
          
          {!achievement.unlocked && achievement.progress !== undefined && (
            <div className="w-full mt-4">
              <Progress value={achievement.progress} className="h-2" />
              <div className="mt-1 text-xs text-muted-foreground flex justify-between">
                <span>Progress</span>
                <span>{achievement.progress}%</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t border-border pt-3 pb-3 flex justify-center">
        <div className={`text-xs px-2 py-1 rounded-full font-medium ${getBgColor()} ${getTierColor()}`}>
          {achievement.tier.charAt(0).toUpperCase() + achievement.tier.slice(1)}
        </div>
        {achievement.unlocked && achievement.unlocked_at && (
          <div className="text-xs ml-2 text-muted-foreground">
            Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
