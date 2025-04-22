// src/components/collaborative-editor/utils/profileManager.ts
import { type UserPresence } from '@/lib/realtime';
import { createClient } from '@/lib/utils/supabase/client';
// Cache to store user profiles
const profileCache: Record<string, any> = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
const cacheTimestamps: Record<string, number> = {};

const supabase = createClient();

// Batching mechanism
let pendingRequests: Set<string> = new Set();
let batchTimeout: NodeJS.Timeout | null = null;
const BATCH_DELAY = 50; // ms to wait for batching requests

/**
 * Fetch user profiles with batching and caching
 */
export async function fetchUserProfiles(
  userIds: string[]
): Promise<Record<string, any>> {
  // Filter to only get uncached or expired IDs
  const uncachedIds = userIds.filter((id) => {
    const isCached = id in profileCache;
    const isExpired =
      isCached && Date.now() - (cacheTimestamps[id] || 0) > CACHE_TTL;

    return !isCached || isExpired;
  });

  // If all profiles are cached, return from cache immediately
  if (uncachedIds.length === 0) {
    return userIds.reduce((profiles, id) => {
      profiles[id] = profileCache[id];
      return profiles;
    }, {} as Record<string, any>);
  }

  // Fetch the uncached profiles
  try {
    const profiles = await batchFetchProfiles(uncachedIds);

    // Update cache with new profiles
    Object.entries(profiles).forEach(([id, profile]) => {
      profileCache[id] = profile;
      cacheTimestamps[id] = Date.now();
    });

    // Return all requested profiles from cache
    return userIds.reduce((result, id) => {
      result[id] = profileCache[id];
      return result;
    }, {} as Record<string, any>);
  } catch (error) {
    console.error('Error fetching user profiles:', error);

    // Return cached profiles if available, otherwise empty objects
    return userIds.reduce((result, id) => {
      result[id] = profileCache[id] || {};
      return result;
    }, {} as Record<string, any>);
  }
}

/**
 * Batch multiple profile requests into a single API call
 */
function batchFetchProfiles(userIds: string[]): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    userIds.forEach((id) => pendingRequests.add(id));

    if (batchTimeout) {
      clearTimeout(batchTimeout);
    }

    batchTimeout = setTimeout(async () => {
      const batchIds = Array.from(pendingRequests);
      pendingRequests.clear();

      try {
        const { data, error } = await supabase.rpc('get_user_profiles', {
          p_user_ids: batchIds,
        });

        if (error) throw error;

        // Convert array of profiles to an object keyed by user ID
        const profiles = (data as any[]).reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);

        resolve(profiles);
      } catch (err) {
        reject(err);
      }
    }, BATCH_DELAY);
  });
}

/**
 * Merge user presence data with profile data
 */
export function enhanceUsers(
  users: Record<string, UserPresence>,
  profiles: Record<string, { email: string }>
): Record<string, UserPresence> {
  return Object.entries(users).reduce((acc, [userId, userData]) => {
    const profile = profiles[userId];
    if (profile) {
      acc[userId] = {
        ...userData,
        email: profile.email,
        lastActive: userData.lastActive || Date.now(),
      };
    }
    return acc;
  }, {} as Record<string, UserPresence>);
}
