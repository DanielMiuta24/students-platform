import type { LexicalEditorState } from '../types/lexical';

export function useTiptapToLexical() {
  const getTextFormat = (marks: any[]): number => {
    if (!marks || marks.length === 0) return 0;
    let format = 0;
    marks.forEach(mark => {
      if (mark.type === 'bold') format |= 1;
      if (mark.type === 'italic') format |= 2;
      if (mark.type === 'underline') format |= 8;
    });
    return format;
  };

  const convertNode = (node: any): any => {
    if (node.type === 'text') {
      return {
        type: 'text',
        version: 1,
        text: node.text || '',
        format: getTextFormat(node.marks),
        mode: 'normal',
        detail: 0,
      };
    }

    if (node.type === 'heading') {
      return {
        type: 'heading',
        version: 1,
        tag: `h${node.attrs.level}`,
        children: node.content ? node.content.map(convertNode) : [],
        format: '',
        indent: 0,
        direction: 'ltr',
      };
    }

    if (node.type === 'bulletList') {
      return {
        type: 'list',
        version: 1,
        listType: 'bullet',
        children: node.content ? node.content.map(convertNode) : [],
        format: '',
        indent: 0,
        direction: 'ltr',
      };
    }

    if (node.type === 'orderedList') {
      return {
        type: 'list',
        version: 1,
        listType: 'number',
        start: node.attrs?.start || 1,
        children: node.content ? node.content.map(convertNode) : [],
        format: '',
        indent: 0,
        direction: 'ltr',
      };
    }

    if (node.type === 'listItem') {
      return {
        type: 'listitem',
        version: 1,
        children: node.content ? node.content.map(convertNode) : [],
        format: '',
        indent: 0,
        direction: 'ltr',
      };
    }

    if (node.type === 'blockquote') {
      return {
        type: 'quote',
        version: 1,
        children: node.content ? node.content.map(convertNode) : [],
        format: '',
        indent: 0,
        direction: 'ltr',
      };
    }

    if (node.type === 'codeBlock') {
      return {
        type: 'code',
        version: 1,
        children: node.content ? node.content.map(convertNode) : [],
        format: '',
        indent: 0,
        direction: 'ltr',
      };
    }

    return {
      type: 'paragraph',
      version: 1,
      children: node.content ? node.content.map(convertNode) : [],
      format: '',
      indent: 0,
      direction: 'ltr',
    };
  };

  const tiptapToLexical = (tiptapJSON: any): LexicalEditorState => {
    const children = tiptapJSON?.content ? tiptapJSON.content.map(convertNode) : [];

    return {
      root: {
        type: 'root',
        version: 1,
        children: children.length > 0 ? children : [{
          type: 'paragraph',
          version: 1,
          children: [],
          format: '',
          indent: 0,
          direction: 'ltr',
        }],
        format: '',
        indent: 0,
        direction: 'ltr',
      },
    };
  };

  return {
    tiptapToLexical,
  };
}
