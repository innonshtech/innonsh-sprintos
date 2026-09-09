import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../auth/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface CustomSocket {
  connected: boolean;
  id: string;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
  emit: (event: string, payload?: any, callback?: (...args: any[]) => void) => void;
}

interface SocketContextType {
  socket: CustomSocket | null;
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  joinProject: () => {},
  leaveProject: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuthStore();
  const [socket, setSocket] = useState<CustomSocket | null>(null);

  const listenersRef = useRef<Map<string, Set<(...args: any[]) => void>>>(new Map());
  const globalChannelRef = useRef<RealtimeChannel | null>(null);
  const activeRoomChannelsRef = useRef<Map<string, RealtimeChannel>>(new Map());

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (globalChannelRef.current) {
        supabase.removeChannel(globalChannelRef.current);
        globalChannelRef.current = null;
      }
      activeRoomChannelsRef.current.forEach((ch) => supabase.removeChannel(ch));
      activeRoomChannelsRef.current.clear();
      setSocket(null);
      return;
    }

    const listeners = listenersRef.current;

    const emitToListeners = (event: string, data: any) => {
      const handlers = listeners.get(event);
      if (handlers) {
        handlers.forEach((fn) => {
          try {
            fn(data);
          } catch (err) {
            console.error(`Error in realtime handler for event ${event}:`, err);
          }
        });
      }
    };

    // Create primary global realtime channel
    const globalChannel = supabase.channel('sprintos-global', {
      config: {
        broadcast: { self: true },
        presence: { key: user.id },
      },
    });

    globalChannelRef.current = globalChannel;

    // Listen to broadcast events
    globalChannel.on('broadcast', { event: '*' }, (payload) => {
      const eventName = payload.event;
      const data = payload.payload;
      emitToListeners(eventName, data);
    });

    // Listen to presence events
    globalChannel.on('presence', { event: 'sync' }, () => {
      const state = globalChannel.presenceState();
      const presences: Record<string, string> = {};
      Object.keys(state).forEach((userId) => {
        presences[userId] = 'ONLINE';
      });
      emitToListeners('presence:init', presences);
    });

    globalChannel.on('presence', { event: 'join' }, ({ key }) => {
      emitToListeners('presence:update', { userId: key, status: 'ONLINE' });
    });

    globalChannel.on('presence', { event: 'leave' }, ({ key }) => {
      emitToListeners('presence:update', { userId: key, status: 'OFFLINE' });
    });

    // User personal notification channel
    const userChannel = supabase.channel(`user:${user.id}`, {
      config: { broadcast: { self: true } },
    });
    userChannel.on('broadcast', { event: '*' }, (payload) => {
      emitToListeners(payload.event, payload.payload);
    });

    globalChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        console.log('⚡ Connected to SprintOS Real-Time Engine via Supabase Realtime');
        await globalChannel.track({ userId: user.id, name: user.name, status: 'ONLINE' });
      }
    });

    userChannel.subscribe();

    // Adapter socket interface for existing components
    const socketAdapter: CustomSocket = {
      connected: true,
      id: user.id,
      on: (event: string, callback: (...args: any[]) => void) => {
        if (!listeners.has(event)) {
          listeners.set(event, new Set());
        }
        listeners.get(event)!.add(callback);
      },
      off: (event: string, callback?: (...args: any[]) => void) => {
        if (!callback) {
          listeners.delete(event);
        } else {
          listeners.get(event)?.delete(callback);
        }
      },
      emit: (event: string, payload?: any, callback?: (...args: any[]) => void) => {
        // Handle custom client socket triggers
        if (event === 'chat:room:join') {
          const channelId = payload?.channelId;
          if (channelId) {
            const roomTopic = `chat:room:${channelId}`;
            if (!activeRoomChannelsRef.current.has(channelId)) {
              const roomChannel = supabase.channel(roomTopic, {
                config: { broadcast: { self: true } },
              });
              roomChannel.on('broadcast', { event: '*' }, (p) => {
                emitToListeners(p.event, p.payload);
              });
              roomChannel.subscribe();
              activeRoomChannelsRef.current.set(channelId, roomChannel);
            }
          }
          if (callback) callback({ success: true });
        } else if (event === 'chat:room:leave') {
          const channelId = payload?.channelId;
          if (channelId && activeRoomChannelsRef.current.has(channelId)) {
            const roomChannel = activeRoomChannelsRef.current.get(channelId)!;
            supabase.removeChannel(roomChannel);
            activeRoomChannelsRef.current.delete(channelId);
          }
        } else if (event === 'presence:get') {
          const state = globalChannel.presenceState();
          const presences: Record<string, string> = {};
          Object.keys(state).forEach((uid) => {
            presences[uid] = 'ONLINE';
          });
          emitToListeners('presence:init', presences);
          if (callback) callback({ success: true, presences });
        } else {
          // Broadcast to global channel
          globalChannel.send({
            type: 'broadcast',
            event,
            payload: payload || {},
          });
          if (callback) callback({ success: true });
        }
      },
    };

    setSocket(socketAdapter);

    // Global Event Handlers for UI invalidate triggers
    const handleTaskUpdated = (data: { action: string; taskId: string; projectId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (data.taskId) {
        queryClient.invalidateQueries({ queryKey: ['task', data.taskId] });
      }
    };

    const handleBlockerAdded = (data: { blocker: any; projectId: string; taskId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (data.taskId) {
        queryClient.invalidateQueries({ queryKey: ['task', data.taskId] });
      }
      toast({
        variant: 'destructive',
        title: 'New Blocker Reported',
        description: data.blocker?.description,
      });
    };

    const handleBlockerResolved = (data: { blockerId: string; projectId: string; taskId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (data.taskId) {
        queryClient.invalidateQueries({ queryKey: ['task', data.taskId] });
      }
    };

    const handleNotificationNew = (notification: { id: string; title: string; message: string; linkUrl: string | null }) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: notification.title,
        description: notification.message,
      });
    };

    socketAdapter.on('task:updated', handleTaskUpdated);
    socketAdapter.on('blocker:added', handleBlockerAdded);
    socketAdapter.on('blocker:resolved', handleBlockerResolved);
    socketAdapter.on('notification:new', handleNotificationNew);

    return () => {
      supabase.removeChannel(globalChannel);
      supabase.removeChannel(userChannel);
      activeRoomChannelsRef.current.forEach((ch) => supabase.removeChannel(ch));
      activeRoomChannelsRef.current.clear();
      listeners.clear();
      setSocket(null);
    };
  }, [isAuthenticated, user, queryClient, toast]);

  const joinProject = (projectId: string) => {};
  const leaveProject = (projectId: string) => {};

  return (
    <SocketContext.Provider value={{ socket, joinProject, leaveProject }}>
      {children}
    </SocketContext.Provider>
  );
};
