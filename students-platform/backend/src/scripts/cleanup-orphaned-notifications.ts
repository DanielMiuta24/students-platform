import mongoose from 'mongoose';
import { NotificationModel } from '../modules/notification/models/notification.model';
import { PostModel } from '../modules/post/models/post.model';
import { CommentModel } from '../modules/comment/models/comment.model';
import { CommunityModel } from '../modules/community/models/community.model';
import { CommunityInvitationModel } from '../modules/community/models/community-invitation.model';
import { CommunityJoinRequestModel } from '../modules/community/models/community-join-request.model';
import { db } from '../config/db';

async function cleanupOrphanedNotifications() {
  try {
    console.log('🧹 Starting orphaned notifications cleanup...\n');

    await db.connect();
    console.log('✅ Connected to database\n');

    const notifications = await NotificationModel.find({})
      .select('_id target targetModel')
      .lean();

    console.log(`📊 Total notifications in database: ${notifications.length}\n`);

    let deletedCount = 0;
    const orphanedIds: mongoose.Types.ObjectId[] = [];

    console.log('🔍 Checking for orphaned notifications...\n');

    for (const notification of notifications) {
      let targetExists = false;

      try {
        switch (notification.targetModel) {
          case 'Post':
            targetExists = await PostModel.exists({ _id: notification.target }) !== null;
            break;
          case 'Comment':
            targetExists = await CommentModel.exists({ _id: notification.target }) !== null;
            break;
          case 'Community':
            targetExists = await CommunityModel.exists({ _id: notification.target }) !== null;
            break;
          case 'CommunityInvitation':
            targetExists = await CommunityInvitationModel.exists({ _id: notification.target }) !== null;
            break;
          case 'CommunityJoinRequest':
            targetExists = await CommunityJoinRequestModel.exists({ _id: notification.target }) !== null;
            break;
          case 'User':
          case 'Message':
            // Skip User and Message for now as they might be in different collections
            targetExists = true;
            break;
          default:
            console.warn(`⚠️  Unknown targetModel: ${notification.targetModel}`);
            targetExists = true;
        }

        if (!targetExists) {
          console.log(`🗑️  Found orphaned notification: ${notification._id} (target: ${notification.target}, model: ${notification.targetModel})`);
          orphanedIds.push(notification._id);
        }
      } catch (error: any) {
        console.error(`❌ Error checking notification ${notification._id}:`, error.message);
      }
    }

    if (orphanedIds.length === 0) {
      console.log('\n✅ No orphaned notifications found. Database is clean!\n');
    } else {
      console.log(`\n📊 Found ${orphanedIds.length} orphaned notifications\n`);
      console.log('🗑️  Deleting orphaned notifications...');

      const result = await NotificationModel.deleteMany({ _id: { $in: orphanedIds } });
      deletedCount = result.deletedCount || 0;

      console.log(`✅ Deleted ${deletedCount} orphaned notifications\n`);
    }

    console.log('📊 Cleanup Summary:');
    console.log(`   Total checked:      ${notifications.length}`);
    console.log(`   Orphaned found:     ${orphanedIds.length}`);
    console.log(`   Successfully deleted: ${deletedCount}\n`);

    if (deletedCount > 0) {
      console.log('✨ Cleanup completed successfully!\n');
    }

  } catch (error: any) {
    console.error('\n❌ Cleanup failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await db.disconnect();
    console.log('👋 Disconnected from database');
  }
}

if (require.main === module) {
  cleanupOrphanedNotifications()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

export { cleanupOrphanedNotifications };
