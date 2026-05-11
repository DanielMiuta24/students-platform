<template>
  <div
    :class="['relative message-wrapper', isSent ? 'flex flex-col items-end' : 'flex flex-col items-start']"
    @contextmenu.prevent="handleRightClick"
  >
    <div class="message-container-with-menu" :class="isSent ? 'flex-row-reverse' : ''">
      <!-- Three-dot menu button (only for sent messages that aren't deleted) -->
      <button
        v-if="isSent && !message.isDeletedForEveryone && !isEditing"
        @click="toggleMessageMenu"
        class="message-menu-button"
        title="Message options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="2"/>
          <circle cx="12" cy="12" r="2"/>
          <circle cx="12" cy="19" r="2"/>
        </svg>
      </button>

      <!-- Dropdown menu -->
      <div v-if="isSent && showMenu && !message.isDeletedForEveryone" class="message-dropdown-menu">
        <button v-if="canEdit" @click="startEdit" class="dropdown-menu-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Edit</span>
        </button>
        <button @click="handleDelete" class="dropdown-menu-item delete-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete</span>
        </button>
      </div>

      <div
        :class="[
          'inline-block px-4 py-2.5 rounded-2xl text-sm leading-normal overflow-wrap-break',
          isSent
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm',
          message.isDeletedForEveryone && 'italic opacity-75'
        ]"
        style="word-break: break-word; overflow-wrap: break-word; max-width: 100%;"
      >
        <!-- Inline edit mode -->
        <div v-if="isEditing" class="edit-mode">
          <textarea
            ref="editInput"
            v-model="editContent"
            @keydown.enter.exact.prevent="saveEdit"
            @keydown.esc="cancelEdit"
            @input="autoResize"
            class="edit-input"
            :class="isSent ? 'edit-input-sent' : 'edit-input-received'"
          />
          <div class="edit-actions">
            <button @click="cancelEdit" class="edit-btn cancel-btn">Cancel</button>
            <button @click="saveEdit" class="edit-btn save-btn">Save</button>
          </div>
        </div>

        <!-- Normal display mode -->
        <div v-else class="whitespace-pre-wrap" style="word-break: normal; overflow-wrap: break-word;">{{ displayContent }}</div>
        <div
          :class="[
            'flex items-center gap-2 mt-1',
            isSent ? 'text-blue-100 justify-end' : 'text-gray-400'
          ]"
        >
          <!-- Info icon (clickable) - Shows for sent messages, edited received messages, or deleted messages -->
          <svg
            v-if="isSent || message.isEdited || message.isDeletedForEveryone"
            @click="$emit('toggle-info', message.id)"
            class="status-icon-info cursor-pointer"
            :class="[
              isSent && message.isRead && !message.isDeletedForEveryone ? 'seen' : 'delivered',
              !isSent && (message.isEdited || message.isDeletedForEveryone) ? 'received-info' : ''
            ]"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="7" :stroke="isSent && message.isRead && !message.isDeletedForEveryone ? '#4ade80' : 'currentColor'" stroke-width="1.5" fill="none"/>
            <path d="M8 7v4M8 5h.01" :stroke="isSent && message.isRead && !message.isDeletedForEveryone ? '#4ade80' : 'currentColor'" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="text-[10px]">{{ formatTime(new Date(message.createdAt)) }}</span>
          <!-- Edited indicator -->
          <span v-if="message.isEdited && !message.isDeletedForEveryone" class="text-[10px] opacity-75">(edited)</span>
          <!-- Deleted indicator -->
          <span v-if="message.isDeletedForEveryone" class="text-[10px] opacity-75">(deleted)</span>
          <!-- Two checkmarks - RIGHT of time (green only when seen) -->
          <svg
            v-if="isSent && !message.isDeletedForEveryone"
            class="status-icon-checkmarks"
            :class="message.isRead ? 'text-green-400' : 'text-current'"
            viewBox="0 0 20 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 8l2 2 4-4" :stroke="message.isRead ? '#4ade80' : 'currentColor'" :stroke-width="message.isRead ? '1.8' : '1.5'" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 8l2 2 4-4" :stroke="message.isRead ? '#4ade80' : 'currentColor'" :stroke-width="message.isRead ? '1.8' : '1.5'" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
    <!-- Message info popup -->
    <div
      v-if="showInfo"
      class="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl p-3 min-w-[200px] z-[1002] text-xs"
    >
      <!-- Show delivery and read info only for sent messages that aren't deleted -->
      <div v-if="isSent && !message.isDeletedForEveryone" class="flex justify-between gap-3 py-1">
        <span class="font-semibold text-gray-600">Delivered:</span>
        <span class="text-gray-900 text-right">{{ formatFullDateTime(new Date(message.createdAt)) }}</span>
      </div>
      <div v-if="isSent && !message.isDeletedForEveryone" class="flex justify-between gap-3 py-1 border-t border-gray-100 mt-1 pt-1">
        <span class="font-semibold text-gray-600">Seen:</span>
        <span class="text-gray-900 text-right">{{ message.isRead && message.readAt ? formatFullDateTime(new Date(message.readAt)) : '-' }}</span>
      </div>
      <!-- Show edited timestamp if message was edited and not deleted -->
      <div v-if="message.isEdited && message.editedAt && !message.isDeletedForEveryone" :class="['flex justify-between gap-3 py-1', isSent ? 'border-t border-gray-100 mt-1 pt-1' : '']">
        <span class="font-semibold text-gray-600">Edited:</span>
        <span class="text-gray-900 text-right">{{ formatFullDateTime(new Date(message.editedAt)) }}</span>
      </div>
      <!-- Show deleted timestamp if message was deleted for everyone -->
      <div v-if="message.isDeletedForEveryone && message.deletedAt" class="flex justify-between gap-3 py-1">
        <span class="font-semibold text-gray-600">Deleted:</span>
        <span class="text-gray-900 text-right">{{ formatFullDateTime(new Date(message.deletedAt)) }}</span>
      </div>
    </div>
    <!-- Seen status below message -->
    <div
      v-if="showSeenStatus && isSent && message.isRead && message.readAt && !message.isDeletedForEveryone"
      class="text-[11px] text-gray-500 mt-1 px-2"
    >
      Seen {{ formatTime(new Date(message.readAt)) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, ref, nextTick, onMounted, onUnmounted } from 'vue';
import type { Message } from '../services/message.service';
import { messageService } from '../services/message.service';

const props = defineProps<{
  message: Message;
  currentUserId: string;
  showInfo: boolean;
  showSeenStatus?: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle-info', messageId: string): void;
  (e: 'context-menu', event: MouseEvent, message: Message): void;
  (e: 'edit-message', message: Message): void;
  (e: 'delete-message-menu', message: Message): void;
  (e: 'edit-save', messageId: string, newContent: string): void;
}>();

const showMenu = ref(false);
const isEditing = ref(false);
const editContent = ref('');
const editInput = ref<HTMLTextAreaElement | null>(null);

const isSent = computed(() => props.message.sender?.id === props.currentUserId);

const canEdit = computed(() => {
  if (!isSent.value || props.message.isDeletedForEveryone) return false;
  return messageService.canEdit(props.message);
});

const displayContent = computed(() => {
  if (props.message.isDeletedForEveryone) {
    return 'This message was deleted';
  }
  return props.message.content;
});

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

const handleRightClick = (event: MouseEvent) => {
  // Only show context menu for sent messages that aren't already deleted for everyone
  if (isSent.value && !props.message.isDeletedForEveryone) {
    emit('context-menu', event, props.message);
  }
};

const toggleMessageMenu = () => {
  showMenu.value = !showMenu.value;
  console.log('[MessageBubble] Menu toggled:', showMenu.value);
};

const startEdit = () => {
  console.log('[MessageBubble] Starting edit for message:', props.message.id);
  showMenu.value = false;
  isEditing.value = true;
  editContent.value = props.message.content;
  nextTick(() => {
    if (editInput.value) {
      editInput.value.focus();
      autoResize();
    }
  });
};

const autoResize = () => {
  if (editInput.value) {
    editInput.value.style.height = 'auto';
    editInput.value.style.height = editInput.value.scrollHeight + 'px';
  }
};

const cancelEdit = () => {
  console.log('[MessageBubble] Cancelling edit');
  isEditing.value = false;
  editContent.value = '';
};

const saveEdit = () => {
  console.log('[MessageBubble] Saving edit:', editContent.value);
  const trimmedContent = editContent.value.trim();
  if (trimmedContent && trimmedContent !== props.message.content) {
    emit('edit-save', props.message.id, trimmedContent);
  }
  isEditing.value = false;
  editContent.value = '';
};

const handleDelete = () => {
  console.log('[MessageBubble] Delete clicked');
  showMenu.value = false;
  emit('delete-message-menu', props.message);
};

// Close menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.message-dropdown-menu') && !target.closest('.message-menu-button')) {
    if (showMenu.value) {
      showMenu.value = false;
    }
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.message-wrapper {
  width: 100%;
}

.message-container-with-menu {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 90%;
}

.message-menu-button {
  opacity: 0.6;
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

.message-container-with-menu:hover .message-menu-button {
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
  /* Prevent menu from going off-screen in narrow containers */
  transform: translateX(0);
  max-width: calc(100vw - 20px);
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

.status-icon-info {
  width: 16px;
  height: 16px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.status-icon-info:hover {
  transform: scale(1.2);
}

.status-icon-info.seen {
  color: #4ade80;
}

.status-icon-info.delivered {
  color: rgba(255, 255, 255, 0.7);
}

.status-icon-info.received-info {
  color: #6b7280;
  opacity: 0.9;
}

.status-icon-info.received-info:hover {
  color: #374151;
  opacity: 1;
}

.status-icon-checkmarks {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.edit-mode {
  width: 100%;
}

.edit-input {
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  margin-bottom: 10px;
  resize: none;
  min-height: 50px;
  max-height: 300px;
  overflow-y: auto;
  font-family: inherit;
  line-height: 1.5;
}

.edit-input-sent {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.edit-input-sent::placeholder {
  color: rgba(255, 255, 255, 0.7);
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
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: rgba(0, 0, 0, 0.1);
  color: inherit;
}

.cancel-btn:hover {
  background: rgba(0, 0, 0, 0.15);
}

.save-btn {
  background: rgba(255, 255, 255, 0.3);
  color: inherit;
}

.save-btn:hover {
  background: rgba(255, 255, 255, 0.4);
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
</style>
