import { Types } from 'mongoose';
import { MESSAGE_ERROR, MESSAGE_VALIDATION } from '../constants';
import type { CreateMessageDTO, UpdateMessageDTO } from '../types';
import type { AttachmentMeta } from '../../../shared/types/files';

export class MessageValidator {
  static validateContent(content: string): void {
    if (!content || content.trim().length === 0) {
      throw new Error(MESSAGE_ERROR.CONTENT_REQUIRED);
    }

    if (content.length > MESSAGE_VALIDATION.CONTENT_MAX_LENGTH) {
      throw new Error(MESSAGE_ERROR.CONTENT_TOO_LONG);
    }
  }

  static validateRecipientId(recipientId: string): void {
    if (!Types.ObjectId.isValid(recipientId)) {
      throw new Error(MESSAGE_ERROR.INVALID_RECIPIENT);
    }
  }

  static validateNotSelf(senderId: string, recipientId: string): void {
    if (senderId === recipientId) {
      throw new Error(MESSAGE_ERROR.CANNOT_MESSAGE_SELF);
    }
  }

  static validateAttachments(attachments?: AttachmentMeta[]): void {
    if (!attachments || attachments.length === 0) {
      return;
    }

    if (attachments.length > MESSAGE_VALIDATION.MAX_ATTACHMENTS) {
      throw new Error(`Maximum ${MESSAGE_VALIDATION.MAX_ATTACHMENTS} attachments allowed`);
    }

    for (const attachment of attachments) {
      if (!attachment.filename || !attachment.mimeType || !attachment.storageUrl) {
        throw new Error(MESSAGE_ERROR.INVALID_ATTACHMENT);
      }

      if (typeof attachment.sizeBytes !== 'number' || attachment.sizeBytes < 0) {
        throw new Error(MESSAGE_ERROR.INVALID_ATTACHMENT);
      }
    }
  }

  static validateCreateDTO(dto: CreateMessageDTO, senderId: string): void {
    this.validateContent(dto.content);
    this.validateRecipientId(dto.recipientId);
    this.validateNotSelf(senderId, dto.recipientId);
    this.validateAttachments(dto.attachments);
  }

  static validateUpdateDTO(dto: UpdateMessageDTO): void {
    this.validateContent(dto.content);
  }

  static validateObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  static validatePagination(page: number = 1, limit: number = 20): { page: number; limit: number } {
    const validPage = Math.max(1, Math.floor(page));
    const validLimit = Math.min(100, Math.max(1, Math.floor(limit)));

    return { page: validPage, limit: validLimit };
  }
}
