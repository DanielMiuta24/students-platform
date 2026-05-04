import { ref, watch } from 'vue';
import { useEditor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import type { LexicalEditorState } from '../types/lexical';
import { useTiptapToLexical } from './useTiptapToLexical';

interface UseEditorSetupOptions {
  placeholder: string;
  maxLength: number;
  modelValue: LexicalEditorState | null;
  onUpdate: (value: LexicalEditorState) => void;
}

export function useEditorSetup(options: UseEditorSetupOptions) {
  const { tiptapToLexical } = useTiptapToLexical();
  const characterCount = ref(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: options.placeholder,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const lexicalFormat = tiptapToLexical(json);

      characterCount.value = editor.getText().length;

      options.onUpdate(lexicalFormat);
    },
  });

  const setLink = () => {
    if (!editor.value) return;

    const previousUrl = editor.value.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.value.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  watch(() => options.modelValue, (newValue) => {
    if (newValue === null && editor.value) {
      editor.value.commands.clearContent();
      characterCount.value = 0;
    }
  });

  return {
    editor,
    characterCount,
    setLink,
  };
}
