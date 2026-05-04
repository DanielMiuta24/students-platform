import { ContentValidator } from '../../../modules/post/validators/post-content.validator';
import { isLexicalContent, isPlainTextContent, type LexicalEditorState } from '../../../modules/post/types/post-content.types';

describe('ContentValidator', () => {
  describe('Plain Text Validation', () => {
    it('should validate plain text content', () => {
      const content = 'This is a simple post content';
      const result = ContentValidator.validate(content);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty plain text', () => {
      const content = '   ';
      const result = ContentValidator.validate(content);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Content cannot be empty');
    });

    it('should reject plain text exceeding max length', () => {
      const content = 'a'.repeat(50001);
      const result = ContentValidator.validate(content);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('must not exceed');
    });

    it('should calculate correct length for plain text', () => {
      const content = 'Hello World';
      const length = ContentValidator.getContentLength(content);

      expect(length).toBe(11);
    });

    it('should extract plain text from plain text content', () => {
      const content = 'Hello World';
      const text = ContentValidator.extractPlainText(content);

      expect(text).toBe('Hello World');
    });
  });

  describe('Lexical JSON Validation', () => {
    it('should validate valid Lexical content', () => {
      const content: LexicalEditorState = {
        root: {
          type: 'root',
          version: 1,
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  version: 1,
                  text: 'Hello World',
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                },
              ],
            },
          ],
        },
      };

      const result = ContentValidator.validate(content);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate Lexical content with headings', () => {
      const content: LexicalEditorState = {
        root: {
          type: 'root',
          version: 1,
          children: [
            {
              type: 'heading',
              version: 1,
              tag: 'h1',
              children: [
                {
                  type: 'text',
                  version: 1,
                  text: 'My Heading',
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                },
              ],
            },
          ],
        },
      };

      const result = ContentValidator.validate(content);

      expect(result.valid).toBe(true);
    });

    it('should validate Lexical content with lists', () => {
      const content: LexicalEditorState = {
        root: {
          type: 'root',
          version: 1,
          children: [
            {
              type: 'list',
              version: 1,
              listType: 'bullet',
              children: [
                {
                  type: 'listitem',
                  version: 1,
                  children: [
                    {
                      type: 'text',
                      version: 1,
                      text: 'Item 1',
                      format: 0,
                      detail: 0,
                      mode: 'normal',
                      style: '',
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      const result = ContentValidator.validate(content);

      expect(result.valid).toBe(true);
    });

    it('should validate Lexical content with links', () => {
      const content: LexicalEditorState = {
        root: {
          type: 'root',
          version: 1,
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'link',
                  version: 1,
                  url: 'https://example.com',
                  children: [
                    {
                      type: 'text',
                      version: 1,
                      text: 'Click here',
                      format: 0,
                      detail: 0,
                      mode: 'normal',
                      style: '',
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      const result = ContentValidator.validate(content);

      expect(result.valid).toBe(true);
    });

    it('should reject Lexical content without root', () => {
      const content = { notRoot: {} };

      const result = ContentValidator.validate(content);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Lexical content must have a root node');
    });

    it('should reject Lexical content with invalid root type', () => {
      const content = {
        root: {
          type: 'paragraph',
          version: 1,
          children: [],
        },
      };

      const result = ContentValidator.validate(content);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Root node must have type "root"');
    });

    it('should reject Lexical content without children array', () => {
      const content = {
        root: {
          type: 'root',
          version: 1,
        },
      };

      const result = ContentValidator.validate(content);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Root node must have a children array');
    });

    it('should reject Lexical content with unsupported node type', () => {
      const content: any = {
        root: {
          type: 'root',
          version: 1,
          children: [
            {
              type: 'unsupported-node',
              version: 1,
            },
          ],
        },
      };

      const result = ContentValidator.validate(content);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported node type');
    });

    it('should reject Lexical content with text node missing text', () => {
      const content: any = {
        root: {
          type: 'root',
          version: 1,
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  version: 1,
                  format: 0,
                },
              ],
            },
          ],
        },
      };

      const result = ContentValidator.validate(content);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Text node must have a text string');
    });

    it('should reject Lexical content with link node missing url', () => {
      const content: any = {
        root: {
          type: 'root',
          version: 1,
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'link',
                  version: 1,
                  children: [],
                },
              ],
            },
          ],
        },
      };

      const result = ContentValidator.validate(content);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Link node must have a URL');
    });

    it('should reject empty Lexical content', () => {
      const content: LexicalEditorState = {
        root: {
          type: 'root',
          version: 1,
          children: [],
        },
      };

      const result = ContentValidator.validate(content);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Content cannot be empty');
    });

    it('should extract plain text from Lexical content', () => {
      const content: LexicalEditorState = {
        root: {
          type: 'root',
          version: 1,
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  version: 1,
                  text: 'First paragraph',
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                },
              ],
            },
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  version: 1,
                  text: 'Second paragraph',
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                },
              ],
            },
          ],
        },
      };

      const text = ContentValidator.extractPlainText(content);

      expect(text).toContain('First paragraph');
      expect(text).toContain('Second paragraph');
    });

    it('should calculate correct length for Lexical content', () => {
      const content: LexicalEditorState = {
        root: {
          type: 'root',
          version: 1,
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  version: 1,
                  text: 'Hello',
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                },
              ],
            },
          ],
        },
      };

      const length = ContentValidator.getContentLength(content);

      expect(length).toBe(JSON.stringify(content).length);
    });
  });

  describe('Type Guards', () => {
    it('should identify plain text content', () => {
      expect(isPlainTextContent('Hello')).toBe(true);
      expect(isPlainTextContent({ root: {} })).toBe(false);
    });

    it('should identify Lexical content', () => {
      const content: LexicalEditorState = {
        root: {
          type: 'root',
          version: 1,
          children: [],
        },
      };

      expect(isLexicalContent(content)).toBe(true);
      expect(isLexicalContent('Hello')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should reject null content', () => {
      const result = ContentValidator.validate(null);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Content is required');
    });

    it('should reject undefined content', () => {
      const result = ContentValidator.validate(undefined);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Content is required');
    });

    it('should reject number content', () => {
      const result = ContentValidator.validate(123);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Content must be a string or valid Lexical JSON format');
    });

    it('should reject array content', () => {
      const result = ContentValidator.validate([]);

      expect(result.valid).toBe(false);
    });
  });
});
