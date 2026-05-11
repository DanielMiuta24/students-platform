<template>
  <div
    v-if="show"
    :style="{ top: `${position.y}px`, left: `${position.x}px` }"
    class="message-context-menu"
    @click.stop
  >
    <button
      v-if="canDeleteForEveryone"
      @click="$emit('delete-for-everyone')"
      class="menu-item delete-everyone"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      <span>Delete for Everyone</span>
    </button>
    <button
      @click="$emit('delete-for-me')"
      class="menu-item delete-me"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      <span>Delete for Me</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Position {
  x: number;
  y: number;
}

defineProps<{
  show: boolean;
  position: Position;
  canDeleteForEveryone: boolean;
}>();

defineEmits<{
  (e: 'delete-for-everyone'): void;
  (e: 'delete-for-me'): void;
}>();
</script>

<style scoped>
.message-context-menu {
  position: fixed;
  z-index: 1000;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  padding: 4px;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f3f4f6;
}

.menu-item.delete-everyone {
  color: #dc2626;
}

.menu-item.delete-everyone:hover {
  background-color: #fee2e2;
}

.menu-item.delete-me {
  color: #6b7280;
}

.icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>
