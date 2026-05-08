import type { LexicalEditorState } from '../types/lexical';

export function useLexicalToTiptap() {
  const convertNode = (node: any): any => {
    if (node.type === 'text') {
      const marks: any[] = [];

      // Convert format flags to marks
      if (node.format & 1) marks.push({ type: 'bold' });
      if (node.format & 2) marks.push({ type: 'italic' });
      if (node.format & 8) marks.push({ type: 'underline' });

      return {
        type: 'text',
        text: node.text || '',
        marks: marks.length > 0 ? marks : undefined,
      };
    }

    if (node.type === 'heading') {
      const level = parseInt(node.tag?.replace('h', '') || '1');
      return {
        type: 'heading',
        attrs: { level },
        content: node.children ? node.children.map(convertNode).filter(Boolean) : [],
      };
    }

    if (node.type === 'list') {
      const listType = node.listType === 'bullet' ? 'bulletList' : 'orderedList';
      return {
        type: listType,
        attrs: node.listType === 'number' ? { start: node.start || 1 } : undefined,
        content: node.children ? node.children.map(convertNode).filter(Boolean) : [],
      };
    }

    if (node.type === 'listitem') {
      return {
        type: 'listItem',
        content: node.children ? node.children.map(convertNode).filter(Boolean) : [],
      };
    }

    if (node.type === 'quote') {
      return {
        type: 'blockquote',
        content: node.children ? node.children.map(convertNode).filter(Boolean) : [],
      };
    }

    if (node.type === 'code') {
      return {
        type: 'codeBlock',
        content: node.children ? node.children.map(convertNode).filter(Boolean) : [],
      };
    }

    // Default to paragraph
    if (node.type === 'paragraph' || node.type === 'root') {
      const result: any = {
        type: node.type === 'root' ? 'doc' : 'paragraph',
      };

      if (node.children && node.children.length > 0) {
        result.content = node.children.map(convertNode).filter(Boolean);
      }

      return result;
    }

    return null;
  };

  const lexicalToTiptap = (lexicalState: LexicalEditorState | null): any => {
    if (!lexicalState || !lexicalState.root) {
      return {
        type: 'doc',
        content: [{
          type: 'paragraph',
          content: [],
        }],
      };
    }

    const root = lexicalState.root;
    const children = root.children || [];

    return {
      type: 'doc',
      content: children.length > 0
        ? children.map(convertNode).filter(Boolean)
        : [{ type: 'paragraph', content: [] }],
    };
  };

  return {
    lexicalToTiptap,
  };
}
