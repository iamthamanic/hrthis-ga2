import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  XPEventData, 
  GamificationConfig, 
  DEFAULT_GAMIFICATION_CONFIG,
  NotificationEvent
} from '../types/gamification';
import { SKILL_IDS } from '../types/avatar';
import { useAvatarStore } from './avatar';
import { useAchievementsStore } from './achievements';

interface GamificationState {
  // Configuration
  config: GamificationConfig;
  
  // Event tracking
  notifications: NotificationEvent[];
  
  // Main actions
  awardXP: (_eventData: XPEventData) => void;
  awardCoins: (_userId: string, _amount: number, _reason: string) => void;
  
  // Event handlers for different activities
  onTrainingCompleted: (_userId: string, _trainingId: string, _passed: boolean) => void;
  onPunctualCheckin: (_userId: string, _streakDay?: number) => void;
  onCoinsEarned: (_userId: string, _amount: number, _reason: string) => void;
  onFeedbackGiven: (_userId: string, _feedbackId: string) => void;
  onDailyLogin: (_userId: string) => void;
  
  // Configuration management
  updateConfig: (_updates: Partial<GamificationConfig>) => void;
  
  // Notifications
  getNotifications: (_userId: string) => NotificationEvent[];
  markNotificationAsRead: (_notificationId: string) => void;
  clearNotifications: (_userId: string) => void;
  
  // Statistics and leaderboards
  getLeaderboard: (_skillId?: string, _limit?: number) => Array<{
    userId: string;
    userName: string;
    xp: number;
    level: number;
  }>;
  
  // Integration helpers
  initializeUserGamification: (_userId: string) => void;
  getUserGamificationSummary: (_userId: string) => {
    level: number;
    totalXP: number;
    achievements: number;
    weeklyXP: number;
    rank: number;
  };
  
  // Helper methods
  getXPDescription: (_type: string, metadata: Record<string, any>) => string;
  getDefaultSkillForEventType: (_type: string) => string | null;
}

// Helper function to calculate XP amount based on event type
const calculateXPAmount = (
  type: string, 
  xpAmount: number | undefined, 
  config: GamificationConfig, 
  metadata: Record<string, any>
): number => {
  if (xpAmount) return xpAmount;
  
  switch (type) {
    case 'training_completed':
      return config.xpRates.trainingCompleted;
    case 'punctual_checkin':
      return config.xpRates.punctualCheckin;
    case 'coins_earned':
      return Math.floor((metadata.coinAmount || 0) * config.xpRates.coinsEarned);
    case 'feedback_given':
      return config.xpRates.feedbackGiven;
    case 'daily_login':
      return config.xpRates.dailyLogin;
    default:
      return 0;
  }
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      config: DEFAULT_GAMIFICATION_CONFIG,
      notifications: [],
      
      awardXP: (eventData) => {
        const { type, userId, skillIds, xpAmount, metadata = {} } = eventData;
        const config = get().config;
        
        const finalXPAmount = calculateXPAmount(type, xpAmount, config, metadata);
        if (!finalXPAmount || finalXPAmount <= 0) return;

        const avatarStore = useAvatarStore.getState();
        const achievementsStore = useAchievementsStore.getState();

        // Award XP to specific skills or general
        if (skillIds && skillIds.length > 0) {
          skillIds.forEach(skillId => {
            avatarStore.addXP({
              userId,
              skillId,
              xpAmount: finalXPAmount!,
              description: get().getXPDescription(type, metadata),
              metadata: { type, ...metadata }
            });
          });
        } else {
          // Award to default skill based on type
          const defaultSkillId = get().getDefaultSkillForEventType(type);
          avatarStore.addXP({
            userId,
            skillId: defaultSkillId,
            xpAmount: finalXPAmount!,
            description: get().getXPDescription(type, metadata),
            metadata: { type, ...metadata }
          });
        }

        // Update achievement progress
        achievementsStore.updateProgress(userId, type, metadata.coinAmount || 1, metadata);

        // Create notification
        set(state => {
          const notification: NotificationEvent = {
            id: `xp-${userId}-${Date.now()}`,
            userId,
            type: skillIds ? 'skill_level_up' : 'level_up',
            title: 'XP erhalten!',
            message: `+${finalXPAmount!} XP für ${get().getXPDescription(type, metadata)}`,
            data: {
              xpGained: finalXPAmount!,
              skillId: skillIds?.[0]
            },
            isRead: false,
            createdAt: new Date().toISOString()
          };

          return {
            notifications: [notification, ...state.notifications.slice(0, 99)]
          };
        });
      },
      
      getXPDescription: (type: string, metadata: Record<string, any>) => {
        switch (type) {
          case 'training_completed':
            return `Schulung abgeschlossen`;
          case 'punctual_checkin':
            return metadata.streakDay > 1 
              ? `Pünktlich (${metadata.streakDay} Tage Serie)`
              : 'Pünktlich gestempelt';
          case 'coins_earned':
            return `${metadata.coinAmount} Coins verdient: ${metadata.reason}`;
          case 'feedback_given':
            return 'Feedback gegeben';
          case 'daily_login':
            return 'Täglicher Login';
          case 'manual':
            return metadata.reason || 'Manuell vergeben';
          default:
            return 'XP erhalten';
        }
      },
      
      getDefaultSkillForEventType: (type: string) => {
        switch (type) {
          case 'training_completed':
          case 'training_passed':
            return SKILL_IDS.KNOWLEDGE;
          case 'punctual_checkin':
          case 'feedback_given':
          case 'daily_login':
            return SKILL_IDS.LOYALTY;
          case 'coins_earned':
            return SKILL_IDS.HUSTLE;
          default:
            return null;
        }
      },

      awardCoins: (userId: string, amount: number, reason: string) => {
        // This would integrate with the existing coins store
        // For now, we just track it for XP purposes
        get().awardXP({
          type: 'coins_earned',
          userId,
          metadata: { coinAmount: amount, reason }
        });
      },

      onTrainingCompleted: (userId: string, trainingId: string, passed: boolean) => {
        if (!passed) return;
        
        get().awardXP({
          type: 'training_completed',
          userId,
          skillIds: [SKILL_IDS.KNOWLEDGE],
          metadata: { trainingId, passed }
        });
      },

      onPunctualCheckin: (userId: string, streakDay = 1) => {
        get().awardXP({
          type: 'punctual_checkin',
          userId,
          skillIds: [SKILL_IDS.LOYALTY],
          metadata: { streakDay }
        });
      },

      onCoinsEarned: (userId: string, amount: number, reason: string) => {
        get().awardXP({
          type: 'coins_earned',
          userId,
          skillIds: [SKILL_IDS.HUSTLE],
          metadata: { coinAmount: amount, reason }
        });
      },

      onFeedbackGiven: (userId: string, feedbackId: string) => {
        get().awardXP({
          type: 'feedback_given',
          userId,
          skillIds: [SKILL_IDS.LOYALTY],
          metadata: { feedbackId }
        });
      },

      onDailyLogin: (userId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const lastLogin = localStorage.getItem(`lastLogin-${userId}`);
        
        if (lastLogin !== today) {
          localStorage.setItem(`lastLogin-${userId}`, today);
          get().awardXP({
            type: 'daily_login',
            userId,
            metadata: { date: today }
          });
        }
      },


      updateConfig: (updates: Partial<GamificationConfig>) => {
        set(state => ({
          config: { ...state.config, ...updates }
        }));
      },

      getNotifications: (_userId: string) => {
        return get().notifications.filter(n => n.userId === _userId);
      },

      markNotificationAsRead: (_notificationId: string) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === _notificationId ? { ...n, isRead: true } : n
          )
        }));
      },

      clearNotifications: (_userId: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.userId !== _userId)
        }));
      },

      getLeaderboard: (_skillId?: string, limit = 10) => {
        const avatarStore = useAvatarStore.getState();
        const allAvatars = Object.values(avatarStore.userAvatars);
        
        let leaderboard = allAvatars.map(avatar => {
          let xp = avatar.totalXP;
          let level = avatar.level;
          
          if (_skillId) {
            const skill = avatar.skills.find(s => s.id === _skillId);
            xp = skill?.totalXP || 0;
            level = skill?.level || 1;
          }
          
          return {
            userId: avatar.userId,
            userName: `User ${avatar.userId}`, // This would come from user store
            xp,
            level
          };
        });

        return leaderboard
          .sort((a, b) => b.xp - a.xp)
          .slice(0, limit);
      },

      initializeUserGamification: (_userId: string) => {
        const avatarStore = useAvatarStore.getState();
        const existingAvatar = avatarStore.getUserAvatar(_userId);
        
        if (!existingAvatar) {
          avatarStore.createUserAvatar(_userId);
        }
        
        // Award welcome XP
        get().awardXP({
          type: 'manual',
          userId: _userId,
          xpAmount: 25,
          metadata: { reason: 'Willkommen bei HRthis!' }
        });
      },

      getUserGamificationSummary: (_userId: string) => {
        const avatarStore = useAvatarStore.getState();
        const achievementsStore = useAchievementsStore.getState();
        
        const userAvatar = avatarStore.getUserAvatar(_userId);
        const userAchievements = achievementsStore.getUserAchievements(_userId);
        const leaderboard = get().getLeaderboard();
        
        if (!userAvatar) {
          return {
            level: 1,
            totalXP: 0,
            achievements: 0,
            weeklyXP: 0,
            rank: leaderboard.length + 1
          };
        }

        // Calculate weekly XP (this would need proper date tracking)
        const weeklyXP = avatarStore.getXPEvents(_userId, 50)
          .filter(event => {
            const eventDate = new Date(event.createdAt);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return eventDate >= weekAgo;
          })
          .reduce((sum, event) => sum + event.xpAmount, 0);

        const rank = leaderboard.findIndex(entry => entry.userId === _userId) + 1;

        return {
          level: userAvatar.level,
          totalXP: userAvatar.totalXP,
          achievements: userAchievements.length,
          weeklyXP,
          rank: rank || leaderboard.length + 1
        };
      }
    }),
    {
      name: 'gamification-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        config: state.config,
        notifications: state.notifications.slice(0, 50) // Keep recent notifications
      })
    }
  )
);