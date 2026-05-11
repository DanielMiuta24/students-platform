<template>
  <div class="chat-window" style="border: 5px solid red;">
    <div style="background: yellow; padding: 20px; font-size: 20px; font-weight: bold;">
      CHATWINDOW IS RENDERING - Messages: {{ messages.length }}
    </div>
    <!-- Messages Container -->
    <div ref="messagesContainer" class="messages-container" @scroll="handleScroll">
      <!-- New messages notification -->
      <div
        v-if="newMessagesCount > 0 && !isScrolledToBottom"
        @click="$emit('scroll-to-bottom-and-mark-read')"
        class="new-messages-notification"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="icon-small" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
        <span>{{ newMessagesCount }} new message{{ newMessagesCount > 1 ? 's' : '' }}</span>
      </div>

      <!-- Messages -->
      <div class="messages-list">
        <div v-if="messages.length === 0" class="empty-state">
          No messages yet. Start the conversation!
        </div>
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message-item', message.sender?.id === currentUserId ? 'sent' : 'received']"
        >
          <div class="message-container">
            <!-- Three-dot menu button -->
            <button
              v-if="message.sender?.id === currentUserId && !message.isDeletedForEveryone"
              @click="toggleMessageMenu(message.id)"
              class="message-menu-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="19" r="2"/>
              </svg>
            </button>

            <!-- Dropdown menu -->
            <div v-if="message.sender?.id === currentUserId && showMessageMenu === message.id && !message.isDeletedForEveryone" class="message-dropdown-menu">
              <button v-if="canEditMessage(message)" @click="startEditMessage(message)" class="dropdown-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
              </button>
              <button @click="$emit('delete-message', message.id)" class="dropdown-menu-item delete-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete</span>
              </button>
            </div>

            <div class="message-bubble">
              <!-- Inline edit mode -->
              <div v-if="editingMessageId === message.id" class="edit-mode">
                <textarea
                  v-model="editingMessageContent"
                  @keyup.enter.exact="saveEditMessage(message.id)"
                  @keyup.esc="cancelEditMessage"
                  rows="3"
                  class="edit-input"
                  :class="message.sender?.id === currentUserId ? 'edit-input-sent' : 'edit-input-received'"
                />
                <div class="edit-actions">
                  <button @click="cancelEditMessage" class="edit-btn cancel-btn">Cancel</button>
                  <button @click="saveEditMessage(message.id)" class="edit-btn save-btn">Save</button>
                </div>
              </div>

              <!-- Normal display mode -->
              <div v-else class="message-text" :class="message.isDeletedForEveryone && 'italic opacity-75'" style="background: lightgreen; padding: 10px;">
                <div style="background: yellow; border: 2px solid red; padding: 5px;">
                  DEBUG: "{{ message.content }}" (length: {{ message.content?.length || 0 }})
                </div>
                {{ message.isDeletedForEveryone ? 'This message was deleted' : message.content }}
              </div>
              <div class="message-footer">
                <!-- Info icon -->
                <svg
                  v-if="message.sender?.id === currentUserId || message.isEdited || message.isDeletedForEveryone"
                  @click="toggleMessageInfo(message.id)"
                  class="status-icon-info"
                  :class="{ 'seen': message.sender?.id === currentUserId && message.isRead && !message.isDeletedForEveryone }"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle cx="8" cy="8" r="7" :stroke="message.sender?.id === currentUserId && message.isRead && !message.isDeletedForEveryone ? '#4ade80' : 'currentColor'" stroke-width="1.5" fill="none"/>
                  <path d="M8 7v4M8 5h.01" :stroke="message.sender?.id === currentUserId && message.isRead && !message.isDeletedForEveryone ? '#4ade80' : 'currentColor'" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span class="message-timestamp">{{ formatTime(message.timestamp) }}</span>
                <span v-if="message.isEdited && !message.isDeletedForEveryone" class="message-edited">(edited)</span>
                <!-- Checkmarks -->
                <svg
                  v-if="message.sender?.id === currentUserId && !message.isDeletedForEveryone"
                  class="status-icon-checkmarks"
                  :class="message.isRead ? 'seen' : ''"
                  viewBox="0 0 20 16"
                  fill="none"
                >
                  <path d="M3 8l2 2 4-4" :stroke="message.isRead ? '#4ade80' : 'currentColor'" :stroke-width="message.isRead ? '1.8' : '1.5'" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 8l2 2 4-4" :stroke="message.isRead ? '#4ade80' : 'currentColor'" :stroke-width="message.isRead ? '1.8' : '1.5'" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Message info popup -->
          <div v-if="showMessageInfo === message.id" class="message-info-popup">
            <div v-if="message.sender?.id === currentUserId && !message.isDeletedForEveryone" class="message-info-row">
              <span class="message-info-label">Delivered:</span>
              <span class="message-info-value">{{ formatFullDateTime(message.timestamp) }}</span>
            </div>
            <div v-if="message.sender?.id === currentUserId && !message.isDeletedForEveryone" class="message-info-row">
              <span class="message-info-label">Seen:</span>
              <span class="message-info-value">{{ message.isRead && message.readAt ? formatFullDateTime(new Date(message.readAt)) : '-' }}</span>
            </div>
            <div v-if="message.isEdited && message.editedAt && !message.isDeletedForEveryone" class="message-info-row">
              <span class="message-info-label">Edited:</span>
              <span class="message-info-value">{{ formatFullDateTime(new Date(message.editedAt)) }}</span>
            </div>
            <div v-if="message.isDeletedForEveryone && message.deletedAt" class="message-info-row">
              <span class="message-info-label">Deleted:</span>
              <span class="message-info-value">{{ formatFullDateTime(new Date(message.deletedAt)) }}</span>
            </div>
          </div>

          <!-- Seen status -->
          <div v-if="message.sender?.id === currentUserId && message.isRead && message.readAt && !message.isDeletedForEveryone" class="seen-status">
            Seen {{ formatTime(new Date(message.readAt)) }}
          </div>
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="isOtherUserTyping" class="typing-indicator">
        <div class="typing-bubble">
          <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot" style="animation-delay: 150ms"></div>
            <div class="typing-dot" style="animation-delay: 300ms"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-area">
      <button @click="toggleEmojiPicker" type="button" class="emoji-button">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <!-- Emoji Picker -->
      <div v-if="showEmojiPicker" class="emoji-picker">
        <div class="emoji-grid">
          <button
            v-for="emoji in emojis"
            :key="emoji"
            @click="addEmoji(emoji)"
            type="button"
            class="emoji-item"
          >
            {{ emoji }}
          </button>
        </div>
      </div>

      <input
        :value="newMessage"
        @input="handleInput(($event.target as HTMLInputElement).value)"
        @keyup.enter="$emit('send')"
        type="text"
        placeholder="Type a message..."
        class="message-input"
      />
      <button @click="$emit('send')" type="button" class="send-button">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, defineProps, defineEmits, onMounted } from 'vue';
import type { Message } from '../services/message.service';

const props = defineProps<{
  messages: Message[];
  currentUserId: string;
  newMessage: string;
  newMessagesCount?: number;
  isScrolledToBottom?: boolean;
  isOtherUserTyping?: boolean;
}>();

onMounted(() => {
  console.log('[ChatWindow] Component mounted!');
  console.log('[ChatWindow] Messages count:', props.messages.length);
  console.log('[ChatWindow] Current user ID:', props.currentUserId);
});

const emit = defineEmits<{
  (e: 'send'): void;
  (e: 'update:newMessage', value: string): void;
  (e: 'scroll', isAtBottom: boolean): void;
  (e: 'scroll-to-bottom-and-mark-read'): void;
  (e: 'typing'): void;
  (e: 'edit-message', messageId: string, newContent: string): void;
  (e: 'delete-message', messageId: string): void;
}>();

const showEmojiPicker = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const showMessageMenu = ref<string | null>(null);
const showMessageInfo = ref<string | null>(null);
const editingMessageId = ref<string | null>(null);
const editingMessageContent = ref('');

const emojis = [
  "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂",
  "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩",
  "😘", "😗", "😚", "😙", "😋", "😛", "😜", "🤪",
  "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨",
  "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥",
  "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕",
  "🤢", "🤮", "🤧", "🥵", "🥶", "😶‍🌫️", "😵", "🤯",
  "🤠", "🥳", "😎", "🤓", "🧐", "😕", "😟", "🙁",
  "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧",
  "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣",
  "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠",
  "👍", "👎", "👏", "🙌", "🤝", "🙏", "💪", "❤️",
  "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎",
  "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘",
  "✨", "⭐", "🌟", "💫", "🔥", "💯", "✔️", "✅"
];

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const addEmoji = (emoji: string) => {
  emit('update:newMessage', props.newMessage + emoji);
  showEmojiPicker.value = false;
};

const handleInput = (value: string) => {
  emit('update:newMessage', value);
  emit('typing');
};

const handleScroll = (event: Event) => {
  const container = event.target as HTMLElement;
  if (!container) return;

  const threshold = 50;
  const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  emit('scroll', isAtBottom);
};

const toggleMessageMenu = (messageId: string) => {
  showMessageMenu.value = showMessageMenu.value === messageId ? null : messageId;
};

const toggleMessageInfo = (messageId: string) => {
  showMessageInfo.value = showMessageInfo.value === messageId ? null : messageId;
};

const canEditMessage = (message: Message): boolean => {
  if (message.isDeletedForEveryone) return false;
  const messageAge = Date.now() - new Date(message.timestamp).getTime();
  const maxAge = 15 * 60 * 1000;
  return messageAge <= maxAge;
};

const startEditMessage = (message: Message) => {
  editingMessageId.value = message.id;
  editingMessageContent.value = message.content;
  showMessageMenu.value = null;
  nextTick(() => {
    const textarea = document.querySelector('.edit-input') as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  });
};

const cancelEditMessage = () => {
  editingMessageId.value = null;
  editingMessageContent.value = '';
};

const saveEditMessage = (messageId: string) => {
  const trimmedContent = editingMessageContent.value.trim();
  const originalMessage = props.messages.find(m => m.id === messageId);
  if (trimmedContent && originalMessage && trimmedContent !== originalMessage.content) {
    emit('edit-message', messageId, trimmedContent);
  }
  editingMessageId.value = null;
  editingMessageContent.value = '';
};

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const formatFullDateTime = (date: Date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const time = formatTime(date);
  return `${month} ${day}, ${year} at ${time}`;
};

defineExpose({
  scrollToBottom: () => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }
});
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
  background: white;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f9fafb;
  position: relative;
  min-height: 200px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 40px 20px;
  font-size: 14px;
}

.new-messages-notification {
  position: sticky;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  z-index: 10;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
  transition: all 0.2s;
  width: fit-content;
  margin: 0 auto 12px auto;
}

.new-messages-notification:hover {
  background: #1d4ed8;
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.icon-small {
  width: 16px;
  height: 16px;
}

.message-item {
  display: flex;
  flex-direction: column;
  position: relative;
}

.message-item.sent {
  align-items: flex-end;
}

.message-item.received {
  align-items: flex-start;
}

.message-container {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 80%;
}

.message-item.sent .message-container {
  flex-direction: row-reverse;
}

.message-menu-button {
  opacity: 0;
  transition: opacity 0.2s;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  flex-shrink: 0;
  margin-top: 8px;
}

.message-container:hover .message-menu-button {
  opacity: 1;
}

.message-menu-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.menu-icon {
  width: 16px;
  height: 16px;
}

.message-dropdown-menu {
  position: absolute;
  top: 32px;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 160px;
  padding: 4px;
}

.dropdown-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.2s;
  text-align: left;
}

.dropdown-menu-item:hover {
  background: #f3f4f6;
}

.dropdown-menu-item.delete-item {
  color: #dc2626;
}

.dropdown-menu-item.delete-item:hover {
  background: #fee2e2;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.message-bubble {
  display: inline-block;
  padding: 12px 16px;
  border-radius: 16px;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}

.message-item.sent .message-bubble {
  background: #2563eb;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-item.received .message-bubble {
  background: white;
  color: #374151;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.message-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 11px;
}

.message-item.sent .message-footer {
  color: rgba(255, 255, 255, 0.7);
  justify-content: flex-end;
}

.message-item.received .message-footer {
  color: #9ca3af;
}

.status-icon-info {
  width: 14px;
  height: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.status-icon-info:hover {
  transform: scale(1.1);
}

.status-icon-info.seen {
  color: #4ade80;
}

.message-timestamp {
  font-size: 10px;
}

.message-edited {
  font-size: 10px;
  opacity: 0.75;
}

.status-icon-checkmarks {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.status-icon-checkmarks.seen {
  color: #4ade80;
}

.edit-mode {
  min-width: 200px;
  width: 100%;
}

.edit-input {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  margin-bottom: 8px;
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
  line-height: 1.4;
}

.edit-input-sent {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.edit-input-sent::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.edit-input-received {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.edit-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: transparent;
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.save-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #2563eb;
}

.save-btn:hover {
  background: white;
}

.message-info-popup {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px;
  min-width: 200px;
  z-index: 50;
  font-size: 12px;
}

.message-info-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
}

.message-info-row:not(:last-child) {
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 4px;
  padding-bottom: 8px;
}

.message-info-label {
  font-weight: 600;
  color: #6b7280;
}

.message-info-value {
  color: #111827;
  text-align: right;
}

.seen-status {
  font-size: 11px;
  color: #6b7280;
  margin-top: 4px;
  padding: 0 8px;
}

.typing-indicator {
  display: flex;
  align-items: flex-start;
  margin-top: 12px;
}

.typing-bubble {
  background: white;
  padding: 12px 16px;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.typing-dots {
  display: flex;
  align-items: center;
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
    transform: translateY(-10px);
    opacity: 1;
  }
}

.input-area {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
  position: relative;
}

.emoji-button {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.emoji-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.icon {
  width: 20px;
  height: 20px;
}

.emoji-picker {
  position: absolute;
  bottom: 100%;
  left: 16px;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 12px;
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
}

.emoji-item {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-item:hover {
  background: #f3f4f6;
}

.message-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #2563eb;
}

.send-button {
  background: #2563eb;
  border: none;
  color: white;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.send-button:hover {
  background: #1d4ed8;
}
</style>
