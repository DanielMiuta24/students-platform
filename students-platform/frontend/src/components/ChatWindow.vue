<template>
  <div class="chat-window">
    <!-- Messages Container -->
    <div ref="messagesContainer" class="messages-container" @scroll="handleScroll">
      <!-- Messages using MessageBubble -->
      <MessageBubble
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :current-user-id="currentUserId"
        :show-info="showMessageInfo === message.id"
        :show-seen-status="showSeenStatus"
        @toggle-info="toggleMessageInfo"
        @edit-save="handleEditSave"
        @delete-message-menu="handleDeleteMessage"
      />

      <!-- Typing indicator -->
      <div v-if="isOtherUserTyping" class="typing-indicator">
        <div class="typing-dots">
          <div class="typing-dot"></div>
          <div class="typing-dot" style="animation-delay: 150ms"></div>
          <div class="typing-dot" style="animation-delay: 300ms"></div>
        </div>
      </div>
    </div>

    <!-- New Messages Notification -->
    <div v-if="unreadNewMessages > 0 && !isAtBottom" class="new-messages-notification" @click="scrollToBottomAndClear">
      <svg xmlns="http://www.w3.org/2000/svg" class="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      <span>{{ unreadNewMessages }} new message{{ unreadNewMessages > 1 ? 's' : '' }}</span>
    </div>

    <!-- Input Area -->
    <div class="chat-input">
      <button @click="toggleEmojiPicker" class="emoji-button" title="Add emoji">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="2"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke-width="2" stroke-linecap="round"/>
          <line x1="9" y1="9" x2="9.01" y2="9" stroke-width="2" stroke-linecap="round"/>
          <line x1="15" y1="9" x2="15.01" y2="9" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Emoji Picker Popup -->
      <div v-if="showEmojiPicker" class="emoji-picker" @click.stop>
        <div class="emoji-picker-header">
          <span class="emoji-picker-title">Emojis</span>
          <button @click="showEmojiPicker = false" class="emoji-picker-close">×</button>
        </div>
        <div class="emoji-grid">
          <button
            v-for="emoji in emojis"
            :key="emoji"
            @click="insertEmoji(emoji)"
            class="emoji-item"
          >
            {{ emoji }}
          </button>
        </div>
      </div>

      <input
        :value="newMessage"
        @input="$emit('update:newMessage', ($event.target as HTMLInputElement).value); $emit('typing')"
        @keydown.enter.prevent="$emit('send')"
        :placeholder="placeholder"
        class="chat-input-field"
      />
      <button @click="$emit('send')" class="chat-send-btn">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, defineExpose, onMounted, onUnmounted, watch } from 'vue';
import MessageBubble from './MessageBubble.vue';
import type { Message } from '../services/message.service';

const props = defineProps<{
  messages: Message[];
  currentUserId: string;
  newMessage: string;
  isOtherUserTyping?: boolean;
  placeholder?: string;
  showSeenStatus?: boolean;
}>();

const emit = defineEmits<{
  (e: 'send'): void;
  (e: 'update:newMessage', value: string): void;
  (e: 'scroll', isAtBottom: boolean): void;
  (e: 'typing'): void;
  (e: 'edit-message', messageId: string, newContent: string): void;
  (e: 'delete-message', message: Message): void;
  (e: 'mark-as-read'): void;
}>();

const showMessageInfo = ref<string | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);
const showEmojiPicker = ref(false);
const isAtBottom = ref(true);
const unreadNewMessages = ref(0);
const previousMessageCount = ref(0);

// Common emojis
const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
  '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
  '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜',
  '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
  '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬',
  '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒',
  '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '😎', '🤓',
  '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳',
  '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭',
  '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
  '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
  '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘',
  '🎉', '🎊', '🎁', '🎈', '🎂', '🎄', '🎆', '🎇',
  '✨', '🎯', '🎮', '🎵', '🎶', '🎤', '🎧', '🎸',
];

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const insertEmoji = (emoji: string) => {
  const newValue = props.newMessage + emoji;
  emit('update:newMessage', newValue);
  showEmojiPicker.value = false;
};

const toggleMessageInfo = (messageId: string) => {
  showMessageInfo.value = showMessageInfo.value === messageId ? null : messageId;
};

const handleScroll = () => {
  const container = messagesContainer.value;
  if (!container) return;

  const threshold = 50;
  const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  isAtBottom.value = atBottom;

  // Clear unread count when scrolling to bottom
  if (atBottom) {
    unreadNewMessages.value = 0;
  }

  emit('scroll', atBottom);
};

const handleEditSave = (messageId: string, newContent: string) => {
  emit('edit-message', messageId, newContent);
};

const handleDeleteMessage = (message: Message) => {
  emit('delete-message', message);
};

const scrollToBottomAndClear = () => {
  scrollToBottom();
  unreadNewMessages.value = 0;
  // Emit event to mark messages as read
  emit('mark-as-read');
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Watch for new messages
watch(() => props.messages.length, (newCount, oldCount) => {
  if (oldCount > 0 && newCount > oldCount) {
    // New message(s) arrived
    // Check if the new messages are for me (I'm the recipient) or from me (I'm the sender)
    const newMessages = props.messages.slice(oldCount);
    const receivedMessagesCount = newMessages.filter(msg => msg.recipient.id === props.currentUserId).length;
    const sentMessagesCount = newMessages.filter(msg => msg.sender.id === props.currentUserId).length;

    if (sentMessagesCount > 0) {
      // I sent message(s), always scroll to bottom
      setTimeout(() => scrollToBottom(), 100);
    } else if (receivedMessagesCount > 0) {
      // I received message(s)
      if (!isAtBottom.value) {
        // User is scrolled up, increment unread count for received messages only
        unreadNewMessages.value += receivedMessagesCount;
      } else {
        // User is at bottom, auto-scroll
        setTimeout(() => scrollToBottom(), 100);
      }
    }
  } else if (newCount < oldCount) {
    // Messages were deleted, don't change unread count
  } else if (newCount === 1 && oldCount === 0) {
    // First message in conversation, scroll to bottom
    setTimeout(() => scrollToBottom(), 100);
  }
  previousMessageCount.value = newCount;
});

// Close emoji picker when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.emoji-picker') && !target.closest('.emoji-button')) {
    showEmojiPicker.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  previousMessageCount.value = props.messages.length;
  // Scroll to bottom on initial load
  setTimeout(() => scrollToBottom(), 100);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Expose scrollToBottom method for parent
defineExpose({
  scrollToBottom,
});
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.new-messages-notification {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  z-index: 10;
  transition: all 0.3s ease;
  animation: slideUp 0.3s ease;
}

.new-messages-notification:hover {
  background: #1d4ed8;
  transform: translateX(-50%) scale(1.05);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.5);
}

.arrow-icon {
  width: 18px;
  height: 18px;
  animation: bounce 1s infinite;
}

@keyframes slideUp {
  from {
    opacity: 0;
    bottom: 60px;
  }
  to {
    opacity: 1;
    bottom: 80px;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}

.typing-indicator {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 18px;
  width: fit-content;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

.chat-input {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.emoji-button {
  background: transparent;
  border: none;
  color: #6b7280;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.emoji-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.emoji-picker {
  position: absolute;
  bottom: 100%;
  left: 16px;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 320px;
  max-height: 360px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.emoji-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.emoji-picker-title {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.emoji-picker-close {
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.emoji-picker-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  padding: 12px;
  overflow-y: auto;
  max-height: 280px;
}

.emoji-item {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-item:hover {
  background: #f3f4f6;
  transform: scale(1.1);
}

.chat-input-field {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
}

.chat-input-field:focus {
  border-color: #2563eb;
}

.chat-send-btn {
  background: #2563eb;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  flex-shrink: 0;
}

.chat-send-btn:hover {
  background: #1d4ed8;
}

.icon {
  width: 18px;
  height: 18px;
}
</style>
