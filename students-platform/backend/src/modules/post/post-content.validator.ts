import { isLexicalContent, isPlainTextContent, type PostContent, type LexicalEditorState } from './post-content.types';
import { POST_VALIDATION } from './post.constants';

/**
 * Validates post content (plain text or Lexical JSON)
 */
export class ContentValidator {
  /**
   * Calculate content length
   * - For plain text: character count
   * - For Lexical: JSON string length
   */
  static getContentLength(content: PostContent): number {
    if (isPlainTextContent(content)) {
      return content.trim().length;
    }

    if (isLexicalContent(content)) {
      return JSON.stringify(content).length;
    }

    throw new Error('Invalid content format');
  }

  /**
   * Extract plain text from Lexical content for search/preview
   */
  static extractPlainText(content: PostContent): string {
    if (isPlainTextContent(content)) {
      return content;
    }

    if (isLexicalContent(content)) {
      return this.extractTextFromLexical(content);
    }

    return '';
  }

  /**
   * Recursively extract text from Lexical nodes
   */
  private static extractTextFromLexical(state: LexicalEditorState): string {
    const extractFromNode = (node: any): string => {
      if (node.type === 'text' && node.text) {
        return node.text;
      }

      if (node.children && Array.isArray(node.children)) {
        return node.children.map(extractFromNode).join(' ');
      }

      return '';
    };

    return extractFromNode(state.root).trim();
  }

  /**
   * Validate content structure and length
   */
  static validate(content: unknown): { valid: boolean; error?: string } {
    // Check if content exists
    if (!content) {
      return { valid: false, error: 'Content is required' };
    }

    // Validate plain text
    if (isPlainTextContent(content)) {
      const length = content.trim().length;

      if (length === 0) {
        return { valid: false, error: 'Content cannot be empty' };
      }

      if (length > POST_VALIDATION.CONTENT_MAX_LENGTH) {
        return {
          valid: false,
          error: `Content must not exceed ${POST_VALIDATION.CONTENT_MAX_LENGTH} characters`
        };
      }

      return { valid: true };
    }

    // Check if it's an object (potential Lexical content)
    if (typeof content === 'object' && content !== null) {
      // First validate the Lexical structure
      const structureValidation = this.validateLexicalStructure(content);
      if (!structureValidation.valid) {
        return structureValidation;
      }

      // If structure is valid, check it with type guard
      if (isLexicalContent(content)) {
        const length = JSON.stringify(content).length;
        if (length > POST_VALIDATION.CONTENT_MAX_LENGTH) {
          return {
            valid: false,
            error: `Content must not exceed ${POST_VALIDATION.CONTENT_MAX_LENGTH} characters`
          };
        }

        const plainText = this.extractPlainText(content);
        if (!plainText || plainText.length === 0) {
          return { valid: false, error: 'Content cannot be empty' };
        }

        return { valid: true };
      }
    }

    return { valid: false, error: 'Content must be a string or valid Lexical JSON format' };
  }

  /**
   * Validate Lexical JSON structure
   */
  private static validateLexicalStructure(content: any): { valid: boolean; error?: string } {
    if (!content.root) {
      return { valid: false, error: 'Lexical content must have a root node' };
    }

    if (content.root.type !== 'root') {
      return { valid: false, error: 'Root node must have type "root"' };
    }

    if (!Array.isArray(content.root.children)) {
      return { valid: false, error: 'Root node must have a children array' };
    }

    // Validate node types are recognized (no embedded images - use separate upload field)
    const validNodeTypes = [
      'text',
      'paragraph',
      'heading',
      'list',
      'listitem',
      'quote',
      'code',
      'link',
      'linebreak',
      'tab',
    ];

    const validateNode = (node: any, path: string): { valid: boolean; error?: string } => {
      if (!node.type || typeof node.type !== 'string') {
        return { valid: false, error: `Invalid node type at ${path}` };
      }

      if (!validNodeTypes.includes(node.type)) {
        return { valid: false, error: `Unsupported node type "${node.type}" at ${path}` };
      }

      // Validate children recursively
      if (node.children && Array.isArray(node.children)) {
        for (let i = 0; i < node.children.length; i++) {
          const childValidation = validateNode(node.children[i], `${path}.children[${i}]`);
          if (!childValidation.valid) {
            return childValidation;
          }
        }
      }

      // Validate specific node requirements
      if (node.type === 'text' && typeof node.text !== 'string') {
        return { valid: false, error: `Text node must have a text string at ${path}` };
      }

      if (node.type === 'link' && (!node.url || typeof node.url !== 'string')) {
        return { valid: false, error: `Link node must have a URL at ${path}` };
      }

      return { valid: true };
    };

    for (let i = 0; i < content.root.children.length; i++) {
      const nodeValidation = validateNode(content.root.children[i], `root.children[${i}]`);
      if (!nodeValidation.valid) {
        return nodeValidation;
      }
    }

    return { valid: true };
  }
}
