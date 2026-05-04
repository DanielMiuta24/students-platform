/**
 * Lexical Editor JSON Format Types
 *
 * Lexical stores content as an EditorState serialized to JSON.
 * The root contains a "root" node with children nodes representing the content.
 */

export interface LexicalNode {
  type: string;
  version: number;
  [key: string]: any;
}

export interface LexicalTextNode extends LexicalNode {
  type: 'text';
  text: string;
  format?: number;
  style?: string;
  mode?: string;
  detail?: number;
}

export interface LexicalParagraphNode extends LexicalNode {
  type: 'paragraph';
  children: LexicalNode[];
  format?: string;
  indent?: number;
  direction?: 'ltr' | 'rtl';
}

export interface LexicalHeadingNode extends LexicalNode {
  type: 'heading';
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: LexicalNode[];
}

export interface LexicalListNode extends LexicalNode {
  type: 'list';
  listType: 'bullet' | 'number' | 'check';
  children: LexicalNode[];
  start?: number;
}

export interface LexicalListItemNode extends LexicalNode {
  type: 'listitem';
  children: LexicalNode[];
  checked?: boolean;
  value?: number;
}

export interface LexicalQuoteNode extends LexicalNode {
  type: 'quote';
  children: LexicalNode[];
}

export interface LexicalCodeNode extends LexicalNode {
  type: 'code';
  children: LexicalNode[];
  language?: string;
}

export interface LexicalLinkNode extends LexicalNode {
  type: 'link';
  url: string;
  children: LexicalNode[];
  title?: string;
  target?: string;
  rel?: string;
}

export interface LexicalRootNode extends LexicalNode {
  type: 'root';
  children: LexicalNode[];
  format?: string;
  indent?: number;
  direction?: 'ltr' | 'rtl';
}

export interface LexicalEditorState {
  root: LexicalRootNode;
}

/**
 * Post content can be either plain text or Lexical JSON format
 */
export type PostContent = string | LexicalEditorState;

/**
 * Type guard to check if content is Lexical format
 */
export function isLexicalContent(content: unknown): content is LexicalEditorState {
  return (
    typeof content === 'object' &&
    content !== null &&
    'root' in content &&
    typeof (content as any).root === 'object' &&
    (content as any).root.type === 'root' &&
    Array.isArray((content as any).root.children)
  );
}

/**
 * Type guard to check if content is plain text
 */
export function isPlainTextContent(content: unknown): content is string {
  return typeof content === 'string';
}
