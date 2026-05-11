<template>
  <div :class="['chat-box', { 'chat-box-minimized': isMinimized }]">
    <!-- Header -->
    <ChatHeader
      :user="conversation.user"
      variant="chatbox"
      :show-minimize="true"
      :show-delete="true"
      :show-close="true"
      :show-messenger-button="true"
      :is-minimized="isMinimized"
      @minimize="$emit('minimize')"
      @delete="$emit('delete-conversation')"
      @close="$emit('close')"
      @open-messenger="$emit('open-in-messenger')"
    />

    <!-- Chat Window Component -->
    <div v-if="!isMinimized" class="chat-box-content">
      <ChatWindow
        ref="chatWindowRef"
        :messages="conversation.messages"
        :current-user-id="currentUserId"
        :new-message="newMessage"
        :is-other-user-typing="isOtherUserTyping"
        :placeholder="'Type a message...'"
        @update:new-message="$emit('update:newMessage', $event)"
        @send="$emit('send')"
        @scroll="$emit('scroll', $event)"
        @typing="$emit('typing')"
        @edit-message="(messageId, newContent) => $emit('edit-message', messageId, newContent)"
        @delete-message="$emit('delete-message', $event)"
        @mark-as-read="$emit('mark-as-read')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import ChatWindow from './ChatWindow.vue';
import ChatHeader from './ChatHeader.vue';
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
  (e: 'delete-message', message: Message): void;
  (e: 'mark-as-read'): void;
}>();

const chatWindowRef = ref<InstanceType<typeof ChatWindow> | null>(null);

// Expose scrollToBottom method
defineExpose({
  scrollToBottom: () => {
    chatWindowRef.value?.scrollToBottom();
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
  transition: height 0.3s ease;
}

.chat-box-minimized {
  height: auto;
}

.chat-box-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
