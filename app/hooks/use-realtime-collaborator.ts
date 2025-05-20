// src/components/collaborative-editor/hooks/useRealtimeCollaboration.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { type RealtimeChannel } from "@supabase/supabase-js";
import {
  createDocumentChannel,
  trackDocumentUsers,
  type UserPresence,
} from "@/lib/realtime";
import { enhanceUsers, fetchUserProfiles } from "@/lib/profile-manager";
import { EditorStateManager } from "@/lib/editor-state-manager";

export interface RealtimeCollaborationOptions {
  documentId: string;
  user: any;
  onUserUpdate: (users: Record<string, UserPresence>) => void;
  onConnectionChange?: (status: "connected" | "disconnected") => void;
}

export function useRealtimeCollaboration({
  documentId,
  user,
  onUserUpdate,
  onConnectionChange,
}: RealtimeCollaborationOptions) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [connected, setConnected] = useState(false);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const isSubscribing = useRef(false);
  const stateManager = useRef<EditorStateManager | null>(null);

  // Initialize state manager
  useEffect(() => {
    if (user) {
      stateManager.current = new EditorStateManager(user.id);
    }
    return () => {
      stateManager.current?.cleanup();
    };
  }, [user]);

  // Handle user tracking with profile enrichment
  const handleUserTracking = useCallback(
    async (newChannel: RealtimeChannel) => {
      return trackDocumentUsers(newChannel, user, async (users) => {
        const userIds = Object.keys(users);
        const profiles = await fetchUserProfiles(userIds);
        const enhancedUsers = enhanceUsers(users, profiles);
        onUserUpdate(enhancedUsers);
      });
    },
    [onUserUpdate],
  );

  // Setup heartbeat to maintain user presence
  const setupHeartbeat = useCallback(
    (newChannel: RealtimeChannel) => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }

      return setInterval(() => {
        if (newChannel && connected && user) {
          newChannel.send({
            type: "broadcast",
            event: "presence:heartbeat",
            payload: {
              user_id: user.id,
              timestamp: Date.now(),
            },
          });
        }
      }, 30000);
    },
    [connected],
  );

  // Initialize and manage channel lifecycle
  useEffect(() => {
    if (!user || !documentId) return;

    let newChannel: RealtimeChannel | null = null;
    let userTrackingCleanup: Promise<() => void> | null = null;
    let isSubscribed = false;

    const initializeChannel = async () => {
      if (isSubscribing.current) return;
      isSubscribing.current = true;

      try {
        newChannel = createDocumentChannel(documentId, user);
        if (!newChannel) return;

        // Subscribe and track connection status
        if (!isSubscribed) {
          newChannel.subscribe((status) => {
            const isConnected = status === "SUBSCRIBED";
            setConnected(isConnected);
            onConnectionChange?.(isConnected ? "connected" : "disconnected");
          });
          isSubscribed = true;
        }
        setChannel(newChannel);
        // Set up user tracking
        userTrackingCleanup = handleUserTracking(newChannel);

        // Setup heartbeat
        heartbeatInterval.current = setupHeartbeat(newChannel);

        // Notify other users that we've joined
        newChannel.send({
          type: "broadcast",
          event: "user:join",
          payload: {
            user_id: user.id,
            timestamp: Date.now(),
          },
        });
      } catch (error) {
        console.error("Error initializing channel:", error);
      } finally {
        isSubscribing.current = false;
      }
    };

    initializeChannel();

    // Cleanup function
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }

      if (userTrackingCleanup) {
        userTrackingCleanup.then(() => {
          if (newChannel) {
            newChannel.unsubscribe();
          }
        });
      }
    };
  }, [
    documentId,
    user,
    handleUserTracking,
    // setupHeartbeat,
    onConnectionChange,
  ]);

  return {
    channel,
    connected,
    stateManager: stateManager.current,
  };
}
