// src/components/collaborative-editor/components/ConnectionIndicator.tsx
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionIndicatorProps {
  connected: boolean;
}

const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({
  connected,
}) => {
  return (
    <div
      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
        connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {connected ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Reconnecting...</span>
        </>
      )}
    </div>
  );
};

export default ConnectionIndicator;
