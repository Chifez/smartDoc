import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/utils/supabase/client";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ success: boolean; email: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (data: {
    full_name?: string;
    avatar_url?: string;
  }) => Promise<void>;
  checkSession: () => Promise<void>;
  setupAuthListener: () => () => void;
  signInWithGoogle: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: false,
      error: null,

      setupAuthListener: () => {
        // Create a client component client that uses cookies
        const supabaseClient = createClient();

        // Set up auth state change listener
        const {
          data: { subscription },
        } = supabaseClient.auth.onAuthStateChange(
          async (event: AuthChangeEvent, currentSession: Session | null) => {
            console.log("Auth state changed:", event);

            if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
              // Update user and session in store
              if (currentSession) {
                const { data: userData } = await supabaseClient.auth.getUser();
                set({
                  user: userData.user,
                  session: currentSession,
                  isLoading: false,
                });
              }
            } else if (event === "SIGNED_OUT") {
              // Clear user and session in store
              set({ user: null, session: null, isLoading: false });
            }
          },
        );

        // Return cleanup function
        return () => {
          subscription.unsubscribe();
        };
      },

      checkSession: async () => {
        try {
          set({ isLoading: true, error: null });

          // Create a client component client that uses cookies
          const supabaseClient = createClient();

          const { data, error } = await supabaseClient.auth.getSession();

          if (error) {
            throw error;
          }

          if (data?.session) {
            const { data: userData } = await supabaseClient.auth.getUser();
            set({
              user: userData.user,
              session: data.session,
              isLoading: false,
            });
          } else {
            set({ user: null, session: null, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      signIn: async (email, password) => {
        try {
          set({ isLoading: true, error: null });

          // Create a client component client that uses cookies
          const supabaseClient = createClient();

          const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            throw error;
          }

          set({ user: data.user, session: data.session, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      signUp: async (email, password, fullName) => {
        try {
          set({ isLoading: true, error: null });

          // Create a client component client that uses cookies
          const supabaseClient = createClient();

          const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) {
            throw error;
          }

          // Create profile entry
          if (data.user) {
            await supabaseClient
              .from("profiles")
              .insert({
                id: data.user.id,
                email: email,
                full_name: fullName,
              })
              .select()
              .single();
          }

          set({ isLoading: false });
          return { success: true, email };
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          return { success: false, email };
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });

          // Create a client component client that uses cookies
          const supabaseClient = createClient();

          const { error } = await supabaseClient.auth.signOut();

          if (error) {
            throw error;
          }

          set({ user: null, session: null, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      resetPassword: async (email) => {
        try {
          set({ isLoading: true, error: null });

          // Create a client component client that uses cookies
          const supabaseClient = createClient();

          const { error } = await supabaseClient.auth.resetPasswordForEmail(
            email,
            {
              redirectTo: `${window.location.origin}/auth/reset-password`,
            },
          );

          if (error) {
            throw error;
          }

          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      updateUser: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const user = get().user;

          // Create a client component client that uses cookies
          const supabaseClient = createClient();

          if (!user) {
            throw new Error("User not authenticated");
          }

          // Update profile
          const { error } = await supabaseClient
            .from("profiles")
            .update({
              ...data,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          if (error) {
            throw error;
          }

          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      signInWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });
          const supabaseClient = createClient();

          const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) {
            throw error;
          }

          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, session: state.session }),
    },
  ),
);
