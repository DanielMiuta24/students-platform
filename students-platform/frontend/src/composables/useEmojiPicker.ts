import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue';
import type { Editor } from '@tiptap/vue-3';

export function useEmojiPicker(editorRef: Ref<Editor | null>) {
  const showEmojiPicker = ref(false);
  const emojiButton = ref<HTMLElement | null>(null);
  const emojiPickerRef = ref<HTMLElement | null>(null);

  const emojiList = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
    '🤧', '🥵', '🥶', '😶‍🌫️', '🥴', '😵', '🤯', '🤠', '🥳', '😎',
    '👍', '👎', '👏', '🙌', '👋', '🤝', '🙏', '💪', '🎉', '🎊',
    '❤️', '💕', '💖', '💗', '💙', '💚', '💛', '🧡', '💜', '🖤',
    '🔥', '⭐', '✨', '💯', '✅', '❌', '⚠️', '📌', '🎯', '💡',
  ];

  const toggleEmojiPicker = () => {
    showEmojiPicker.value = !showEmojiPicker.value;
  };

  const insertEmoji = (emoji: string) => {
    if (!editorRef.value) return;

    editorRef.value.chain().focus().insertContent(emoji).run();
    showEmojiPicker.value = false;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      showEmojiPicker.value &&
      emojiPickerRef.value &&
      emojiButton.value &&
      !emojiPickerRef.value.contains(event.target as Node) &&
      !emojiButton.value.contains(event.target as Node)
    ) {
      showEmojiPicker.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return {
    showEmojiPicker,
    emojiButton,
    emojiPickerRef,
    emojiList,
    toggleEmojiPicker,
    insertEmoji,
  };
}
