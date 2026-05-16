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
          <img
            src="../images/logo_transparent.png"
            alt="International Student Compass Logo"
            class="logo-img"
            width="300"
            height="200"
          />
        </router-link>
      </div>

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
                :selected-conversation-id="undefined"
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
                <el-dropdown-item @click="navigate(`/profile/${session.user?.username}`)">
                  <div class="dropdown-item-content">
                    <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>View Profile</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item @click="navigate('/dashboard')">
                  <div class="dropdown-item-content">
                    <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
                    </svg>
                    <span>Dashboard</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item @click="navigate('/dashboard/change-password')">
                  <div class="dropdown-item-content">
                    <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <span>Change Password</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item @click="logout">
                  <div class="dropdown-item-content">
                    <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </div>
                </el-dropdown-item>
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

      <router-link to="/" class="mobile-logo">
        <img
          src="../images/logo_transparent.png"
          alt="International Student Compass Logo"
          class="mobile-logo-img"
        />
      </router-link>

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
    <el-drawer v-model="drawerAccount" title="Account" direction="rtl" size="280px" class="mobile-account-drawer">
      <template v-if="!session.isAuthenticated">
        <div class="account-drawer-content">
          <div class="guest-message">
            <p>Sign in to access your account</p>
          </div>
          <el-button type="primary" size="large" class="w-100 mb-3" @click="navigate('/login')">
            <el-icon style="margin-right: 8px;">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M521.7 82c-152.5-.4-286.7 78.5-363.4 197.7-3.4 5.3.4 12.3 6.7 12.3h70.3c4.8 0 9.3-2.1 12.3-5.8 7-8.5 14.5-16.7 22.4-24.5 32.6-32.5 70.5-58.1 112.7-75.9 43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 32.6 32.5 58.1 70.4 76 112.5C865.7 417.8 875 464.1 875 512c0 47.9-9.4 94.2-27.8 137.8-17.8 42.1-43.4 80-76 112.5s-70.5 58.1-112.7 75.9A352.8 352.8 0 0 1 520.6 866c-47.9 0-94.3-9.4-137.9-27.8A353.84 353.84 0 0 1 270 762.3c-7.9-7.9-15.3-16.1-22.4-24.5-3-3.7-7.6-5.8-12.3-5.8H165c-6.3 0-10.2 7-6.7 12.3C234.9 863.2 368.5 942 520.6 942c236.2 0 428-190.1 430.4-425.6C953.4 277.1 761.3 82.6 521.7 82zM395.02 624v-76h-314c-4.4 0-8-3.6-8-8v-56c0-4.4 3.6-8 8-8h314v-76c0-6.7 7.8-10.5 13-6.3l141.9 112a8 8 0 0 1 0 12.6l-141.9 112c-5.2 4.1-13 .4-13-6.3z"/>
              </svg>
            </el-icon>
            Login
          </el-button>
          <el-button size="large" class="w-100 register-btn" @click="navigate('/register')">
            <el-icon style="margin-right: 8px;">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M678.3 642.4c24.2-13 51.9-20.4 81.4-20.4h.1c3 0 4.4-3.6 2.2-5.6a371.67 371.67 0 0 0-103.7-65.8c-.4-.2-.8-.3-1.2-.5C719.2 505 759.6 431.7 759.6 349c0-137-110.8-248-247.5-248S264.7 212 264.7 349c0 82.7 40.4 156 102.6 201.1-.4.2-.8.3-1.2.5-44.7 18.9-84.8 46-119.3 80.6a373.42 373.42 0 0 0-80.4 119.5A373.6 373.6 0 0 0 137 888.8a8 8 0 0 0 8 8.2h59.9c4.3 0 7.9-3.5 8-7.8 2-77.2 32.9-149.5 87.6-204.3C356 628.2 431.3 597 512.1 597c56.7 0 111.1 15.7 158 45.1a8.1 8.1 0 0 0 8.2.3zM512.2 521c-45.8 0-88.9-17.9-121.4-50.4A171.2 171.2 0 0 1 340.5 349c0-45.9 17.9-89.1 50.3-121.6S466.3 177 512.2 177s88.9 17.9 121.4 50.4A171.2 171.2 0 0 1 683.9 349c0 45.9-17.9 89.1-50.3 121.6C601.1 503.1 558 521 512.2 521zM880 759h-84v-84c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v84h-84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h84v84c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-84h84c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"/>
              </svg>
            </el-icon>
            Register
          </el-button>
        </div>
      </template>

      <template v-else>
        <div class="account-drawer-content">
          <!-- User Profile Section -->
          <div class="user-profile-section">
            <img
              :src="userAvatar"
              alt="Profile Picture"
              class="profile-avatar"
            />
            <div class="user-info">
              <h3 class="user-name-text">{{ session.user?.name }}</h3>
              <p class="user-username">@{{ session.user?.username }}</p>
            </div>
          </div>

          <!-- Divider -->
          <div class="drawer-divider"></div>

          <!-- Menu Items -->
          <div class="menu-items">
            <button class="menu-item" @click="navigate(`/profile/${session.user?.username}`)">
              <el-icon class="menu-icon">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"/>
                </svg>
              </el-icon>
              <span>View Profile</span>
            </button>

            <button class="menu-item" @click="navigate('/dashboard')">
              <el-icon class="menu-icon">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M924.8 385.6a446.7 446.7 0 0 0-96-142.4 446.7 446.7 0 0 0-142.4-96C631.1 123.8 572.5 112 512 112s-119.1 11.8-174.4 35.2a446.7 446.7 0 0 0-142.4 96 446.7 446.7 0 0 0-96 142.4C75.8 440.9 64 499.5 64 560c0 132.7 58.3 257.7 159.9 343.1l1.7 1.4c5.8 4.8 13.1 7.5 20.6 7.5h531.7c7.5 0 14.8-2.7 20.6-7.5l1.7-1.4C901.7 817.7 960 692.7 960 560c0-60.5-11.9-119.1-35.2-174.4zM761.4 836H262.6A371.12 371.12 0 0 1 140 560c0-99.4 38.7-192.8 109-263 70.3-70.3 163.7-109 263-109 99.4 0 192.8 38.7 263 109 70.3 70.3 109 163.7 109 263 0 105.6-44.5 205.5-122.6 276zM623.5 421.5a8.03 8.03 0 0 0-11.3 0L527.7 506c-18.7-5-39.4-.2-54.1 14.5a55.95 55.95 0 0 0 0 79.2 55.95 55.95 0 0 0 79.2 0 55.87 55.87 0 0 0 14.5-54.1l84.5-84.5c3.1-3.1 3.1-8.2 0-11.3l-28.3-28.3zM490 320h44c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8h-44c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8zm260 218v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8zm12.7-197.2l-31.1-31.1a8.03 8.03 0 0 0-11.3 0l-56.6 56.6a8.03 8.03 0 0 0 0 11.3l31.1 31.1c3.1 3.1 8.2 3.1 11.3 0l56.6-56.6c3.1-3.1 3.1-8.2 0-11.3zm-458.6-31.1a8.03 8.03 0 0 0-11.3 0l-31.1 31.1a8.03 8.03 0 0 0 0 11.3l56.6 56.6c3.1 3.1 8.2 3.1 11.3 0l31.1-31.1c3.1-3.1 3.1-8.2 0-11.3l-56.6-56.6zM262 530h-80c-4.4 0-8 3.6-8 8v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8z"/>
                </svg>
              </el-icon>
              <span>Dashboard</span>
            </button>

            <button class="menu-item" @click="navigate('/dashboard/change-password')">
              <el-icon class="menu-icon">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM540 701v53c0 4.4-3.6 8-8 8h-40c-4.4 0-8-3.6-8-8v-53a48.01 48.01 0 1 1 56 0zm152-237H332V240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224z"/>
                </svg>
              </el-icon>
              <span>Change Password</span>
            </button>
          </div>

          <!-- Divider -->
          <div class="drawer-divider"></div>

          <!-- Logout Button -->
          <button class="logout-btn" @click="logout">
            <el-icon class="logout-icon">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M868 732h-70.3c-4.8 0-9.3 2.1-12.3 5.8-7 8.5-14.5 16.7-22.4 24.5a353.84 353.84 0 0 1-112.7 75.9A352.8 352.8 0 0 1 512.4 866c-47.9 0-94.3-9.4-137.9-27.8a353.84 353.84 0 0 1-112.7-75.9 353.28 353.28 0 0 1-76-112.5C167.3 606.2 158 559.9 158 512s9.4-94.2 27.8-137.8c17.8-42.1 43.4-80 76-112.5s70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 7.9 7.9 15.3 16.1 22.4 24.5 3 3.7 7.6 5.8 12.3 5.8H868c6.3 0 10.2-7 6.7-12.3C798 160.5 663.8 81.6 511.3 82 271.7 82.6 79.6 277.1 82 516.4 84.4 751.9 276.2 942 512.4 942c152.1 0 285.7-78.8 362.3-197.7 3.4-5.3-.4-12.3-6.7-12.3zm88.9-226.3L815 393.7c-5.3-4.2-13-.4-13 6.3v76H488c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 0 0 0-12.6z"/>
              </svg>
            </el-icon>
            <span>Logout</span>
          </button>
        </div>
      </template>
    </el-drawer>

    <!-- Mobile Floating Buttons -->
    <template v-if="isMobile && session.isAuthenticated">
      <!-- Notification Floating Button -->
      <div class="mobile-floating-notification">
        <button
          @click="navigate('/dashboard/notifications')"
          :class="['mobile-notification-button', { 'notification-button-active': unreadCount > 0 }]"
          title="Notifications"
        >
          <el-icon><Bell /></el-icon>
          <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
        </button>
      </div>

      <!-- Message Floating Button -->
      <div v-if="!isOnMessagesPage" class="mobile-floating-message">
        <button
          @click="navigate('/messages')"
          :class="['mobile-messenger-button', { 'messenger-button-active': displayUnreadCount > 0 }]"
          title="Messages"
        >
          <el-icon><ChatDotRound /></el-icon>
          <span v-if="displayUnreadCount > 0" class="messenger-badge">{{ displayUnreadCount }}</span>
        </button>
      </div>
    </template>

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

    // Add message to chatBox messages array immediately
    const messageExists = chatBox.conversation.messages.some(m => m.id === message.id);
    if (!messageExists) {
      chatBox.conversation.messages.push(message);
    }

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

.messenger-button {
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

.messenger-button:hover {
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
  padding: 2px 20px;
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

.dropdown-item-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
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

.mobile-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-decoration: none;
}

.mobile-logo-img {
  width: 250px;
  max-height: 90px;
  object-fit: contain;
  max-width: 100%;
}

/* Mobile Account Drawer Styles */
.account-drawer-content {
  padding: 0;
}

.guest-message {
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
}

.guest-message p {
  color: #1f2937;
  font-size: 15px;
  margin: 0;
  font-weight: 500;
}

.mb-3 {
  margin-bottom: 16px !important;
}

.register-btn {
  background: white !important;
  border: 2px solid #2563eb !important;
  color: #2563eb !important;
  font-weight: 600 !important;
}

.register-btn:hover {
  background: #eff6ff !important;
  border-color: #1d4ed8 !important;
  color: #1d4ed8 !important;
}

.user-profile-section {
  display: flex;
  align-items: center;
  padding: 20px 0;
  gap: 16px;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.user-info {
  flex: 1;
}

.user-name-text {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.user-username {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.drawer-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
  margin: 16px 0;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  color: #1f2937;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.menu-item:hover {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #3b82f6;
  color: #2563eb;
  transform: translateX(4px);
}

.menu-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.logout-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

.logout-icon {
  font-size: 20px;
}

:deep(.mobile-account-drawer .el-drawer__header) {
  padding: 20px;
  margin-bottom: 0;
  border-bottom: 2px solid #e5e7eb;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

:deep(.mobile-account-drawer .el-drawer__title) {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

:deep(.mobile-account-drawer .el-drawer__body) {
  padding: 20px;
}

/* Mobile Floating Buttons */
.mobile-floating-notification {
  position: fixed;
  bottom: 24px;
  left: 20px;
  z-index: 999;
}

.mobile-notification-button {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 24px;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}

.mobile-notification-button:hover,
.mobile-notification-button:active,
.mobile-notification-button.notification-button-active {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.5);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.mobile-notification-button .notification-badge {
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

.mobile-floating-message {
  position: fixed;
  bottom: 24px;
  right: 20px;
  z-index: 998;
}

.mobile-messenger-button {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 24px;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}

.mobile-messenger-button:hover,
.mobile-messenger-button:active,
.mobile-messenger-button.messenger-button-active {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.5);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}


</style>
