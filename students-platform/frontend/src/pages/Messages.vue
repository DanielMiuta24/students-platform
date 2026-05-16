<template>
  <div class="messages-page">
    <!-- Mobile Close Button -->
    <button v-if="isMobile" @click="closeMessages" class="mobile-close-button">
      <el-icon><Close /></el-icon>
    </button>

    <div class="messages-container">
      <div class="messages-content">

        <!-- Sidebar using ConversationList component -->
        <aside :class="['conversation-sidebar', { 'mobile-hidden': selectedConversation && isMobile }]">
          <ConversationList
            :conversations="filteredConversations"
            :selected-conversation-id="selectedConversation?.userId"
            :empty-message="'No conversations yet'"
            :show-header="true"
            :title="'Messages'"
            :show-new-button="true"
            :show-search="true"
            :search-query="searchQuery"
            @update:search-query="searchQuery = $event"
            :search-placeholder="'Search conversations...'"
            :show-filter="true"
            :filter="conversationFilter"
            @update:filter="conversationFilter = $event"
            @select="selectConversation"
            @new-conversation="showNewConversationDialog = true"
          />
        </aside>

        <!-- Chat Window -->
        <main :class="['chat-main', { 'mobile-hidden': !selectedConversation && isMobile }]">
          <template v-if="selectedConversation">
            <!-- Mobile Back Button -->
            <div v-if="isMobile" class="mobile-back-header">
              <button @click="goBackToList" class="back-button">
                <el-icon><ArrowLeft /></el-icon>
                <span>Back</span>
              </button>
            </div>

            <!-- Header -->
            <ChatHeader
              :user="selectedConversation.user"
              :show-actions="true"
              :show-minimize="false"
              :show-close="false"
              :show-messenger-button="false"
              :show-delete="true"
              @delete="handleDeleteConversation"
            />

            <!-- Chat Window Component -->
            <div class="chat-window-wrapper">
              <ChatWindow
                ref="chatWindowRef"
                :messages="messages"
                :current-user-id="currentUserId"
                :new-message="newMessage"
                :is-other-user-typing="isOtherUserTyping"
                :placeholder="'Type a message...'"
                :show-seen-status="true"
                @update:new-message="newMessage = $event"
                @send="sendMessage"
                @scroll="isScrolledToBottom = $event"
                @typing="handleTyping"
                @edit-message="handleEditMessage"
                @delete-message="handleDeleteMessageMenu"
                @mark-as-read="markConversationAsRead"
              />
            </div>
          </template>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <div class="empty-state-content">
              <div class="empty-icon">💬</div>
              <h2 class="empty-title">
                Select a conversation
              </h2>
              <p class="empty-description">
                Choose a student from the left to start chatting.
              </p>
            </div>
          </div>
        </main>

      </div>
    </div>

  <!-- New Conversation Dialog -->
    <NewConversationDialog
      v-model="showNewConversationDialog"
      :available-users="availableUsers"
      :existing-conversation-user-ids="conversations.map(c => c.userId)"
      @select="startConversationWithUser"
    />

    <!-- Delete Message Dialog -->
    <div
      v-if="showDeleteDialog"
      class="fixed inset-0 flex items-center justify-center z-[9999]"
      @click.self="closeDeleteDialog"
      style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(2px);"
    >
      <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Delete Message</h3>
        <p class="text-gray-600 mb-6">Choose how you want to delete this message:</p>

        <div class="space-y-3">
          <button
            @click="deleteMessage('me')"
            class="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition font-medium"
          >
            Delete for Me
          </button>
          <button
            v-if="canDeleteForEveryone"
            @click="deleteMessage('everyone')"
            class="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
          >
            Delete for Everyone
          </button>
          <button
            @click="closeDeleteDialog"
            class="w-full px-4 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Conversation Dialog -->
    <div
      v-if="showDeleteConversationDialog"
      class="fixed inset-0 flex items-center justify-center z-[9999]"
      @click.self="closeDeleteConversationDialog"
      style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(2px);"
    >
      <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Delete Conversation</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this conversation? This will remove all messages from your view.
        </p>

        <div class="space-y-3">
          <button
            @click="confirmDeleteConversation"
            class="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
          >
            Delete Conversation
          </button>
          <button
            @click="closeDeleteConversationDialog"
            class="w-full px-4 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '../store/session';
import { messageService, type Message, type Conversation } from '../services/message.service';
import { socketService } from '../services/socket';
import { getAvatarUrl } from '../utils/avatar';
import { api } from '../services/api';
import { ArrowLeft, Close } from '@element-plus/icons-vue';
import ChatWindow from '../components/ChatWindow.vue';
import ChatHeader from '../components/ChatHeader.vue';
import ConversationList from '../components/ConversationList.vue';
import NewConversationDialog from '../components/NewConversationDialog.vue';

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

const conversations = ref<Conversation[]>([]);
const selectedConversation = ref<Conversation | null>(null);
const messages = ref<Message[]>([]);
const newMessage = ref('');
const isOtherUserTyping = ref(false);
const chatWindowRef = ref<InstanceType<typeof ChatWindow> | null>(null);
const showDeleteDialog = ref(false);
const messageToDelete = ref<Message | null>(null);
const showDeleteConversationDialog = ref(false);
const searchQuery = ref('');
const conversationFilter = ref('all');
const showNewConversationDialog = ref(false);
const availableUsers = ref<any[]>([]);
const isScrolledToBottom = ref(true);
const isMobile = ref(false);

const currentUserId = computed(() => sessionStore.user?.id || '');
const canDeleteForEveryone = computed(() =>
  messageToDelete.value ? messageService.canDeleteForEveryone(messageToDelete.value) : false
);

const filteredConversations = computed(() => {
  let filtered = conversations.value;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(c =>
      c.user.name.toLowerCase().includes(query) ||
      c.user.username.toLowerCase().includes(query)
    );
  }

  // Filter by unread status
  if (conversationFilter.value === 'unread') {
    filtered = filtered.filter(c => c.unreadCount > 0);
  }

  return filtered;
});

let typingTimeout: number | null = null;

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const goBackToList = () => {
  selectedConversation.value = null;
  messages.value = [];
  router.push('/messages');
};

const closeMessages = () => {
  router.push('/');
};

const loadConversations = async () => {
  try {
    conversations.value = await messageService.getConversations();

    // If route has a user ID, select that conversation
    const routeUserId = route.params.id as string;
    if (routeUserId) {
      const conversation = conversations.value.find(c => c.userId === routeUserId);
      if (conversation) {
        await selectConversation(conversation);
      }
    } else if (conversations.value.length > 0) {
      await selectConversation(conversations.value[0]);
    }
  } catch (error) {
    console.error('Failed to load conversations:', error);
  }
};

const loadAvailableUsers = async () => {
  try {
    // Use empty search to get all users
    const users = await messageService.searchUsers('');
    availableUsers.value = users;
  } catch (error) {
    console.error('Failed to load users:', error);
  }
};

const selectConversation = async (conversation: Conversation) => {
  selectedConversation.value = conversation;
  router.push(`/messages/${conversation.userId}`);

  try {
    const result = await messageService.getConversation(conversation.userId);
    messages.value = result.messages;
    await messageService.markConversationAsRead(conversation.userId);

    // Update conversation unread count
    const conv = conversations.value.find(c => c.userId === conversation.userId);
    if (conv) {
      conv.unreadCount = 0;
    }

    nextTick(() => {
      scrollToBottom();
    });
  } catch (error) {
    console.error('Failed to load messages:', error);
  }
};

const startConversationWithUser = async (user: any) => {
  // Check if conversation already exists
  let conversation = conversations.value.find(c => c.userId === user.id);

  if (!conversation) {
    // Create new conversation
    conversation = {
      userId: user.id,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      },
      latestMessage: null,
      unreadCount: 0,
      lastActivity: new Date().toISOString()
    };
    conversations.value.unshift(conversation);
  }

  selectConversation(conversation);
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return;

  const content = newMessage.value.trim();
  newMessage.value = '';

  try {
    const message = await messageService.sendMessage({
      recipientId: selectedConversation.value.userId,
      content,
    });

    const conv = conversations.value.find(c => c.userId === selectedConversation.value?.userId);
    if (conv) {
      conv.latestMessage = message;
    }

    nextTick(() => {
      scrollToBottom();
    });
  } catch (error) {
    console.error('Failed to send message:', error);
    newMessage.value = content;
  }
};

const handleEditMessage = async (messageId: string, newContent: string) => {
  try {
    const updatedMessage = await messageService.updateMessage(messageId, newContent);
    const index = messages.value.findIndex(m => m.id === messageId);
    if (index !== -1) {
      messages.value.splice(index, 1, updatedMessage);
    }
  } catch (error) {
    console.error('Failed to edit message:', error);
    if (error instanceof Error || (typeof error === 'object' && error !== null && 'response' in error)) {
      const axiosError = error as any;
      const errorMessage = axiosError.response?.data?.error || 'Failed to edit message';
      alert(errorMessage);
    }
  }
};

const handleDeleteMessageMenu = (message: Message) => {
  messageToDelete.value = message;
  showDeleteDialog.value = true;
};

const deleteMessage = async (deleteFor: 'me' | 'everyone') => {
  if (!messageToDelete.value) return;

  try {
    await messageService.deleteMessage(messageToDelete.value.id, deleteFor);

    if (deleteFor === 'me') {
      const index = messages.value.findIndex(m => m.id === messageToDelete.value?.id);
      if (index !== -1) {
        messages.value.splice(index, 1);
      }
    }

    closeDeleteDialog();
  } catch (error) {
    console.error('Failed to delete message:', error);
  }
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  messageToDelete.value = null;
};

const handleDeleteConversation = () => {
  if (!selectedConversation.value) return;
  showDeleteConversationDialog.value = true;
};

const confirmDeleteConversation = async () => {
  if (!selectedConversation.value) return;

  try {
    await messageService.deleteConversation(selectedConversation.value.userId);

    const index = conversations.value.findIndex(c => c.userId === selectedConversation.value?.userId);
    if (index !== -1) {
      conversations.value.splice(index, 1);
    }

    selectedConversation.value = null;
    messages.value = [];

    closeDeleteConversationDialog();

    router.push('/messages');
  } catch (error) {
    console.error('Failed to delete conversation:', error);
  }
};

const closeDeleteConversationDialog = () => {
  showDeleteConversationDialog.value = false;
};

const handleTyping = () => {
  if (!selectedConversation.value) return;

  const socket = socketService.getSocket();
  if (!socket) return;

  socket.emit('typing', { recipientId: selectedConversation.value.userId, isTyping: true });

  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }

  typingTimeout = window.setTimeout(() => {
    socket.emit('typing', { recipientId: selectedConversation.value?.userId, isTyping: false });
  }, 1000);
};

const scrollToBottom = () => {
  chatWindowRef.value?.scrollToBottom();
};

const markConversationAsRead = async () => {
  if (!selectedConversation.value) return;

  try {
    await messageService.markConversationAsRead(selectedConversation.value.userId);

    const conv = conversations.value.find(c => c.userId === selectedConversation.value?.userId);
    if (conv) {
      conv.unreadCount = 0;
    }

    messages.value = messages.value.map(msg => {
      if (msg.recipient.id === currentUserId.value && !msg.isRead) {
        return {
          ...msg,
          isRead: true,
          readAt: new Date().toISOString()
        };
      }
      return msg;
    });
  } catch (error) {
    console.error('Failed to mark conversation as read:', error);
  }
};

// WebSocket event handlers
const handleNewMessage = async (payload: any) => {
  const message = payload.data || payload;

  if (!message || !message.sender || !message.recipient) {
    return;
  }

  if (selectedConversation.value) {
    const isSentByMe = message.sender.id === currentUserId.value;
    const isForMe = message.recipient.id === currentUserId.value;
    const isSentToSelectedUser = message.recipient.id === selectedConversation.value.userId;
    const isFromSelectedUser = message.sender.id === selectedConversation.value.userId;

    if ((isSentByMe && isSentToSelectedUser) || (isForMe && isFromSelectedUser)) {
      const messageExists = messages.value.some(m => m.id === message.id);
      if (!messageExists) {
        messages.value.push(message);

        if (isSentByMe || isScrolledToBottom.value) {
          nextTick(() => {
            scrollToBottom();
          });
        }
      }

      if (isForMe && isScrolledToBottom.value) {
        await messageService.markConversationAsRead(selectedConversation.value.userId);
      }
    }
  }

  const conv = conversations.value.find(c =>
    c.userId === message.sender?.id || c.userId === message.recipient?.id
  );
  if (conv) {
    conv.latestMessage = message;
  }
};

const handleMessageUpdated = (payload: any) => {
  const updatedMessage = payload.data || payload;
  const index = messages.value.findIndex(m => m.id === updatedMessage.id);
  if (index !== -1) {
    messages.value.splice(index, 1, updatedMessage);
  }
};

const handleMessageDeleted = (payload: any) => {
  const data = payload.data || payload;

  if (data.deletedForEveryone) {
    const index = messages.value.findIndex(m => m.id === data.messageId);
    if (index !== -1) {
      messages.value[index].isDeletedForEveryone = true;
      messages.value[index].content = 'This message was deleted';
    }
  } else {
    // Message was deleted for the other user only
    const index = messages.value.findIndex(m => m.id === data.messageId);
    if (index !== -1) {
      messages.value.splice(index, 1);
    }
  }
};

const handleTypingStatus = (payload: any) => {
  const data = payload.data || payload;
  if (selectedConversation.value && data.userId === selectedConversation.value.userId) {
    isOtherUserTyping.value = data.isTyping;
  }
};

const handleMessageRead = (payload: any) => {
  const data = payload.data || payload;

  if (data.messageId) {
    messages.value = messages.value.map(msg => {
      if (msg.id === data.messageId) {
        return {
          ...msg,
          isRead: true,
          readAt: data.readAt || new Date().toISOString()
        };
      }
      return msg;
    });
  }
  else if (data.otherUserId && data.userId) {
    const iAmTheSender = data.otherUserId === currentUserId.value;

    if (iAmTheSender) {
      messages.value = messages.value.map(msg => {
        if (msg.sender.id === currentUserId.value && !msg.isRead) {
          return {
            ...msg,
            isRead: true,
            readAt: new Date().toISOString()
          };
        }
        return msg;
      });
    }
  }
};

onMounted(async () => {
  checkMobile();
  window.addEventListener('resize', checkMobile);

  await Promise.all([
    loadConversations(),
    loadAvailableUsers()
  ]);

  let socket = socketService.getSocket();

  if (!socket) {
    socket = socketService.connect();

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Socket connection timeout'));
      }, 5000);

      if (socket!.connected) {
        clearTimeout(timeout);
        resolve();
      } else {
        socket!.once('connect', () => {
          clearTimeout(timeout);
          resolve();
        });
        socket!.once('connect_error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      }
    });
  }

  if (currentUserId.value && socket) {
    const result = await socketService.joinRoom('user', currentUserId.value);
    if (!result.success) {
      console.error('Failed to join user room:', result.error);
    }
  }

  if (socket) {
    socket.on('message:new', handleNewMessage);
    socket.on('message:updated', handleMessageUpdated);
    socket.on('message:deleted', handleMessageDeleted);
    socket.on('typing', handleTypingStatus);
    socket.on('message:read', handleMessageRead);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);

  const socket = socketService.getSocket();
  if (!socket) return;

  // Clean up WebSocket listeners
  socket.off('message:new', handleNewMessage);
  socket.off('message:updated', handleMessageUpdated);
  socket.off('message:deleted', handleMessageDeleted);
  socket.off('typing', handleTypingStatus);
  socket.off('message:read', handleMessageRead);

  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
});
</script>

<style scoped>
.messages-page {
  width: 100%;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  display: flex;
  height: calc(100vh - 4rem - 250px);
  min-height: 500px;
  position: relative;
}

.mobile-close-button {
  display: none;
}

.messages-container {
  width: 100%;
  height: 100%;
  display: flex;
}

.messages-content {
  background: white;
  width: 100%;
  height: 100%;
  display: flex;
}

.conversation-sidebar {
  width: 33.333%;
  border-right: 1px solid #dbeafe;
  background: white;
  display: flex;
  flex-direction: column;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.mobile-back-header {
  display: none;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  color: #2563eb;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.back-button:hover {
  background: #eff6ff;
}

.chat-window-wrapper {
  flex: 1;
  min-height: 0;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 246, 255, 0.4);
}

.empty-state-content {
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 8px;
}

.empty-description {
  color: #6b7280;
  font-size: 16px;
}

/* Mobile Responsive - Fullscreen Overlay */
@media (max-width: 768px) {
  .messages-page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    height: 100dvh;
    min-height: 100vh;
    min-height: 100dvh;
    z-index: 9999;
    background: white;
    padding-top: 0;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .mobile-close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: max(10px, env(safe-area-inset-top, 0px) + 10px);
    right: 16px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border: none;
    color: white;
    cursor: pointer;
    z-index: 10000;
    transition: all 0.2s ease;
    font-size: 20px;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }

  .mobile-close-button:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.5);
  }

  .mobile-close-button:active {
    transform: scale(0.95);
  }

  .messages-container {
    height: 100%;
    height: 100dvh;
  }

  .messages-content {
    height: 100%;
    height: 100dvh;
  }

  .conversation-sidebar {
    width: 100%;
    border-right: none;
    height: 100%;
    height: 100dvh;
  }

  .chat-main {
    width: 100%;
    height: 100%;
    height: 100dvh;
  }

  .mobile-hidden {
    display: none !important;
  }

  .mobile-back-header {
    display: block;
  }

  .empty-icon {
    font-size: 40px;
  }

  .empty-title {
    font-size: 20px;
  }

  .empty-description {
    font-size: 14px;
    padding: 0 20px;
  }
}

@media (max-width: 480px) {
  .empty-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .empty-title {
    font-size: 18px;
  }

  .empty-description {
    font-size: 13px;
  }
}
</style>
