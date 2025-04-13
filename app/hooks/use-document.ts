import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDocumentStore } from '@/store/document-store';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import { useRef } from 'react';
import { debounce } from 'lodash';

export function useDocument(id: string) {
  const {
    fetchDocument,
    updateDocument,
    deleteDocument,
    removeDocumentAccess,
  } = useDocumentStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Query for fetching document
  const {
    data: document,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      const { data } = await fetchDocument(id);
      return data;
    },
    enabled: !!user && !!id,
  });

  // Mutation for updating document
  const updateMutation = useMutation({
    mutationFn: async ({
      title,
      content,
    }: {
      title: string;
      content: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return updateDocument(id, { title, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', id] });
      toast.success('Document saved successfully');
    },
    onError: (error) => {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
    },
  });

  // Mutation for deleting document or removing access
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // If user is owner or admin, delete the document
      if (document?.user_id === user.id || user.role === 'admin') {
        return deleteDocument(id);
      } else {
        // Otherwise, just remove their access
        return removeDocumentAccess(id, user.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success(
        document?.user_id === user?.id || user?.role === 'admin'
          ? 'Document deleted successfully'
          : 'Access removed successfully'
      );
    },
    onError: (error) => {
      console.error('Error:', error);
      toast.error(
        document?.user_id === user?.id || user?.role === 'admin'
          ? 'Failed to delete document'
          : 'Failed to remove access'
      );
    },
  });

  const debouncedUpdate = debounce((title: string, content: string) => {
    updateMutation.mutate({ title, content });
  }, 500);

  return {
    document,
    isLoading,
    error,
    isOwner: document?.user_id === user?.id,
    updateDocument: debouncedUpdate,
    deleteDocument: deleteMutation.mutate,
    isSaving: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
