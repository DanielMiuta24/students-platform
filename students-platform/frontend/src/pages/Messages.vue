<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden h-[720px] flex">

        <!-- Sidebar using ConversationList component -->
        <aside class="w-1/3 border-r border-blue-100 bg-white flex flex-col">
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
        <main class="flex-1 flex flex-col">
          <template v-if="selectedConversation">
            <!-- Header -->
            <div class="bg-white border-b border-blue-100 p-5 flex items-center">
              <img
                :src="getAvatarUrl(selectedConversation.user.name, selectedConversation.user.profilePicture)"
                alt="Profile Picture"
                class="w-11 h-11 rounded-full mr-4 object-cover"
              />

              <div>
                <h2 class="text-lg font-bold text-blue-900">
                  {{ selectedConversation.user.name }}
                </h2>
                <p class="text-sm text-green-600">Online</p>
              </div>
            </div>

            <!-- Messages -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 bg-blue-50/40 space-y-4">
              <MessageBubble
                v-for="message in messages"
                :key="message.id"
                :message="message"
                :current-user-id="currentUserId"
                :show-info="showMessageInfo === message.id"
                @toggle-info="toggleMessageInfo"
                @edit-save="handleEditMessage"
                @delete-message-menu="handleDeleteMessageMenu"
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
            <div class="bg-white border-t border-blue-100 p-4 flex items-center gap-3">
              <input
                v-model="newMessage"
                @input="handleTyping"
                @keyup.enter="sendMessage"
                placeholder="Type a message..."
                class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                @click="sendMessage"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition"
              >
                Send
              </button>
            </div>
          </template>

          <!-- Empty State -->
          <div v-else class="flex-1 flex items-center justify-center bg-blue-50/40">
            <div class="text-center">
              <div class="text-5xl mb-4">💬</div>
              <h2 class="text-2xl font-bold text-blue-900 mb-2">
                Select a conversation
              </h2>
              <p class="text-gray-500">
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
      class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      @click.self="closeDeleteDialog"
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
import MessageBubble from '../components/MessageBubble.vue';
import ConversationList from '../components/ConversationList.vue';
import NewConversationDialog from '../components/NewConversationDialog.vue';

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

const conversations = ref<Conversation[]>([]);
const selectedConversation = ref<Conversation | null>(null);
const messages = ref<Message[]>([]);
const newMessage = ref('');
const showMessageInfo = ref<string | null>(null);
const isOtherUserTyping = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const showDeleteDialog = ref(false);
const messageToDelete = ref<Message | null>(null);
const searchQuery = ref('');
const conversationFilter = ref('all');
const showNewConversationDialog = ref(false);
const availableUsers = ref<any[]>([]);

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
    const response = await api.get('users');
    availableUsers.value = response.data.data;
  } catch (error) {
    console.error('Failed to load users:', error);
  }
};

const selectConversation = async (conversation: Conversation) => {
  selectedConversation.value = conversation;
  router.push(`/messages/${conversation.userId}`);

  try {
    const result = await messageService.getConversation(conversation.userId);
    messages.value = result.messages.reverse();
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

    messages.value.push(message);

    // Update conversation latest message
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
      // Remove message from local view
      const index = messages.value.findIndex(m => m.id === messageToDelete.value?.id);
      if (index !== -1) {
        messages.value.splice(index, 1);
      }
    }
    // For 'everyone', the real-time event will update the UI

    closeDeleteDialog();
  } catch (error) {
    console.error('Failed to delete message:', error);
  }
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  messageToDelete.value = null;
};

const toggleMessageInfo = (messageId: string) => {
  showMessageInfo.value = showMessageInfo.value === messageId ? null : messageId;
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
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// WebSocket event handlers
const handleNewMessage = (message: Message) => {
  // Check if message belongs to current conversation
  if (selectedConversation.value) {
    const isSentByMe = message.sender.id === currentUserId.value;
    const isForMe = message.recipient.id === currentUserId.value;
    const isSentToSelectedUser = message.recipient.id === selectedConversation.value.userId;
    const isFromSelectedUser = message.sender.id === selectedConversation.value.userId;

    if ((isSentByMe && isSentToSelectedUser) || (isForMe && isFromSelectedUser)) {
      messages.value.push(message);
      nextTick(() => {
        scrollToBottom();
      });

      if (isForMe) {
        messageService.markConversationAsRead(selectedConversation.value.userId);
      }
    }
  }

  // Update conversations list
  const conv = conversations.value.find(c =>
    c.userId === message.sender.id || c.userId === message.recipient.id
  );
  if (conv) {
    conv.latestMessage = message;
  }
};

const handleMessageUpdated = (updatedMessage: Message) => {
  const index = messages.value.findIndex(m => m.id === updatedMessage.id);
  if (index !== -1) {
    messages.value.splice(index, 1, updatedMessage);
  }
};

const handleMessageDeleted = (data: { messageId: string; deletedForEveryone: boolean }) => {
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

const handleTypingStatus = (data: { userId: string; isTyping: boolean }) => {
  if (selectedConversation.value && data.userId === selectedConversation.value.userId) {
    isOtherUserTyping.value = data.isTyping;
  }
};

const handleMessageRead = (data: { messageId: string; readAt: string }) => {
  const message = messages.value.find(m => m.id === data.messageId);
  if (message) {
    message.isRead = true;
    message.readAt = data.readAt;
  }
};

onMounted(async () => {
  await Promise.all([
    loadConversations(),
    loadAvailableUsers()
  ]);

  const socket = socketService.getSocket();
  if (!socket) {
    console.warn('Socket not connected in Messages page');
    return;
  }

  // Setup WebSocket listeners
  socket.on('message:new', handleNewMessage);
  socket.on('message:updated', handleMessageUpdated);
  socket.on('message:deleted', handleMessageDeleted);
  socket.on('typing', handleTypingStatus);
  socket.on('message:read', handleMessageRead);
});

onUnmounted(() => {
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
</style>
