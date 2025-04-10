import { create } from 'zustand';
import { useAuthStore } from './auth-store';
import { Database } from '@/lib/types';
import { createClient } from '@/lib/utils/supabase/client';

type Document = Database['public']['Tables']['documents']['Row'];
type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
type DocumentUpdate = Database['public']['Tables']['documents']['Update'];
type DocumentPermission =
  Database['public']['Tables']['document_permissions']['Row'];

interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  fetchDocument: (id: string) => Promise<void>;
  createDocument: (
    document: Omit<DocumentInsert, 'user_id'>
  ) => Promise<string | null>;
  updateDocument: (id: string, document: DocumentUpdate) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  setCurrentDocument: (document: Document | null) => void;
  shareDocument: (
    documentId: string,
    userId: string,
    permissionLevel: 'read' | 'write' | 'admin'
  ) => Promise<void>;
  removeDocumentAccess: (documentId: string, userId: string) => Promise<void>;
  getDocumentPermissions: (documentId: string) => Promise<DocumentPermission[]>;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  currentDocument: null,
  isLoading: false,
  error: null,

  fetchDocuments: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      const supabase = createClient();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Use the security definer function to fetch documents
      const { data: documents, error } = await supabase.rpc(
        'get_user_documents'
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
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      const supabase = createClient();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Use the security definer function to fetch document with permission check
      const { data, error } = (await supabase
        .rpc('get_document_with_permission', { p_document_id: id })
        .single()) as { data: Document | null; error: any };

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error(
          'Document not found or you do not have permission to access it'
        );
      }

      set({ currentDocument: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createDocument: async (document) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      const supabase = createClient();

      console.log('Creating document with user:', user);

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Use the security definer function to create document
      const { data, error } = await supabase.rpc('create_user_document', {
        p_title: document.title,
        p_is_public: document.is_public,
        p_user_id: user.id,
      });

      if (error) {
        console.error('Error creating document:', error);
        throw error;
      }

      console.log('Document created successfully with ID:', data);

      // Fetch the newly created document to update the store
      const { data: newDocument, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', data)
        .single();

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
      console.error('Error in createDocument:', error);
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
        throw new Error('User not authenticated');
      }

      // Use the security definer function to update document
      const { data, error } = await supabase.rpc('update_user_document', {
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
        throw new Error('User not authenticated');
      }

      // Check if user has permission to delete this document
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (docError) {
        throw docError;
      }

      if (document.user_id !== user.id) {
        throw new Error('You do not have permission to delete this document');
      }

      // Delete document permissions first
      await supabase
        .from('document_permissions')
        .delete()
        .eq('document_id', id);

      // Delete document
      const { error } = await supabase.from('documents').delete().eq('id', id);

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

  shareDocument: async (documentId, userId, permissionLevel) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      const supabase = createClient();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check if user has permission to share this document
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (docError) {
        throw docError;
      }

      if (document.user_id !== user.id) {
        throw new Error('You do not have permission to share this document');
      }

      const { error } = await supabase.from('document_permissions').insert({
        document_id: documentId,
        user_id: userId,
        permission_level: permissionLevel,
        created_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  removeDocumentAccess: async (documentId, userId) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      const supabase = createClient();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check if user has permission to remove access
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (docError) {
        throw docError;
      }

      if (document.user_id !== user.id) {
        throw new Error('You do not have permission to remove access');
      }

      const { error } = await supabase
        .from('document_permissions')
        .delete()
        .eq('document_id', documentId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getDocumentPermissions: async (documentId) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      const supabase = createClient();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Use the security definer function to get permissions
      const { data, error } = await supabase.rpc('get_document_permissions', {
        document_id: documentId,
      });

      if (error) {
        throw error;
      }

      set({ isLoading: false });
      return data || [];
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },
}));
