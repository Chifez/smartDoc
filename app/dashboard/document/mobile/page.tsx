'use client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ColorSelector } from '@/app/component/color-selector';
import { FontSelector } from '@/app/component/font-selector';
import { Logo } from '@/app/component/logo';

export default function MobileDocumentPage() {
  const [content, setContent] = useState('');

  // password
  // vnWEIaaIfnhKPUni
  return (
    <div className="flex h-screen">
      <div className="hidden md:block w-64 bg-[#1E1E1E] text-white">
        <div className="p-4">
          <Logo className="mb-6 pl-3" />
          <div className="space-y-1 mb-6">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#2A2A2A]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#634AFF]"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-sm">Mobile Document Editor</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-sm text-gray-400">
                Document Editor Mobile
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded-md bg-[#3B82F6]">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
                </svg>
                <span className="text-sm">Screen 3</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </div>
          </div>

          <ColorSelector className="mb-6" />
          <FontSelector />
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#1E1E1E] text-white">
        <header className="flex items-center justify-between border-b border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-medium">
                Document Editor Mobile Screen
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 h-8 text-sm font-medium bg-transparent text-white border-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20V10" />
                <path d="m18 20-6-6-6 6" />
                <path d="M18 4H6" />
              </svg>
              Edit screen
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-md mx-auto bg-white text-black rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 bg-[#634AFF] text-white flex items-center justify-between">
              <h2 className="text-base font-medium">DocAI</h2>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs font-medium bg-transparent text-white border-white"
              >
                Share
              </Button>
            </div>

            <div className="border-b">
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="w-full grid grid-cols-4 bg-white h-10 p-0">
                  <TabsTrigger
                    value="edit"
                    className="data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-full text-xs"
                  >
                    Edit
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai"
                    className="data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-full text-xs"
                  >
                    AI Tools
                  </TabsTrigger>
                  <TabsTrigger
                    value="comments"
                    className="data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-full text-xs"
                  >
                    Comments
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-full text-xs"
                  >
                    History
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="p-4">
              <textarea
                placeholder="Start writing or paste your text"
                className="w-full min-h-[200px] resize-none border-none focus:outline-none focus:ring-0 bg-transparent text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="mt-6 ai-assistant-bg rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 className="h-4 w-4 text-purple-500" />
                  <h3 className="text-sm font-medium">AI Assistant</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Get real-time suggestions to improve your content
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-xs h-7 px-3 rounded-md"
                  >
                    Get suggestions
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 px-3 rounded-md bg-white"
                  >
                    Settings
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-[#F87171] text-white text-xs">
                      JS
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-medium">John Smith</p>
                    <p className="text-xs text-muted-foreground">
                      Editing introduction
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-md mx-auto bg-[#1E293B] text-white p-4 rounded-lg">
            <h3 className="text-base font-medium mb-2">
              What do you want to edit or add to the screen?
            </h3>
            <textarea
              placeholder="Type your instructions here..."
              className="w-full min-h-[100px] resize-none bg-[#0F172A] border border-gray-700 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#634AFF]"
            />
            <Button className="w-full mt-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white">
              Generate edits
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
