'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Copy, Check, X } from 'lucide-react';
import { useDocumentStore } from '@/store/document-store';
import { createClient } from '@/lib/utils/supabase/client';

interface ShareDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
}

export function ShareDocumentDialog({
  isOpen,
  onClose,
  documentId,
}: ShareDocumentDialogProps) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'read' | 'write' | 'admin'>(
    'read'
  );
  const [permissions, setPermissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [link, setLink] = useState('');

  const { getDocumentPermissions, shareDocument, removeDocumentAccess } =
    useDocumentStore();

  const supabase = createClient();
  // Load existing permissions
  useEffect(() => {
    if (isOpen && documentId) {
      loadPermissions();
    }
  }, [isOpen, documentId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLink(`${window.location.origin}/document/${documentId}`);
    }
  }, [documentId]);

  const loadPermissions = async () => {
    setIsLoading(true);
    try {
      const perms = await getDocumentPermissions(documentId);
      setPermissions(perms);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Search for users by email
  const searchUsers = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url')
        .ilike('email', `%${query}%`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    }
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    searchUsers(value);
  };

  // Handle share button click
  const handleShare = async () => {
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      // Find user by email
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .limit(1);

      if (userError) throw userError;

      if (!users || users.length === 0) {
        throw new Error('User not found with this email');
      }

      const userId = users[0].id;

      // Share document
      await shareDocument(documentId, userId, permission);

      // Reload permissions
      await loadPermissions();

      // Clear form
      setEmail('');
      setSearchResults([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle remove access
  const handleRemoveAccess = async (userId: string) => {
    setIsLoading(true);
    try {
      await removeDocumentAccess(documentId, userId);
      await loadPermissions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle copy link
  const handleCopyLink = () => {
    // const link = `${window && window.location.origin}/document/${documentId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle select user from search results
  const handleSelectUser = (user: any) => {
    setEmail(user.email);
    setSearchResults([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share document</DialogTitle>
          <DialogDescription>
            Share this document with others to collaborate in real-time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue={link} readOnly className="h-9" />
            </div>
            <Button
              type="button"
              size="sm"
              className="px-3"
              onClick={handleCopyLink}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy link</span>
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Input
                id="email"
                placeholder="Enter email address"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                  <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
                    {searchResults.map((user) => (
                      <li
                        key={user.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectUser(user)}
                      >
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={user.avatar_url || ''} />
                          <AvatarFallback>
                            {user.full_name
                              ?.split(' ')
                              .map((n: string) => n[0])
                              .join('') ||
                              user.email?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {user.full_name || 'User'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="permission">Permission</Label>
            <Select
              value={permission}
              onValueChange={(value) => setPermission(value as any)}
            >
              <SelectTrigger id="permission">
                <SelectValue placeholder="Select permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="read">Can view</SelectItem>
                <SelectItem value="write">Can edit</SelectItem>
                <SelectItem value="admin">Can manage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            className="w-full bg-[#634AFF] hover:bg-[#5338FF]"
            onClick={handleShare}
            disabled={isLoading || !email}
          >
            {isLoading ? 'Sharing...' : 'Share'}
          </Button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {permissions.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">People with access</h3>
            <ul className="space-y-2">
              {permissions.map((perm) => (
                <li key={perm.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={perm.profiles?.avatar_url || ''} />
                      <AvatarFallback>
                        {perm.profiles?.full_name
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .join('') ||
                          perm.profiles?.email?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {perm.profiles?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {perm.profiles?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {perm.permission_level === 'read'
                        ? 'Can view'
                        : perm.permission_level === 'write'
                        ? 'Can edit'
                        : 'Can manage'}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveAccess(perm.user_id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
