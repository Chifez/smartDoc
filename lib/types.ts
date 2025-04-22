export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      document_permissions: {
        Row: {
          created_at: string;
          document_id: string;
          id: string;
          permission_level: string;
          user_id: string;
        };
        Insert: {
          document_id: string;
          id?: string;
          permission_level: string;
          user_id: string;
        };
        Update: {
          document_id?: string;
          id?: string;
          permission_level?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "document_permissions_document_id_fkey";
            columns: ["document_id"];
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_permissions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      documents: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          is_public: boolean;
          title: string;
          updated_at: string;
          user_id: string;
          is_favorite: boolean;
        };
        Insert: {
          content?: string;
          created_at?: string;
          id?: string;
          is_public?: boolean;
          title: string;
          updated_at?: string;
          user_id: string;
          is_favorite?: boolean;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          is_public?: boolean;
          title?: string;
          updated_at?: string;
          user_id?: string;
          is_favorite?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          email: string;
          full_name: string | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export interface UserPresence {
  id: string;
  email: string;
  color: string;
  position: {
    x: number;
    y: number;
    selection: {
      from: number;
      to: number;
    };
  } | null;
  lastActive: number;
}
