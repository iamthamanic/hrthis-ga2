import React from 'react';

import { Achievement } from '../../types/gamification';

import { AchievementCardGrid } from './AchievementCardGrid';
import { AchievementCardList } from './AchievementCardList';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  layout: 'grid' | 'list';
  onClick?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = (props) => {
  return props.layout === 'list' 
    ? <AchievementCardList {...props} /> 
    : <AchievementCardGrid {...props} />;
};