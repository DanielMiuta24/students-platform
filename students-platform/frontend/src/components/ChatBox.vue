<template>
  <div class="chat-box">
    <!-- Header -->
    <div class="chat-box-header">
      <div class="chat-box-user">
        <img
          :src="getAvatarUrl(conversation.user.name, conversation.user.profilePicture)"
          alt="Profile"
          class="chat-box-avatar"
        />
        <div>
          <h3 class="chat-box-name">{{ conversation.user.name }}</h3>
          <p class="chat-box-status">Online</p>
        </div>
      </div>
      <div class="chat-box-actions">
        <button @click="$emit('delete-conversation')" class="chat-box-action-btn" title="Delete conversation">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button @click="$emit('minimize')" class="chat-box-action-btn" title="Minimize">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button @click="$emit('open-in-messenger')" class="chat-box-action-btn" title="Open in Messenger">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
        <button @click="$emit('close')" class="chat-box-action-btn" title="Close">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="!isMinimized" ref="messagesContainer" class="chat-box-messages" @scroll="handleScroll">
      <MessageBubble
        v-for="message in conversation.messages"
        :key="message.id"
        :message="message"
        :current-user-id="currentUserId"
        :show-info="showMessageInfo === message.id"
        @toggle-info="toggleMessageInfo"
        @delete-message-menu="$emit('delete-message', $event)"
        @edit-save="(messageId, newContent) => $emit('edit-message', messageId, newContent)"
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

    <!-- Input -->
    <div v-if="!isMinimized" class="chat-box-input">
      <input
        :value="newMessage"
        @input="$emit('update:newMessage', ($event.target as HTMLInputElement).value); $emit('typing')"
        @keyup.enter="$emit('send')"
        placeholder="Type a message..."
        class="chat-box-input-field"
      />
      <button @click="$emit('send')" class="chat-box-send-btn">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { getAvatarUrl } from '../utils/avatar';
import MessageBubble from './MessageBubble.vue';
import type { Message } from '../services/message.service';

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    profilePicture: string;
  };
  latestMessage: string;
  messages: Message[];
}

const props = defineProps<{
  conversation: Conversation;
  currentUserId: string;
  newMessage: string;
  isMinimized?: boolean;
  newMessagesCount?: number;
  isScrolledToBottom?: boolean;
  isOtherUserTyping?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'minimize'): void;
  (e: 'open-in-messenger'): void;
  (e: 'delete-conversation'): void;
  (e: 'send'): void;
  (e: 'update:newMessage', value: string): void;
  (e: 'scroll', isAtBottom: boolean): void;
  (e: 'scrollToBottom'): void;
  (e: 'typing'): void;
  (e: 'edit-message', messageId: string, newContent: string): void;
  (e: 'delete-message', messageId: string): void;
}>();

const showMessageInfo = ref<string | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);

const toggleMessageInfo = (messageId: string) => {
  showMessageInfo.value = showMessageInfo.value === messageId ? null : messageId;
};

const handleScroll = () => {
  const container = messagesContainer.value;
  if (!container) return;

  const threshold = 50;
  const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  emit('scroll', isAtBottom);
};

// Expose scrollToBottom method for parent
defineExpose({
  scrollToBottom: () => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }
});
</script>

<style scoped>
.chat-box {
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  z-index: 1000;
}

.chat-box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #2563eb;
  color: white;
  flex-shrink: 0;
}

.chat-box-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-box-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.chat-box-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.chat-box-status {
  font-size: 12px;
  margin: 0;
  opacity: 0.9;
}

.chat-box-actions {
  display: flex;
  gap: 8px;
}

.chat-box-action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.chat-box-action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chat-box-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.chat-box-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.chat-box-input-field {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
}

.chat-box-input-field:focus {
  border-color: #2563eb;
}

.chat-box-send-btn {
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
}

.chat-box-send-btn:hover {
  background: #1d4ed8;
}

.icon {
  width: 18px;
  height: 18px;
}
</style>
