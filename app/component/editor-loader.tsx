// src/components/collaborative-editor/components/EditorLoading.tsx
import React from 'react';

const EditorLoading: React.FC = () => {
  return (
    <div className="border rounded-md p-4 min-h-[300px] animate-pulse bg-gray-50">
      <div className="flex items-center space-x-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-6 w-6 rounded bg-gray-200"></div>
        ))}
        <div className="ml-auto h-6 w-6 rounded-full bg-gray-200"></div>
      </div>
      <div className="space-y-2.5">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
};

export default EditorLoading;
