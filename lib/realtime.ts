import type { RealtimeChannel } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';
import { createClient } from './utils/supabase/client';

const supabaseRealtime = createClient();

// Generate a consistent color based on user ID
export function generateUserColor(userId: string): string {
  // Simple hash function to generate a number from a string
  const hash = userId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Generate a hue value between 0 and 360
  const hue = hash % 360;

  // Return an HSL color with fixed saturation and lightness
  return `hsl(${hue}, 70%, 60%)`;
}

// Create a presence channel for a document
export function createDocumentChannel(
  documentId: string,
  user: User | null
): RealtimeChannel | null {
  if (!user) return null;

  const channel = supabaseRealtime.channel(`document:${documentId}`, {
    config: {
      presence: {
        key: user.id,
      },
    },
  });

  // channel.subscribe();
  return channel;
}

// Broadcast document updates to all connected clients
export async function broadcastDocumentUpdate(
  channel: RealtimeChannel,
  content: string
): Promise<void> {
  await channel.send({
    type: 'broadcast',
    event: 'document:update',
    payload: { content },
  });
}

// Type for cursor position
export interface CursorPosition {
  x: number;
  y: number;
  selection?: {
    from: number;
    to: number;
  };
}

// Type for user presence
export interface UserPresence {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  color: string;
  cursor?: CursorPosition;
  lastActive: number;
}

// Track users in a document
export function trackDocumentUsers(
  channel: RealtimeChannel,
  user: User,
  onPresenceChange: (users: Record<string, UserPresence>) => void
): () => void {
  const userInfo: UserPresence = {
    id: user.id,
    email: user.email || undefined,
    name: user.user_metadata?.full_name,
    avatar_url: user.user_metadata?.avatar_url,
    color: generateUserColor(user.id),
    lastActive: Date.now(),
  };

  // Set up presence tracking
  channel
    .on('presence', { event: 'sync' }, () => {
      const newState = channel.presenceState<UserPresence>();
      onPresenceChange(newState as any);
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log('User joined:', key, newPresences);
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log('User left:', key, leftPresences);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track(userInfo);
      }
    });

  // Return cleanup function
  return () => {
    channel.unsubscribe();
  };
}

// Update cursor position
export async function updateCursorPosition(
  channel: RealtimeChannel,
  position: CursorPosition
): Promise<void> {
  await channel.track({
    cursor: position,
    lastActive: Date.now(),
  });
}
