import React from 'react';

import { useAchievementsStore } from '../state/achievements';
import { useAvatarStore } from '../state/avatar';
import { cn } from '../utils/cn';

import { AchievementsGrid } from './avatar/AchievementsGrid';
import { AvatarCircle } from './avatar/AvatarCircle';
import { CoinsSection } from './avatar/CoinsSection';
import { SkillsList } from './avatar/SkillsList';
import { UserInfo } from './avatar/UserInfo';

interface AvatarDisplayProps {
  userId: string;
  showEditButton?: boolean;
  onEdit?: () => void;
  className?: string;
}

/**
 * Large Avatar Display Component (for Settings/Profile page)
 * Shows full avatar with level, skills, and achievements like Screenshot 2
 */
export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  userId,
  showEditButton = false,
  onEdit,
  className
}) => {
  const { getUserAvatar } = useAvatarStore();
  const { getUnlockedAchievements } = useAchievementsStore();
  
  const userAvatar = getUserAvatar(userId);
  const unlockedAchievements = getUnlockedAchievements(userId);

  if (!userAvatar) {
    return (
      <div className={cn("flex flex-col items-center p-6", className)}>
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <span className="text-gray-400 text-4xl">👤</span>
        </div>
        <p className="text-gray-500">Avatar wird geladen...</p>
      </div>
    );
  }


  return (
    <div className={cn("flex flex-col items-center p-6 bg-white rounded-xl", className)}>
      <AvatarCircle 
        showEditButton={showEditButton}
        onEdit={onEdit}
      />
      
      <UserInfo 
        title={userAvatar.title}
        level={userAvatar.level}
      />
      
      <SkillsList skills={userAvatar.skills} />
      
      <CoinsSection />
      
      <AchievementsGrid achievements={unlockedAchievements} />
    </div>
  );
};