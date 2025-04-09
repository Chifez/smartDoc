"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Collaboration from "@tiptap/extension-collaboration"
import CollaborationCursor from "@tiptap/extension-collaboration-cursor"
import Placeholder from "@tiptap/extension-placeholder"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { useAuthStore } from "@/store/auth-store"
import { createDocumentChannel, trackDocumentUsers, type UserPresence, updateCursorPosition } from "@/lib/realtime"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Code } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"
import { debounce } from "lodash"

interface CollaborativeEditorProps {
  documentId: string
  initialContent: string
  onChange: (content: string) => void
  placeholder?: string
}

export function CollaborativeEditor({
  documentId,
  initialContent,
  onChange,
  placeholder = "Start writing or paste your text...",
}: CollaborativeEditorProps) {
  const { user } = useAuthStore()
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [activeUsers, setActiveUsers] = useState<Record<string, UserPresence>>({})

  // Create a debounced version of onChange
  const debouncedOnChange = debounce((content: string) => {
    onChange(content)
  }, 300)

  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Collaboration.configure({
        document: initialContent ? JSON.parse(initialContent) : undefined,
      }),
      CollaborationCursor.configure({
        provider: channel,
        user: user
          ? {
              name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Anonymous",
              color: user.id ? `hsl(${Number.parseInt(user.id.substring(0, 8), 16) % 360}, 70%, 60%)` : "#634AFF",
              avatar: user.user_metadata?.avatar_url,
            }
          : undefined,
      }),
    ],
    content: initialContent || "",
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON())
      const html = editor.getHTML()
      debouncedOnChange(json)
    },
    autofocus: "end",
  })

  // Set up the realtime channel
  useEffect(() => {
    if (!user || !documentId) return

    const newChannel = createDocumentChannel(documentId, user)
    if (newChannel) {
      setChannel(newChannel)

      // Track users in the document
      const cleanup = trackDocumentUsers(newChannel, user, (users) => {
        setActiveUsers(users)
      })

      return cleanup
    }
  }, [documentId, user])

  // Update cursor position on mouse move
  const handleMouseMove = debounce((e: React.MouseEvent) => {
    if (!channel || !editor) return

    const view = editor.view
    const pos = view.posAtCoords({ left: e.clientX, top: e.clientY })

    if (pos) {
      updateCursorPosition(channel, {
        x: e.clientX,
        y: e.clientY,
        selection: {
          from: editor.state.selection.from,
          to: editor.state.selection.to,
        },
      })
    }
  }, 50)

  if (!editor) {
    return (
      <div className="border rounded-md p-4 min-h-[300px] animate-pulse bg-gray-50">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2.5"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2.5"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="border-b pb-2 mb-4 flex items-center gap-2 overflow-x-auto">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          aria-label="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("codeBlock")}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
          aria-label="Code Block"
        >
          <Code className="h-4 w-4" />
        </Toggle>

        <div className="ml-auto flex items-center gap-1">
          <TooltipProvider>
            {Object.values(activeUsers)
              .filter((u) => u.id !== user?.id)
              .map((activeUser) => (
                <Tooltip key={activeUser.id}>
                  <TooltipTrigger asChild>
                    <Avatar
                      className={cn("h-6 w-6 border-2", {
                        "border-green-500": Date.now() - activeUser.lastActive < 60000, // Active in the last minute
                        "border-yellow-500":
                          Date.now() - activeUser.lastActive >= 60000 && Date.now() - activeUser.lastActive < 300000, // Active in the last 5 minutes
                        "border-gray-300": Date.now() - activeUser.lastActive >= 300000, // Inactive for more than 5 minutes
                      })}
                      style={{ borderColor: activeUser.color }}
                    >
                      <AvatarImage src={activeUser.avatar_url || ""} />
                      <AvatarFallback style={{ backgroundColor: activeUser.color }}>
                        {activeUser.name?.substring(0, 2) || activeUser.email?.substring(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{activeUser.name || activeUser.email || "Anonymous User"}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
          </TooltipProvider>
        </div>
      </div>

      <div onMouseMove={handleMouseMove} className="prose prose-sm max-w-none">
        <EditorContent editor={editor} className="min-h-[300px] focus:outline-none" />
      </div>
    </div>
  )
}
