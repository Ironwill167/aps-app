import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { BaseUrl } from '../config';
import { useQueryClient } from '@tanstack/react-query';

interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({ socket: null });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const socket = io(BaseUrl);

  useEffect(() => {
    // Listen for data change events
    socket.on('dataChanged', (data: { type: string }) => {
      switch (data.type) {
        case 'contacts':
          queryClient.invalidateQueries({ queryKey: ['contacts'] });
          break;
        case 'companies':
          queryClient.invalidateQueries({ queryKey: ['companies'] });
          break;
        case 'files':
          queryClient.invalidateQueries({ queryKey: ['files'] });
          break;
        case 'fees':
          queryClient.invalidateQueries({ queryKey: ['fees'] });
          break;
        // Add more cases as needed
        default:
          break;
      }
    });

    return () => {
      socket.off('dataChanged');
      socket.disconnect();
    };
  }, [socket, queryClient]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
