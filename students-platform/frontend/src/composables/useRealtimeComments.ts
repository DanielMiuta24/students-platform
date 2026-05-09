import { ref, onMounted, onUnmounted, watch } from 'vue';
import { socketService } from '../services/socket';
import { notifyTyping } from '../api/comment';
import type { SafeComment } from '../api/comment';
import { useAuth } from './useAuth';
import { useCommentTyping } from './useCommentTyping';

interface CommentEventPayload {
  id: string;
  timestamp: string;
  data: SafeComment | { commentId: string; childCommentIds: string[] };
}

interface TypingEventPayload {
  id: string;
  timestamp: string;
  data: {
    userId: string;
    name: string;
    userAvatar?: string;
    isTyping: boolean;
    parentCommentId?: string;
  };
}

export function useRealtimeComments(
  postId: string,
  onCommentCreated?: (comment: SafeComment) => void,
  onCommentUpdated?: (comment: SafeComment) => void,
  onCommentDeleted?: (commentId: string, childCommentIds: string[]) => void
) {
  const { user } = useAuth();
  const { handleTypingEvent } = useCommentTyping();
  const isConnected = ref(false);

  const handleCommentCreated = (payload: CommentEventPayload) => {
    console.log('[Realtime] Comment created:', payload);
    if (onCommentCreated && 'content' in payload.data) {
      onCommentCreated(payload.data as SafeComment);
    }
  };

  const handleCommentUpdated = (payload: CommentEventPayload) => {
    console.log('[Realtime] Comment updated:', payload);
    if (onCommentUpdated && 'content' in payload.data) {
      onCommentUpdated(payload.data as SafeComment);
    }
  };

  const handleCommentDeleted = (payload: CommentEventPayload) => {
    console.log('[Realtime] Comment deleted:', payload);
    if (onCommentDeleted && 'commentId' in payload.data) {
      const data = payload.data as { commentId: string; childCommentIds: string[] };
      onCommentDeleted(data.commentId, data.childCommentIds);
    }
  };

  const handleTyping = (payload: TypingEventPayload) => {
    handleTypingEvent(payload, user.value?.id);
  };

  const sendTypingIndicator = async (isTyping: boolean, parentCommentId?: string) => {
    try {
      await notifyTyping(postId, isTyping, parentCommentId);
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
    }
  };

  const throttledTypingIndicator = (() => {
    const timeouts = new Map<string, number>();
    const lastSentTimes = new Map<string, number>();
    const isCurrentlyTyping = new Map<string, boolean>();
    const THROTTLE_MS = 2000;

    return (isTyping: boolean, parentCommentId?: string) => {
      const key = parentCommentId || 'root';
      const now = Date.now();
      const lastSent = lastSentTimes.get(key) || 0;
      const existingTimeout = timeouts.get(key);
      const wasTyping = isCurrentlyTyping.get(key) || false;

      if (isTyping) {
        if (!wasTyping || now - lastSent > THROTTLE_MS) {
          sendTypingIndicator(true, parentCommentId);
          lastSentTimes.set(key, now);
          isCurrentlyTyping.set(key, true);
        }

        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }
        const timeout = window.setTimeout(() => {
          sendTypingIndicator(false, parentCommentId);
          timeouts.delete(key);
          isCurrentlyTyping.set(key, false);
        }, THROTTLE_MS + 500);
        timeouts.set(key, timeout);
      } else {
        if (existingTimeout) {
          clearTimeout(existingTimeout);
          timeouts.delete(key);
        }
        sendTypingIndicator(false, parentCommentId);
        isCurrentlyTyping.set(key, false);
      }
    };
  })();

  const connect = async () => {
    try {
      const socket = socketService.connect('');

      if (!socket.connected) {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Socket connection timeout'));
          }, 5000);

          socket.once('connect', () => {
            clearTimeout(timeout);
            resolve();
          });

          socket.once('connect_error', (error) => {
            clearTimeout(timeout);
            reject(error);
          });
        });
      }

      const result = await socketService.joinRoom('post', postId);
      if (result.success) {
        isConnected.value = true;

        socketService.on('comment:created', handleCommentCreated);
        socketService.on('comment:updated', handleCommentUpdated);
        socketService.on('comment:deleted', handleCommentDeleted);
        socketService.on('comment:typing', handleTyping);
      }
    } catch (error) {
      console.error('Realtime connection error:', error);
    }
  };

  const disconnect = async () => {
    try {
      await socketService.leaveRoom('post', postId);

      socketService.off('comment:created', handleCommentCreated);
      socketService.off('comment:updated', handleCommentUpdated);
      socketService.off('comment:deleted', handleCommentDeleted);
      socketService.off('comment:typing', handleTyping);

      isConnected.value = false;
    } catch (error) {
      console.error('Realtime disconnect error:', error);
    }
  };

  onMounted(() => {
    if (user.value) {
      connect();
    } else {
      const unwatch = watch(user, (newUser) => {
        if (newUser) {
          connect();
          unwatch();
        }
      }, { immediate: false });
    }
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    isConnected,
    sendTypingIndicator: throttledTypingIndicator,
    connect,
    disconnect,
  };
}
