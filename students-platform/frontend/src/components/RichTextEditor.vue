<template>
  <div class="rich-text-editor-wrapper">
    <div v-if="editor" class="editor-toolbar">
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        class="toolbar-button"
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        class="toolbar-button"
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
        class="toolbar-button"
        title="Strikethrough"
      >
        <s>S</s>
      </button>

      <div class="toolbar-divider"></div>

      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        class="toolbar-button"
        title="Heading 1"
      >
        H1
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        class="toolbar-button"
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        class="toolbar-button"
        title="Heading 3"
      >
        H3
      </button>

      <div class="toolbar-divider"></div>

      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        class="toolbar-button"
        title="Bullet List"
      >
        •
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        class="toolbar-button"
        title="Numbered List"
      >
        1.
      </button>

      <div class="toolbar-divider"></div>

      <button
        type="button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        class="toolbar-button"
        title="Quote"
      >
        "
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        class="toolbar-button"
        title="Code Block"
      >
        &lt;/&gt;
      </button>

      <div class="toolbar-divider"></div>

      <button
        type="button"
        @click="setLink"
        :class="{ 'is-active': editor.isActive('link') }"
        class="toolbar-button"
        title="Add Link"
      >
        🔗
      </button>

      <div class="toolbar-divider"></div>

      <button
        type="button"
        @click="toggleEmojiPicker"
        class="toolbar-button"
        title="Add Emoji"
        ref="emojiButton"
      >
        😀
      </button>
    </div>

    <!-- Emoji Picker Popup -->
    <div v-if="showEmojiPicker" class="emoji-picker-wrapper" ref="emojiPickerRef">
      <div class="emoji-picker-header">
        <span>Pick an emoji</span>
        <button type="button" @click="showEmojiPicker = false" class="emoji-picker-close">✕</button>
      </div>
      <div class="emoji-picker-content">
        <button
          v-for="emoji in emojiList"
          :key="emoji"
          type="button"
          @click="insertEmoji(emoji)"
          class="emoji-button"
        >
          {{ emoji }}
        </button>
      </div>
    </div>

    <editor-content :editor="editor" class="editor-content" />

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="character-count" :class="{ 'count-warning': isNearLimit, 'count-error': isOverLimit }">
      {{ characterCount }} / {{ maxLength }} characters
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue';
import { EditorContent } from '@tiptap/vue-3';
import type { LexicalEditorState } from '../types/lexical';
import { useEditorSetup } from '../composables/useEditorSetup';
import { useEmojiPicker } from '../composables/useEmojiPicker';

interface Props {
  modelValue?: LexicalEditorState | null;
  placeholder?: string;
  maxLength?: number;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Start typing...',
  maxLength: 5000,
  error: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: LexicalEditorState];
  'change': [value: LexicalEditorState];
}>();

const handleUpdate = (value: LexicalEditorState) => {
  emit('update:modelValue', value);
  emit('change', value);
};

const { editor, characterCount, setLink } = useEditorSetup({
  placeholder: props.placeholder,
  maxLength: props.maxLength,
  modelValue: props.modelValue,
  onUpdate: handleUpdate,
});

const {
  showEmojiPicker,
  emojiButton,
  emojiPickerRef,
  emojiList,
  toggleEmojiPicker,
  insertEmoji,
} = useEmojiPicker(editor);

const isNearLimit = computed(() => characterCount.value > props.maxLength * 0.9);
const isOverLimit = computed(() => characterCount.value > props.maxLength);

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<style scoped>
.rich-text-editor-wrapper {
  position: relative;
}

.editor-toolbar {
  display: flex;
  gap: 4px;
  padding: 8px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  flex-wrap: wrap;
}

.toolbar-button {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  min-width: 36px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.toolbar-button.is-active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.toolbar-divider {
  width: 1px;
  background: #d1d5db;
  margin: 0 4px;
}

.emoji-picker-wrapper {
  position: absolute;
  top: 60px;
  right: 0;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  width: 320px;
  max-height: 300px;
  display: flex;
  flex-direction: column;
}

.emoji-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
}

.emoji-picker-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #6b7280;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.emoji-picker-close:hover {
  background: #f3f4f6;
}

.emoji-picker-content {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
  padding: 12px;
  overflow-y: auto;
  max-height: 240px;
}

.emoji-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
}

.emoji-button:hover {
  background: #f3f4f6;
  transform: scale(1.2);
}

:deep(.editor-content) {
  border: 2px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 8px 8px;
  background: white;
  transition: border-color 0.2s;
}

:deep(.editor-content:focus-within) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.ProseMirror) {
  min-height: 200px;
  padding: 12px 16px;
  outline: none;
  font-size: 16px;
  line-height: 1.6;
  color: #1f2937;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #9ca3af;
  pointer-events: none;
  height: 0;
}

:deep(.ProseMirror p) {
  margin: 0 0 8px 0;
}

:deep(.ProseMirror h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 16px 0 8px 0;
}

:deep(.ProseMirror h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 14px 0 6px 0;
}

:deep(.ProseMirror h3) {
  font-size: 1.25em;
  font-weight: bold;
  margin: 12px 0 4px 0;
}

:deep(.ProseMirror blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 16px;
  margin: 12px 0;
  color: #6b7280;
  font-style: italic;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  margin: 8px 0;
  padding-left: 24px;
}

:deep(.ProseMirror li) {
  margin: 4px 0;
}

:deep(.ProseMirror a) {
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
}

:deep(.ProseMirror a:hover) {
  color: #2563eb;
}

:deep(.ProseMirror code) {
  background-color: #f3f4f6;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

:deep(.ProseMirror pre) {
  background-color: #1f2937;
  color: #f3f4f6;
  padding: 12px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  overflow-x: auto;
  margin: 8px 0;
}

:deep(.ProseMirror pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

.error-message {
  margin-top: 6px;
  font-size: 14px;
  color: #ef4444;
}

.character-count {
  margin-top: 6px;
  font-size: 13px;
  color: #6b7280;
  text-align: right;
}

.character-count.count-warning {
  color: #f59e0b;
}

.character-count.count-error {
  color: #ef4444;
  font-weight: 600;
}
</style>
