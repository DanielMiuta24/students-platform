import { Router } from 'express';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import { messageController } from '../controllers';

const router = Router();

router.post('/', authMiddleware, messageController.sendMessage.bind(messageController));

router.post('/typing', authMiddleware, messageController.notifyTyping.bind(messageController));

router.get('/search/conversations', authMiddleware, messageController.searchConversations.bind(messageController));

router.get('/search/users', authMiddleware, messageController.searchUsers.bind(messageController));

router.get('/conversations', authMiddleware, messageController.getConversations.bind(messageController));

router.get('/conversations/:userId', authMiddleware, messageController.getConversation.bind(messageController));

router.post('/conversations/:userId/read', authMiddleware, messageController.markConversationAsRead.bind(messageController));

router.delete('/conversations/:userId', authMiddleware, messageController.deleteConversation.bind(messageController));

router.get('/unread-count', authMiddleware, messageController.getUnreadCount.bind(messageController));

router.get('/:messageId', authMiddleware, messageController.getMessage.bind(messageController));

router.put('/:messageId', authMiddleware, messageController.updateMessage.bind(messageController));

router.delete('/:messageId', authMiddleware, messageController.deleteMessage.bind(messageController));

router.post('/:messageId/read', authMiddleware, messageController.markAsRead.bind(messageController));

export { router as messageRoutes };
