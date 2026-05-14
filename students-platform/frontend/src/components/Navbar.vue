<template>
  <div class="nav-container">
    <el-menu
        v-if="!isMobile"
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
    >
      <!-- Logo -->
      <div class="navbar-logo">
        <router-link to="/">
          <img src="../images/logo_transparent.png" alt="Logo" class="logo-img" />
        </router-link>
      </div>

      <!-- Home Button -->
      <el-menu-item index="0">
        <router-link to="/">Home</router-link>
      </el-menu-item>

      <!-- Community -->
      <el-menu-item index="1">
        <el-link href="/community" type="text">Community</el-link>
      </el-menu-item>

      <!-- Study Opportunities -->
      <el-sub-menu index="2">
        <template #title>Study Opportunities</template>
        <el-menu-item index="2-1">
          <el-link href="/universities" type="text">Search Universities</el-link>
        </el-menu-item>
        <el-menu-item index="2-2">
          <el-link href="/scholarships" type="text">Search Scholarships</el-link>
        </el-menu-item>
      </el-sub-menu>

      <!-- Feed -->
      <el-menu-item index="3">
        <router-link to="/feed">Feed</router-link>
      </el-menu-item>

      <!-- Account Button -->
      <div class="right-desktop">
        <template v-if="!session.isAuthenticated">
          <el-button text @click="navigate('/login')">Login</el-button>
          <el-button type="primary" @click="navigate('/register')">Register</el-button>
        </template>

        <template v-else>
          <!-- Messenger Button with Popup -->
          <div v-if="!isOnMessagesPage" class="messenger-wrapper">
            <button
              @click="toggleMessengerPopup"
              :class="['messenger-button', { 'messenger-button-active': showMessengerPopup || openChatBoxes.length > 0 }]"
              title="Messages"
            >
              <el-icon><ChatDotRound /></el-icon>
              <span v-if="displayUnreadCount > 0" class="messenger-badge">{{ displayUnreadCount }}</span>
            </button>

            <!-- Messenger Popup -->
            <div v-if="showMessengerPopup" class="messenger-popup" @click.stop>
              <ConversationList
                :conversations="filteredRecentConversations"
                :selected-conversation-id="null"
                :empty-message="'No conversations yet'"
                :show-header="true"
                :title="'Messages'"
                :show-new-button="true"
                :show-search="true"
                :search-query="navbarSearchQuery"
                @update:search-query="handleNavbarSearchChange"
                :search-placeholder="'Search messages...'"
                :show-filter="true"
                :filter="navbarConversationFilter"
                @update:filter="navbarConversationFilter = $event"
                @select="openConversation"
                @new-conversation="showNewConversationDialog = true"
              />
              <div class="messenger-footer">
                <button @click="closeMessengerPopup" class="see-all-button">
                  See all messages
                </button>
              </div>
            </div>
          </div>

          <!-- Notifications Dropdown -->
          <NotificationDropdown />

          <el-dropdown>
            <span class="user-name">
              <img
                :src="userAvatar"
                alt="Profile Picture"
                class="w-8 h-8 rounded-full mr-2"
              />
              {{ session.user?.name }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="navigate(`/profile/${session.user?.username}`)">View Profile</el-dropdown-item>
                <el-dropdown-item @click="navigate('/dashboard')">Dashboard</el-dropdown-item>
                <el-dropdown-item @click="navigate('/dashboard/change-password')">Change Password</el-dropdown-item>
                <el-dropdown-item @click="logout">Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </el-menu>

    <!-- Mobile Header -->
    <div v-else class="mobile-header">
      <el-button @click="drawerMenu = true" circle>
        <el-icon><Menu /></el-icon>
      </el-button>

      <el-button @click="drawerAccount = true" circle>
        <el-icon><User /></el-icon>
      </el-button>
    </div>

    <!-- Mobile Menu Drawer -->
    <el-drawer v-model="drawerMenu" title="Menu" direction="ltr" size="260px">
      <el-menu :default-active="activeIndex" @select="handleSelect">
        <!-- Home Button -->
        <el-menu-item index="0">
          <router-link to="/">Home</router-link>
        </el-menu-item>

        <!-- Community -->
        <el-menu-item index="1">
          <router-link to="/community">Community</router-link>
        </el-menu-item>

        <!-- Study Opportunities -->
        <el-sub-menu index="2">
          <template #title>Study Opportunities</template>
          <el-menu-item index="2-1">
            <router-link to="/universities">Search Universities</router-link>
          </el-menu-item>
          <el-menu-item index="2-2">
            <router-link to="/scholarships">Search Scholarships</router-link>
          </el-menu-item>
        </el-sub-menu>

        <!-- Feed -->
        <el-menu-item index="3">
          <router-link to="/feed">Feed</router-link>
        </el-menu-item>
      </el-menu>
    </el-drawer>

    <!-- Mobile Account Drawer -->
    <el-drawer v-model="drawerAccount" title="Account" direction="rtl" size="260px">
      <template v-if="!session.isAuthenticated">
        <el-button type="primary" class="w-100 mb-2" @click="navigate('/login')">Login</el-button>
        <el-button class="w-100 mb-2" @click="navigate('/register')">Register</el-button>
      </template>

      <template v-else>
        <p>Welcome, <b>{{ session.user?.name }}</b></p>
        <el-button class="w-100 mb-2" @click="navigate(`/profile/${session.user?.username}`)">View Profile</el-button>
        <el-button class="w-100 mb-2" @click="navigate('/dashboard')">Dashboard</el-button>
        <el-button class="w-100 mb-2" @click="navigate('/dashboard/change-password')">Change Password</el-button>
        <el-button type="danger" class="w-100" @click="logout">Logout</el-button>
      </template>
    </el-drawer>

    <!-- Floating Chat Boxes -->
    <div v-if="!isOnMessagesPage" class="floating-chat-boxes">
      <ChatBox
        v-for="(chatBox, index) in openChatBoxes"
        :key="chatBox.conversation.userId"
        :conversation="chatBox.conversation"
        :current-user-id="session.user?.id || ''"
        :new-message="chatBox.newMessage"
        :is-minimized="chatBox.isMinimized"
        :new-messages-count="chatBox.newMessagesCount"
        :is-scrolled-to-bottom="chatBox.isScrolledToBottom"
        :is-other-user-typing="chatBox.isOtherUserTyping"
        :style="{ right: `${16 + index * 366}px` }"
        @close="closeChatBox(chatBox.conversation.userId)"
        @minimize="toggleMinimizeChatBox(chatBox.conversation.userId)"
        @open-in-messenger="openInMessenger"
        @delete-conversation="deleteChatBoxConversation(chatBox.conversation.userId)"
        @send="sendMessageInChatBox(chatBox.conversation.userId)"
        @update:new-message="updateChatBoxMessage(chatBox.conversation.userId, $event)"
        @scroll="handleChatBoxScroll(chatBox.conversation.userId, $event)"
        @scroll-to-bottom="scrollChatBoxToBottom(chatBox.conversation.userId)"
        @typing="handleChatBoxTyping(chatBox.conversation.userId)"
        @edit-message="handleEditMessage"
        @delete-message="handleDeleteMessage"
        @mark-as-read="markChatBoxAsRead(chatBox.conversation.userId)"
      />
    </div>

    <!-- New Conversation Dialog -->
    <NewConversationDialog
      v-model="showNewConversationDialog"
      :available-users="availableUsers"
      :existing-conversation-user-ids="conversations.map(c => c.userId)"
      @select="startConversationWithUser"
    />

    <!-- Delete Confirmation Modal -->
    <el-dialog v-model="showDeleteDialog" title="Delete Conversation" width="400px">
      <p>Are you sure you want to delete this conversation? This action cannot be undone.</p>
      <template #footer>
        <el-button @click="showDeleteDialog = false">Cancel</el-button>
        <el-button type="danger" @click="confirmDeleteConversation">Delete</el-button>
      </template>
    </el-dialog>

    <!-- Delete Message Dialog -->
    <div
      v-if="showMessageDeleteDialog"
      class="fixed inset-0 flex items-center justify-center z-[9999]"
      @click.self="closeMessageDeleteDialog"
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
            @click="closeMessageDeleteDialog"
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
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { Menu, User, ChatDotRound, Bell } from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';
import { useActiveMenu } from '../composables/useActiveMenu';
import { useNavigation } from '../composables/useNavigation';
import { useAuth } from '../composables/useAuth';
import { useSessionStore } from '../store/session';
import { getAvatarUrl } from '../utils/avatar';
import { messageService, type Conversation, type Message } from '../services/message.service';
import { socketService } from '../services/socket';
import { api } from '../services/api';
import ChatBox from './ChatBox.vue';
import ConversationList from './ConversationList.vue';
import NewConversationDialog from './NewConversationDialog.vue';
import NotificationDropdown from './NotificationDropdown.vue';

const { activeIndex } = useActiveMenu();
const { navigate } = useNavigation();
const { logout } = useAuth();
const route = useRoute();
const session = useSessionStore();

const drawerMenu = ref(false);
const drawerAccount = ref(false);
const isMobile = ref(false);

// Messenger state
const showMessengerPopup = ref(false);
const conversations = ref<Conversation[]>([]);
const unreadCount = ref(0);
const navbarSearchQuery = ref('');
const navbarConversationFilter = ref('all');
const showNewConversationDialog = ref(false);
const availableUsers = ref<any[]>([]);

// Chat boxes state
interface ChatBoxState {
  conversation: Conversation & { messages: Message[] };
  newMessage: string;
  isMinimized: boolean;
  newMessagesCount: number;
  isScrolledToBottom: boolean;
  isOtherUserTyping: boolean;
  typingTimeout?: number;
}

const openChatBoxes = ref<ChatBoxState[]>([]);
const showDeleteDialog = ref(false);
const conversationToDelete = ref<string | null>(null);
const showMessageDeleteDialog = ref(false);
const messageToDelete = ref<Message | null>(null);

const userAvatar = computed(() =>
  session.user ? getAvatarUrl(session.user.name, session.user.avatar) : ''
);

const isOnMessagesPage = computed(() => route.path.startsWith('/messages'));

const filteredRecentConversations = computed(() => {
  let filtered = conversations.value;

  // Filter by search query
  if (navbarSearchQuery.value.trim()) {
    const query = navbarSearchQuery.value.toLowerCase();
    filtered = filtered.filter(c =>
      c.user.name.toLowerCase().includes(query) ||
      c.user.username.toLowerCase().includes(query)
    );
  }

  // Filter by unread status
  if (navbarConversationFilter.value === 'unread') {
    filtered = filtered.filter(c => c.unreadCount > 0);
  }

  return filtered.slice(0, 10); // Show top 10
});

const displayUnreadCount = computed(() => {
  // Count unread messages excluding open chat boxes
  const openChatBoxUserIds = new Set(openChatBoxes.value.map(cb => cb.conversation.userId));
  return conversations.value
    .filter(c => !openChatBoxUserIds.has(c.userId))
    .reduce((sum, c) => sum + c.unreadCount, 0);
});

const canDeleteForEveryone = computed(() =>
  messageToDelete.value ? messageService.canDeleteForEveryone(messageToDelete.value) : false
);

// Data loading
const loadConversations = async () => {
  if (!session.isAuthenticated) return;
  try {
    conversations.value = await messageService.getConversations();
  } catch (error) {
    console.error('Failed to load conversations:', error);
  }
};

const loadUnreadCount = async () => {
  if (!session.isAuthenticated) return;
  try {
    unreadCount.value = await messageService.getUnreadCount();
  } catch (error) {
    console.error('Failed to load unread count:', error);
  }
};

const loadAvailableUsers = async () => {
  if (!session.isAuthenticated) return;
  try {
    // Use empty search to get all users
    const users = await messageService.searchUsers('');
    availableUsers.value = users;
  } catch (error) {
    console.error('Failed to load users:', error);
  }
};

// Messenger popup
const toggleMessengerPopup = () => {
  showMessengerPopup.value = !showMessengerPopup.value;
};

const closeMessengerPopup = () => {
  showMessengerPopup.value = false;
  navigate('/messages');
};

let searchDebounceTimer: number | null = null;
const handleNavbarSearchChange = (query: string) => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
  searchDebounceTimer = window.setTimeout(() => {
    navbarSearchQuery.value = query;
  }, 300);
};

// Chat box management
const openConversation = async (conversation: Conversation) => {
  showMessengerPopup.value = false;

  // Check if already open
  const existingIndex = openChatBoxes.value.findIndex(
    cb => cb.conversation.userId === conversation.userId
  );

  if (existingIndex !== -1) {
    // Unminimize if minimized
    openChatBoxes.value[existingIndex].isMinimized = false;
    return;
  }

  // Load messages
  try {
    const messages = await messageService.getConversationMessages(conversation.userId);

    if (openChatBoxes.value.length >= 3) {
      openChatBoxes.value.shift();
    }

    openChatBoxes.value.push({
      conversation: {
        ...conversation,
        messages
      },
      newMessage: '',
      isMinimized: false,
      newMessagesCount: 0,
      isScrolledToBottom: true,
      isOtherUserTyping: false
    });

    // Mark as read
    await messageService.markConversationAsRead(conversation.userId);

    const conv = conversations.value.find(c => c.userId === conversation.userId);
    if (conv) {
      conv.unreadCount = 0;
    }
  } catch (error) {
    console.error('Failed to open conversation:', error);
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

  openConversation(conversation);
};

const closeChatBox = (userId: string) => {
  const index = openChatBoxes.value.findIndex(cb => cb.conversation.userId === userId);
  if (index !== -1) {
    openChatBoxes.value.splice(index, 1);
  }
};

const toggleMinimizeChatBox = (userId: string) => {
  const chatBox = openChatBoxes.value.find(cb => cb.conversation.userId === userId);
  if (chatBox) {
    chatBox.isMinimized = !chatBox.isMinimized;
  }
};

const openInMessenger = (userId: string) => {
  navigate(`/messages/${userId}`);
};

const deleteChatBoxConversation = (userId: string) => {
  conversationToDelete.value = userId;
  showDeleteDialog.value = true;
};

const confirmDeleteConversation = async () => {
  if (!conversationToDelete.value) return;

  try {
    await messageService.deleteConversation(conversationToDelete.value);

    const convIndex = conversations.value.findIndex(c => c.userId === conversationToDelete.value);
    if (convIndex !== -1) {
      conversations.value.splice(convIndex, 1);
    }

    // Close chat box if open
    closeChatBox(conversationToDelete.value);

    showDeleteDialog.value = false;
    conversationToDelete.value = null;
  } catch (error) {
    console.error('Failed to delete conversation:', error);
  }
};

const updateChatBoxMessage = (userId: string, message: string) => {
  const chatBox = openChatBoxes.value.find(cb => cb.conversation.userId === userId);
  if (chatBox) {
    chatBox.newMessage = message;
  }
};

const sendMessageInChatBox = async (userId: string) => {
  const chatBox = openChatBoxes.value.find(cb => cb.conversation.userId === userId);
  if (!chatBox || !chatBox.newMessage.trim()) return;

  const content = chatBox.newMessage.trim();
  chatBox.newMessage = '';

  try {
    const message = await messageService.sendMessage({
      recipientId: userId,
      content
    });

    const conv = conversations.value.find(c => c.userId === userId);
    if (conv) {
      conv.latestMessage = message;
      conv.lastActivity = message.createdAt;
    }

    nextTick(() => {
      scrollChatBoxToBottom(userId);
    });
  } catch (error) {
    console.error('Failed to send message:', error);
    chatBox.newMessage = content;
  }
};

const handleChatBoxScroll = (userId: string, isAtBottom: boolean) => {
  const chatBox = openChatBoxes.value.find(cb => cb.conversation.userId === userId);
  if (chatBox) {
    chatBox.isScrolledToBottom = isAtBottom;
    if (isAtBottom) {
      chatBox.newMessagesCount = 0;
    }
  }
};

const scrollChatBoxToBottom = async (userId: string) => {
  const chatBox = openChatBoxes.value.find(cb => cb.conversation.userId === userId);
  if (chatBox) {
    chatBox.newMessagesCount = 0;
    chatBox.isScrolledToBottom = true;

    const unreadMessages = chatBox.conversation.messages.filter(
      m => !m.isRead && m.recipient.id === session.user?.id
    );

    for (const message of unreadMessages) {
      try {
        await messageService.markAsRead(message.id);
      } catch (error) {
        console.error('Failed to mark message as read:', error);
      }
    }
  }
};

const handleChatBoxTyping = (userId: string) => {
  const socket = socketService.getSocket();
  if (!socket) return;

  socket.emit('typing', { recipientId: userId, isTyping: true });

  const chatBox = openChatBoxes.value.find(cb => cb.conversation.userId === userId);
  if (chatBox) {
    if (chatBox.typingTimeout) {
      clearTimeout(chatBox.typingTimeout);
    }
    chatBox.typingTimeout = window.setTimeout(() => {
      socket.emit('typing', { recipientId: userId, isTyping: false });
    }, 1000);
  }
};

const markChatBoxAsRead = async (userId: string) => {
  try {
    await messageService.markConversationAsRead(userId);

    const conv = conversations.value.find(c => c.userId === userId);
    if (conv) {
      conv.unreadCount = 0;
    }

    const chatBox = openChatBoxes.value.find(cb => cb.conversation.userId === userId);
    if (chatBox) {
      chatBox.conversation.unreadCount = 0;
      chatBox.newMessagesCount = 0;

      chatBox.conversation.messages = chatBox.conversation.messages.map(msg => {
        if (msg.recipient.id === session.user?.id && !msg.isRead) {
          return {
            ...msg,
            isRead: true,
            readAt: new Date().toISOString()
          };
        }
        return msg;
      });
    }
  } catch (error) {
    console.error('Failed to mark conversation as read:', error);
  }
};

const handleEditMessage = async (messageId: string, newContent: string) => {
  try {
    const updatedMessage = await messageService.updateMessage(messageId, newContent);

    for (const chatBox of openChatBoxes.value) {
      const index = chatBox.conversation.messages.findIndex(m => m.id === messageId);
      if (index !== -1) {
        chatBox.conversation.messages.splice(index, 1, updatedMessage);
      }
    }
  } catch (error) {
    console.error('Failed to edit message:', error);
    // Show user-friendly error message
    if (error instanceof Error || (typeof error === 'object' && error !== null && 'response' in error)) {
      const axiosError = error as any;
      console.error('[Navbar] Edit error details:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message
      });
      const errorMessage = axiosError.response?.data?.error || 'Failed to edit message';
      alert(errorMessage);
    }
  }
};

const handleDeleteMessage = async (message: Message) => {
  messageToDelete.value = message;
  showMessageDeleteDialog.value = true;
};

const closeMessageDeleteDialog = () => {
  showMessageDeleteDialog.value = false;
  messageToDelete.value = null;
};

const deleteMessage = async (deleteFor: 'me' | 'everyone') => {
  if (!messageToDelete.value) return;

  try {
    await messageService.deleteMessage(messageToDelete.value.id, deleteFor);

    if (deleteFor === 'me') {
      for (const chatBox of openChatBoxes.value) {
        const index = chatBox.conversation.messages.findIndex(m => m.id === messageToDelete.value?.id);
        if (index !== -1) {
          chatBox.conversation.messages.splice(index, 1);
        }
      }
    }

    closeMessageDeleteDialog();
  } catch (error) {
    console.error('Failed to delete message:', error);
  }
};

// WebSocket handlers
const handleNewMessage = (payload: any) => {

  const message = payload.data || payload;

  // Safety checks
  if (!message || !message.sender || !message.recipient) {
    console.error('[Navbar] Invalid message format:', message);
    return;
  }

  const isSentByMe = message.sender.id === session.user?.id;
  const isForMe = message.recipient.id === session.user?.id;


  let conv = conversations.value.find(
    c => c.userId === (isSentByMe ? message.recipient.id : message.sender.id)
  );

  if (conv) {
    conv.latestMessage = message;
    conv.lastActivity = message.createdAt;
    if (isForMe) {
      conv.unreadCount += 1;
    }
  } else if (isForMe) {
    // New conversation
    conv = {
      userId: message.sender.id,
      user: message.sender,
      latestMessage: message,
      unreadCount: 1,
      lastActivity: message.createdAt
    };
    conversations.value.unshift(conv);
  }

  const chatBox = openChatBoxes.value.find(
    cb => cb.conversation.userId === (isSentByMe ? message.recipient.id : message.sender.id)
  );

  if (chatBox) {
    // Check if message already exists to prevent duplicates
    const messageExists = chatBox.conversation.messages.some(m => m.id === message.id);
    const messageCount = chatBox.conversation.messages.filter(m => m.id === message.id).length;

    if (!messageExists) {
      chatBox.conversation.messages.push(message);
    } else {
    }

    if (isForMe) {
      if (chatBox.isScrolledToBottom && !chatBox.isMinimized) {
        // Mark entire conversation as read automatically
        const otherUserId = message.sender.id;
        messageService.markConversationAsRead(otherUserId).catch(console.error);
        if (conv) conv.unreadCount = 0;
        chatBox.newMessagesCount = 0;
      } else {
        chatBox.newMessagesCount += 1;
      }
    }

    // Always scroll to bottom if I sent the message, only scroll if at bottom for received messages
    if (isSentByMe || chatBox.isScrolledToBottom) {
      nextTick(() => {
        scrollChatBoxToBottom(chatBox.conversation.userId);
      });
    }
  }
};

const handleMessageUpdated = (payload: any) => {
  const updatedMessage = payload.data || payload;

  const conv = conversations.value.find(
    c => c.latestMessage?.id === updatedMessage.id
  );
  if (conv) {
    conv.latestMessage = updatedMessage;
  }

  for (const chatBox of openChatBoxes.value) {
    const index = chatBox.conversation.messages.findIndex(m => m.id === updatedMessage.id);
    if (index !== -1) {
      chatBox.conversation.messages.splice(index, 1, updatedMessage);
    }
  }
};

const handleMessageDeleted = (payload: any) => {
  const data = payload.data || payload;

  if (data.deletedForEveryone) {
    for (const chatBox of openChatBoxes.value) {
      const message = chatBox.conversation.messages.find(m => m.id === data.messageId);
      if (message) {
        message.isDeletedForEveryone = true;
        message.content = 'This message was deleted';
      }
    }
  } else {
    for (const chatBox of openChatBoxes.value) {
      const index = chatBox.conversation.messages.findIndex(m => m.id === data.messageId);
      if (index !== -1) {
        chatBox.conversation.messages.splice(index, 1);
      }
    }
  }
};

const handleMessageRead = (payload: any) => {
  const data = payload.data || payload;

  for (const chatBox of openChatBoxes.value) {
    // For single message read
    if (data.messageId) {
      chatBox.conversation.messages = chatBox.conversation.messages.map(msg => {
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
    // For conversation read (multiple messages)
    else if (data.otherUserId && data.userId) {
      // data.userId = person who marked as read (recipient)
      // data.otherUserId = person whose messages were marked as read (sender)
      // If I'm the sender (otherUserId), update my sent messages
      const iAmTheSender = data.otherUserId === session.user?.id;

      if (iAmTheSender) {
        chatBox.conversation.messages = chatBox.conversation.messages.map(msg => {
          if (msg.sender.id === session.user?.id && !msg.isRead) {
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
  }

};

const handleTypingIndicator = (payload: any) => {
  const data = payload.data || payload;
  const chatBox = openChatBoxes.value.find(cb => cb.conversation.userId === data.userId);
  if (chatBox) {
    chatBox.isOtherUserTyping = data.isTyping;
  } else {
  }
};

// Setup WebSocket
const setupWebSocket = async () => {
  if (!session.isAuthenticated || !session.user) return;

  const socket = socketService.connect(); // Use cookie-based auth

  // Wait for connection and join user room
  socket.on('connect', async () => {
    const result = await socketService.joinRoom('user', session.user!.id);
    if (result.success) {
    } else {
      console.error('[Navbar] Failed to join user room:', result.error);
    }
  });

  socket.on('message:new', handleNewMessage);
  socket.on('message:updated', handleMessageUpdated);
  socket.on('message:deleted', handleMessageDeleted);
  socket.on('message:read', handleMessageRead);
  socket.on('typing', handleTypingIndicator);

  // If already connected, join room immediately
  if (socket.connected) {
    const result = await socketService.joinRoom('user', session.user!.id);
    if (result.success) {
    } else {
      console.error('[Navbar] Failed to join user room:', result.error);
    }
  }
};

const cleanupWebSocket = () => {
  const socket = socketService.getSocket();
  if (!socket) return;

  socket.off('message:new', handleNewMessage);
  socket.off('message:updated', handleMessageUpdated);
  socket.off('message:deleted', handleMessageDeleted);
  socket.off('message:read', handleMessageRead);
  socket.off('typing', handleTypingIndicator);
};

// Close popup when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.messenger-wrapper')) {
    showMessengerPopup.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  if (session.isAuthenticated) {
    await Promise.all([
      loadConversations(),
      loadUnreadCount(),
      loadAvailableUsers()
    ]);
    setupWebSocket();
  }

  window.addEventListener('click', handleClickOutside);

  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768;
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onBeforeUnmount(() => {
  cleanupWebSocket();
  window.removeEventListener('click', handleClickOutside);

  // Clear typing timeouts
  for (const chatBox of openChatBoxes.value) {
    if (chatBox.typingTimeout) {
      clearTimeout(chatBox.typingTimeout);
    }
  }
});

// Watch for route changes to close chat boxes on messages page
watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/messages')) {
    showMessengerPopup.value = false;
  }
});

const handleSelect = () => {
  drawerMenu.value = false;
  drawerAccount.value = false;
};
</script>

<style scoped>
.nav-container {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-menu-demo {
  border-bottom: none;
}

.right-desktop {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 20px;
}

.user-name {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  color: #2c3e50;
}

.messenger-wrapper {
  position: relative;
}

.messenger-button,
.notifications-button {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #e4e6eb;
  color: #050505;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  font-size: 20px;
}

.messenger-button:hover,
.notifications-button:hover {
  background-color: #d8dadf;
}

.messenger-button-active {
  background-color: #3b82f6;
  color: white;
}

.messenger-button-active:hover {
  background-color: #2563eb;
}

.messenger-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #ef4444;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  min-width: 18px;
  text-align: center;
}

.messenger-popup {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 360px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 480px;
  display: flex;
  flex-direction: column;
}

.messenger-footer {
  padding: 12px;
  border-top: 1px solid #e5e7eb;
}

.see-all-button {
  width: 100%;
  padding: 8px;
  background: transparent;
  border: none;
  color: #3b82f6;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.see-all-button:hover {
  background-color: #f3f4f6;
}

.floating-chat-boxes {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 999;
  pointer-events: none;
}

.floating-chat-boxes > * {
  pointer-events: all;
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: white;
}

.w-100 {
  width: 100%;
}

.mb-2 {
  margin-bottom: 8px;
}

.navbar-logo {
  display: flex;
  align-items: center;
  padding: 0 20px;
  cursor: pointer;
}

.logo-img {
  height: 100px;
  width: auto;
  object-fit: contain;
}

/* Enhanced Dropdown Styles */
:deep(.el-dropdown-menu) {
  padding: 8px 0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.06);
  min-width: 220px;
}

:deep(.el-dropdown-menu__item) {
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
}

:deep(.el-dropdown-menu__item:hover) {
  background: #3b82f6;
  color: white;
  transform: translateX(4px);
}

:deep(.el-dropdown-menu__item:last-child:hover) {
  background: #ef4444;
  color: white;
}

:deep(.el-dropdown-menu__item:not(:last-child)) {
  position: relative;
}

.user-name {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  color: #2c3e50;
  padding: 8px 12px;
  border-radius: 24px;
  transition: all 0.3s ease;
}

.user-name:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.user-name img {
  border: 2px solid #3b82f6;
  transition: all 0.3s ease;
}

.user-name:hover img {
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}
</style>
