import { ref, computed } from 'vue';
import type { Ref } from 'vue';

interface TypingUser {
  userId: string;
  name: string;
  userAvatar?: string;
  timestamp: number;
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

const typingUsersMap = ref<Map<string, Map<string, TypingUser>>>(new Map());
const TYPING_TIMEOUT = 3000;
let cleanupInterval: number | null = null;

const startGlobalCleanup = () => {
  if (cleanupInterval) return;

  cleanupInterval = window.setInterval(() => {
    const now = Date.now();
    let hasChanges = false;

    typingUsersMap.value.forEach((usersMap, commentKey) => {
      const newUsersMap = new Map(usersMap);

      usersMap.forEach((typingUser, userId) => {
        if (now - typingUser.timestamp > TYPING_TIMEOUT) {
          newUsersMap.delete(userId);
          hasChanges = true;
        }
      });

      if (newUsersMap.size === 0) {
        typingUsersMap.value.delete(commentKey);
      } else if (hasChanges) {
        typingUsersMap.value.set(commentKey, newUsersMap);
      }
    });

    if (hasChanges) {
      typingUsersMap.value = new Map(typingUsersMap.value);
    }

    if (typingUsersMap.value.size === 0 && cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = null;
    }
  }, TYPING_TIMEOUT);
};

export function useCommentTyping(commentId?: string) {
  const commentKey = commentId || 'root';

  const typingUsers = computed(() => {
    return typingUsersMap.value.get(commentKey) || new Map();
  });

  const typingUsersText = computed(() => {
    const users = Array.from(typingUsers.value.values());
    if (users.length === 0) return '';
    if (users.length === 1) return `${users[0].name} is typing...`;
    if (users.length === 2) return `${users[0].name} and ${users[1].name} are typing...`;
    return `${users[0].name} and ${users.length - 1} others are typing...`;
  });

  const handleTypingEvent = (payload: TypingEventPayload, currentUserId?: string) => {
    const { userId, name, userAvatar, isTyping, parentCommentId } = payload.data;
    const targetCommentKey = parentCommentId || 'root';

    if (userId === currentUserId) {
      return;
    }

    const usersMap = typingUsersMap.value.get(targetCommentKey) || new Map();
    const newUsersMap = new Map(usersMap);

    if (isTyping) {
      newUsersMap.set(userId, {
        userId,
        name,
        userAvatar,
        timestamp: Date.now(),
      });
    } else {
      newUsersMap.delete(userId);
    }

    if (newUsersMap.size === 0) {
      typingUsersMap.value.delete(targetCommentKey);
    } else {
      typingUsersMap.value.set(targetCommentKey, newUsersMap);
    }

    typingUsersMap.value = new Map(typingUsersMap.value);

    startGlobalCleanup();
  };

  return {
    typingUsers,
    typingUsersText,
    handleTypingEvent,
  };
}
