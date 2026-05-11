<template>
  <div class="conversation-list-wrapper">
    <!-- Header with title and + button -->
    <div v-if="showHeader" class="conversation-list-header">
      <div class="header-title-row">
        <h3 class="header-title">{{ title }}</h3>
        <button
          v-if="showNewButton"
          @click="$emit('new-conversation')"
          class="new-conversation-button"
          title="New conversation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="icon-plus" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Search bar -->
      <div v-if="showSearch" class="search-container">
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="text"
          :placeholder="searchPlaceholder"
          class="search-input"
        />
        <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Filter tabs -->
      <div v-if="showFilter" class="filter-tabs">
        <button
          @click="$emit('update:filter', 'all')"
          class="filter-tab"
          :class="{ 'active': filter === 'all' }"
        >
          All
        </button>
        <button
          @click="$emit('update:filter', 'unread')"
          class="filter-tab"
          :class="{ 'active': filter === 'unread' }"
        >
          Unread
        </button>
      </div>
    </div>

    <!-- Conversation list -->
    <div class="conversation-list">
      <div
        v-for="conversation in conversations"
        :key="conversation.userId"
        class="conversation-item"
        :class="{ 'selected': selectedConversationId === conversation.userId, 'unread': conversation.unreadCount > 0 }"
        @click="$emit('select', conversation)"
      >
        <div class="avatar-container">
          <img
            :src="getAvatarUrl(conversation.user.name, conversation.user.profilePicture)"
            alt="Profile"
            class="conversation-avatar"
          />
          <span v-if="conversation.user.isOnline" class="online-status"></span>
        </div>
        <div class="conversation-info">
          <div class="conversation-name">
            {{ conversation.user.name }}
            <span v-if="conversation.unreadCount > 0" class="unread-badge"></span>
          </div>
          <div class="conversation-message">{{ conversation.latestMessage?.content || 'No messages yet' }}</div>
        </div>
      </div>
      <div v-if="conversations.length === 0" class="no-messages">
        {{ emptyMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { getAvatarUrl } from '../utils/avatar';

interface Message {
  id: string;
  content: string;
  [key: string]: any;
}

interface Conversation {
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    profilePicture: string | null;
    isOnline?: boolean;
  };
  latestMessage: Message | null;
  unreadCount: number;
  lastActivity: string;
}

defineProps<{
  conversations: Conversation[];
  selectedConversationId?: string;
  emptyMessage?: string;
  showHeader?: boolean;
  title?: string;
  showNewButton?: boolean;
  showSearch?: boolean;
  searchQuery?: string;
  searchPlaceholder?: string;
  showFilter?: boolean;
  filter?: string;
}>();

defineEmits<{
  (e: 'select', conversation: Conversation): void;
  (e: 'new-conversation'): void;
  (e: 'update:searchQuery', value: string): void;
  (e: 'update:filter', value: string): void;
}>();
</script>

<style scoped>
.conversation-list-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.conversation-list-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.header-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.header-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.new-conversation-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.new-conversation-button:hover {
  background-color: #1d4ed8;
}

.icon-plus {
  width: 16px;
  height: 16px;
}

.search-container {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.filter-tab {
  flex: 1;
  padding: 8px 16px;
  border: none;
  background-color: #f3f4f6;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  background-color: #e5e7eb;
}

.filter-tab.active {
  background-color: #2563eb;
  color: white;
}

.conversation-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.conversation-item:hover {
  background-color: #f3f4f6;
}

.conversation-item.selected {
  background-color: #eff6ff;
}

.conversation-item.unread {
  background-color: #f0f9ff;
}

.conversation-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.avatar-container {
  position: relative;
  margin-right: 12px;
  flex-shrink: 0;
}

.online-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #10b981;
  border: 2px solid white;
  border-radius: 50%;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-name {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 8px;
}

.unread-badge {
  width: 8px;
  height: 8px;
  background-color: #2563eb;
  border-radius: 50%;
  flex-shrink: 0;
}

.conversation-message {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-item.unread .conversation-message {
  font-weight: 600;
  color: #1f2937;
}

.no-messages {
  padding: 32px 16px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}
</style>
