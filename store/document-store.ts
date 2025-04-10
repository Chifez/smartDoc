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

      // Fetch documents created by the user
      const { data: ownedDocuments, error: ownedError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id);

      if (ownedError) {
        throw ownedError;
      }

      // Fetch documents shared with the user
      const { data: sharedDocuments, error: sharedError } = await supabase
        .from('document_permissions')
        .select('document_id, permission_level, documents(*)')
        .eq('user_id', user.id);

      if (sharedError) {
        throw sharedError;
      }

      // Combine and deduplicate documents
      const sharedDocs = (sharedDocuments || []).map((item) => ({
        ...item.documents,
        permission_level: item.permission_level,
      }));

      const allDocuments = [...(ownedDocuments || []), ...sharedDocs];

      // Remove duplicates
      const uniqueDocuments = Array.from(
        new Map(allDocuments.map((doc) => [doc.id, doc])).values()
      );

      set({ documents: uniqueDocuments, isLoading: false });
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

      // Fetch document
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      // Check if user has permission to access this document
      if (data.user_id !== user.id) {
        const { data: permission, error: permissionError } = await supabase
          .from('document_permissions')
          .select('*')
          .eq('document_id', id)
          .eq('user_id', user.id)
          .single();

        if (permissionError || !permission) {
          throw new Error('You do not have permission to access this document');
        }
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

      // Create an empty TipTap document structure
      const emptyDocument = JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      });

      // Simplify the document creation to avoid permission checks
      const newDocument = {
        title: document.title,
        content: document.content || emptyDocument,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_public: false,
      };

      console.log('Attempting to insert document:', newDocument);

      // Insert directly into documents table without checking permissions
      const { data, error } = await supabase
        .from('documents')
        .insert(newDocument)
        .select(
          'id, title, content, user_id, created_at, updated_at, is_public'
        )
        .single();

      if (error) {
        console.error('Error inserting document:', error);
        throw error;
      }

      console.log('Document created successfully:', data);

      set((state) => ({
        documents: [...state.documents, data],
        currentDocument: data,
        isLoading: false,
      }));

      return data.id;
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

      const { currentDocument } = get();

      if (!currentDocument) {
        throw new Error('No document selected');
      }

      // Check if user has permission to update this document
      if (currentDocument.user_id !== user.id) {
        const { data: permission, error: permissionError } = await supabase
          .from('document_permissions')
          .select('*')
          .eq('document_id', id)
          .eq('user_id', user.id)
          .single();

        if (
          permissionError ||
          !permission ||
          permission.permission_level === 'read'
        ) {
          throw new Error('You do not have permission to update this document');
        }
      }

      const updatedDocument: DocumentUpdate = {
        ...document,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('documents')
        .update(updatedDocument)
        .eq('id', id)
        .select()
        .single();

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

      // Check if user has permission to view permissions
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (docError) {
        throw docError;
      }

      if (document.user_id !== user.id) {
        throw new Error(
          'You do not have permission to view document permissions'
        );
      }

      const { data, error } = await supabase
        .from('document_permissions')
        .select('*')
        .eq('document_id', documentId);

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
