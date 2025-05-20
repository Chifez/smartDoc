import { create } from "zustand";
import { useAuthStore } from "./auth-store";
import { Database } from "@/lib/types";
import { createClient } from "@/lib/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  sendInvitationEmail,
  sendShareNotificationEmail,
} from "@/lib/email-service";

type Document = Database["public"]["Tables"]["documents"]["Row"];
type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
type DocumentUpdate = Database["public"]["Tables"]["documents"]["Update"];
type DocumentPermission =
  Database["public"]["Tables"]["document_permissions"]["Row"];

interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  isPermissionsLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  fetchDocument: (id: string) => Promise<{ data: Document }>;
  createDocument: (
    document: Omit<DocumentInsert, "user_id">,
  ) => Promise<string | null>;
  updateDocument: (id: string, document: DocumentUpdate) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  setCurrentDocument: (document: Document | null) => void;
  shareDocument: (
    documentId: string,
    email: string,
    permissionLevel: "read" | "write" | "admin",
  ) => Promise<{
    success: boolean;
    permission?: DocumentPermission;
    token?: string;
    needsInvitation?: boolean;
  }>;
  removeDocumentAccess: (documentId: string, userId: string) => Promise<void>;
  getDocumentPermissions: (documentId: string) => Promise<DocumentPermission[]>;
  searchUsers: (
    query: string,
  ) => Promise<{ data: Partial<User[]>; error: string | null }>;
  toggleFavorite: (documentId: string) => Promise<void>;
  hasMultipleUsers: (documentId: string) => Promise<boolean>;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  currentDocument: null,
  isLoading: false,
  isPermissionsLoading: false,
  error: null,

  fetchDocuments: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      const supabase = createClient();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Use the security definer function to fetch documents
      const { data: documents, error } = await supabase.rpc(
        "get_user_documents",
      );

      if (error) {
        throw error;
      }

      set({ documents: documents || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchDocument: async (id) => {
    try {
      // Reset current document state before fetching new one
      set({ currentDocument: null, isLoading: true, error: null });

      const user = useAuthStore.getState().user;
      const supabase = createClient();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Use the security definer function to fetch document with permission check
      const { data, error } = (await supabase
        .rpc("get_document_with_permission", { p_document_id: id })
        .single()) as { data: Document | null; error: any };

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error(
          "Document not found or you do not have permission to access it",
        );
      }

      set({ currentDocument: data, isLoading: false });
      return { data };
    } catch (error: any) {
      set({ error: error.message, isLoading: false, currentDocument: null });
      throw error;
    }
  },

  createDocument: async (document) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      const supabase = createClient();

      console.log("Creating document with user:", user);

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Use the security definer function to create document
      const { data, error } = await supabase.rpc("create_user_document", {
        p_title: document.title,
        p_is_public: document.is_public,
        p_user_id: user.id,
      });

      if (error) {
        console.error("Error creating document:", error);
        throw error;
      }

      console.log("Document created successfully with ID:", data);

      // Fetch the newly created document to update the store
      // const { data: newDocument, error: fetchError } = await supabase
      //   .from('documents')
      //   .select('*')
      //   .eq('id', data)
      //   .single();

      const { data: newDocument, error: fetchError } = (await supabase
        .rpc("get_document_with_permission", { p_document_id: data })
        .single()) as { data: Document; error: any };

      if (fetchError) {
        throw fetchError;
      }

      set((state) => ({
        documents: [...state.documents, newDocument],
        currentDocument: newDocument,
        isLoading: false,
      }));

      return data;
    } catch (error: any) {
      console.error("Error in createDocument:", error);
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  updateDocument: async (id, document) => {
    try {
      set({ error: null });
      const user = useAuthStore.getState().user;
      const supabase = createClient();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Use the security definer function to update document
      const { data, error } = await supabase.rpc("update_user_document", {
        p_document_id: id,
        p_title: document.title,
        p_content: document.content,
        p_is_public: document.is_public,
        p_user_id: user.id,
      });

      if (error) {
        throw error;
      }

      set((state) => ({
        documents: state.documents.map((doc) => (doc.id === id ? data : doc)),
        currentDocument: data,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteDocument: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      const supabase = createClient();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Check if user has permission to delete this document
      const { data: document, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (docError) {
        throw docError;
      }

      if (document.user_id !== user.id) {
        throw new Error("You do not have permission to delete this document");
      }

      // Delete document permissions first
      await supabase
        .from("document_permissions")
        .delete()
        .eq("document_id", id);

      // Delete document
      const { error } = await supabase.from("documents").delete().eq("id", id);

      if (error) {
        throw error;
      }

      set((state) => ({
        documents: state.documents.filter((doc) => doc.id !== id),
        currentDocument: null,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setCurrentDocument: (document) => {
    set({ currentDocument: document });
  },

  shareDocument: async (documentId, email, permissionLevel) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      const supabase = createClient();
      const { currentDocument } = get();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Check if user exists
      const { data: users, error: searchError } = await supabase.rpc(
        "search_user_by_email",
        { p_email: email },
      );

      if (searchError) throw searchError;

      // If no users found, create invitation
      if (!users || users.length === 0) {
        const { data: token, error: invitationError } = await supabase.rpc(
          "create_document_invitation",
          {
            p_document_id: documentId,
            p_email: email,
            p_invited_by: user.id,
          },
        );

        if (invitationError) throw invitationError;

        // Send invitation email
        const documentTitle = "Untitled Document";
        await sendInvitationEmail({
          to: email,
          documentTitle,
          signupLink:
            `${window.location.origin}/auth/callback?token=:token&invitation=${token}&document=${documentId}`,
          invitedBy: user.email || "Unknown User",
        });

        return { success: true, needsInvitation: true, token };
      }

      // User exists, create permission
      const { data: permission, error: permissionError } = await supabase.rpc(
        "share_document",
        {
          p_document_id: documentId,
          p_user_id: users[0].id,
          p_permission_level: permissionLevel,
        },
      );

      if (permissionError) throw permissionError;

      // Send share notification email
      const documentTitle = "Untitled Document";
      await sendShareNotificationEmail({
        to: email,
        documentTitle,
        documentLink:
          `${window.location.origin}/dashboard/document/${documentId}`,
        sharedBy: user.email || "Unknown User",
      });

      return { success: true, permission };
    } catch (error: any) {
      console.error("Error sharing document:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  removeDocumentAccess: async (documentId, userId) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      const supabase = createClient();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Use the security definer function to remove document access
      const { data, error } = await supabase.rpc("remove_document_permission", {
        p_document_id: documentId,
        p_user_id: userId,
        p_requester_id: user.id,
      });

      if (error) {
        throw error;
      }
      console.log("remove access data", data);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getDocumentPermissions: async (documentId) => {
    try {
      set({ isPermissionsLoading: true });
      const supabase = createClient();

      const { data, error } = await supabase.rpc("get_document_permissions", {
        p_document_id: documentId,
      });

      if (error) {
        throw error;
      }

      set({ isPermissionsLoading: false });
      return data;
    } catch (error: any) {
      set({ error: error.message, isPermissionsLoading: false });
      return null;
    }
  },

  searchUsers: async (query: string) => {
    if (!query) return { data: [], error: null };
    const supabase = createClient();
    try {
      const { data, error } = await supabase.rpc("search_user_by_email", {
        p_email: query,
      });

      if (error) throw error;

      return {
        data: data || [],
        error: null,
      };
    } catch (error) {
      console.error("Error searching users:", error);
      return {
        data: [],
        error: error instanceof Error
          ? error.message
          : "Failed to search users",
      };
    }
  },

  toggleFavorite: async (documentId) => {
    try {
      set({ error: null });
      const user = useAuthStore.getState().user;
      const supabase = createClient();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Use the security definer function to toggle favorite
      const { data: isFavorite, error } = await supabase.rpc(
        "toggle_document_favorite",
        {
          p_document_id: documentId,
          p_user_id: user.id,
        },
      );

      if (error) {
        throw error;
      }

      // Update the document in the store
      set((state) => ({
        documents: state.documents.map((doc) =>
          doc.id === documentId ? { ...doc, is_favorite: isFavorite } : doc
        ),
        currentDocument: state.currentDocument?.id === documentId
          ? { ...state.currentDocument, is_favorite: isFavorite }
          : state.currentDocument,
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  hasMultipleUsers: async (documentId) => {
    try {
      const permissions = await get().getDocumentPermissions(documentId);
      console.log("permissions", permissions);
      return permissions && permissions.length >= 1;
    } catch (error) {
      console.error("Error checking document users:", error);
      return false;
    }
  },
}));
