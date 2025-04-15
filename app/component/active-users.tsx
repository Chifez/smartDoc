// src/components/collaborative-editor/components/ActiveUsers.tsx
import React, { memo } from 'react';
import { type UserPresence } from '@/lib/realtime';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ActiveUsersProps {
  activeUsers: Record<string, UserPresence>;
  currentUserId: string | undefined;
}

// Helper to determine border color based on activity
const getActivityStatus = (lastActive: number) => {
  if (Date.now() - lastActive < 60000) {
    return 'border-green-500'; // Active in the last minute
  } else if (Date.now() - lastActive < 300000) {
    return 'border-yellow-500'; // Active in the last 5 minutes
  }
  return 'border-gray-300'; // Inactive for more than 5 minutes
};

// Memoized component to prevent unnecessary re-renders
const ActiveUsers = memo(({ activeUsers, currentUserId }: ActiveUsersProps) => {
  const otherUsers = Object.values(activeUsers).filter(
    (u) => u.id !== currentUserId
  );

  if (otherUsers.length === 0) {
    return (
      <div className="ml-auto text-xs text-gray-500">No other users online</div>
    );
  }

  return (
    <div className="ml-auto flex items-center gap-1">
      <TooltipProvider>
        {otherUsers.map((activeUser) => (
          <Tooltip key={activeUser.id}>
            <TooltipTrigger asChild className="cursor-pointer">
              <Avatar
                className={cn(
                  'h-8 w-8 border-2',
                  getActivityStatus(activeUser.lastActive)
                )}
                style={{ borderColor: activeUser.color }}
              >
                <AvatarImage src={activeUser.avatar_url || ''} />
                <AvatarFallback
                  style={{ backgroundColor: activeUser.color }}
                  className="uppercase text-xs"
                >
                  {activeUser.name?.substring(0, 2) ||
                    activeUser.email?.substring(0, 2) ||
                    'U'}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                {activeUser.name || activeUser.email || 'Anonymous User'}
                <span className="block text-xs text-gray-500">
                  {Date.now() - activeUser.lastActive < 60000
                    ? 'Active now'
                    : `Active ${Math.round(
                        (Date.now() - activeUser.lastActive) / 60000
                      )} min ago`}
                </span>
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
});

ActiveUsers.displayName = 'ActiveUsers';

export default ActiveUsers;
