import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { messageService } from '../services';
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from '../constants';
import type { CreateMessageDTO, UpdateMessageDTO } from '../types';

class MessageController {
  async sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const dto: CreateMessageDTO = {
        recipientId: req.body.recipientId,
        content: req.body.content,
        attachments: req.body.attachments,
      };

      const message = await messageService.createMessage(dto, userId);

      res.status(201).json({
        message: MESSAGE_SUCCESS.CREATED,
        data: message,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === MESSAGE_ERROR.RECIPIENT_NOT_FOUND) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (
          error.message === MESSAGE_ERROR.INVALID_RECIPIENT ||
          error.message === MESSAGE_ERROR.CONTENT_REQUIRED ||
          error.message === MESSAGE_ERROR.CONTENT_TOO_LONG ||
          error.message === MESSAGE_ERROR.CANNOT_MESSAGE_SELF
        ) {
          res.status(400).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  async getMessage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const messageId = req.params.messageId;

      const message = await messageService.getMessage(messageId, userId);

      res.status(200).json({ data: message });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === MESSAGE_ERROR.NOT_FOUND) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message === MESSAGE_ERROR.UNAUTHORIZED) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  async getConversation(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const otherUserId = req.params.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await messageService.getConversation(userId, otherUserId, page, limit);

      res.status(200).json({ data: result });
    } catch (error) {
      if (error instanceof Error && error.message === MESSAGE_ERROR.INVALID_RECIPIENT) {
        res.status(400).json({ error: error.message });
        return;
      }
      next(error);
    }
  }

  async getConversations(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const result = await messageService.getConversations(userId);

      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateMessage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const messageId = req.params.messageId;
      const dto: UpdateMessageDTO = {
        content: req.body.content,
      };

      const message = await messageService.updateMessage(messageId, dto, userId);

      res.status(200).json({
        message: MESSAGE_SUCCESS.UPDATED,
        data: message,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === MESSAGE_ERROR.NOT_FOUND) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message === MESSAGE_ERROR.UNAUTHORIZED) {
          res.status(403).json({ error: error.message });
          return;
        }
        if (
          error.message === MESSAGE_ERROR.CONTENT_REQUIRED ||
          error.message === MESSAGE_ERROR.CONTENT_TOO_LONG ||
          error.message === MESSAGE_ERROR.EDIT_TIME_EXPIRED
        ) {
          res.status(400).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  async deleteMessage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const messageId = req.params.messageId;
      const deleteFor = (req.body.deleteFor || 'me') as 'me' | 'everyone';

      await messageService.deleteMessage(messageId, userId, deleteFor);

      res.status(200).json({
        message: MESSAGE_SUCCESS.DELETED,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === MESSAGE_ERROR.NOT_FOUND) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message === MESSAGE_ERROR.UNAUTHORIZED) {
          res.status(403).json({ error: error.message });
          return;
        }
        if (error.message === MESSAGE_ERROR.DELETE_FOR_EVERYONE_EXPIRED) {
          res.status(400).json({ error: error.message });
          return;
        }
        if (error.message === MESSAGE_ERROR.INVALID_DELETE_TYPE) {
          res.status(400).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const messageId = req.params.messageId;

      await messageService.markAsRead(messageId, userId);

      res.status(200).json({
        message: MESSAGE_SUCCESS.MARKED_AS_READ,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === MESSAGE_ERROR.NOT_FOUND) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message === MESSAGE_ERROR.UNAUTHORIZED) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  async markConversationAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const otherUserId = req.params.userId;

      const count = await messageService.markConversationAsRead(userId, otherUserId);

      res.status(200).json({
        message: MESSAGE_SUCCESS.MARKED_AS_READ,
        data: { count },
      });
    } catch (error) {
      if (error instanceof Error && error.message === MESSAGE_ERROR.INVALID_RECIPIENT) {
        res.status(400).json({ error: error.message });
        return;
      }
      next(error);
    }
  }

  async getUnreadCount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const count = await messageService.getUnreadCount(userId);

      res.status(200).json({ data: { count } });
    } catch (error) {
      next(error);
    }
  }

  async searchConversations(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const query = req.query.q as string;

      if (!query || query.trim().length === 0) {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const results = await messageService.searchConversations(userId, query);

      res.status(200).json({ data: results });
    } catch (error) {
      next(error);
    }
  }

  async searchUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const query = req.query.q as string;

      if (!query || query.trim().length === 0) {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const results = await messageService.searchUsers(userId, query);

      res.status(200).json({ data: results });
    } catch (error) {
      next(error);
    }
  }

  async deleteConversation(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const otherUserId = req.params.userId;

      await messageService.deleteConversation(userId, otherUserId);

      res.status(200).json({
        message: MESSAGE_SUCCESS.CONVERSATION_DELETED,
      });
    } catch (error) {
      if (error instanceof Error && error.message === MESSAGE_ERROR.INVALID_RECIPIENT) {
        res.status(400).json({ error: error.message });
        return;
      }
      next(error);
    }
  }

  async notifyTyping(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { recipientId, isTyping } = req.body;

      if (!recipientId) {
        res.status(400).json({ error: 'Recipient ID is required' });
        return;
      }

      messageService.broadcastTypingIndicator(
        userId,
        recipientId,
        req.user!.name,
        isTyping === true
      );

      res.status(200).json({ message: 'Typing status broadcasted' });
    } catch (error) {
      next(error);
    }
  }
}

export const messageController = new MessageController();
