import { User, type UserDoc } from '../../user/models';
import type { FollowDTO, SafeFollow, FollowStats, PaginatedFollowResult } from '../types';
import { FOLLOW_ERROR } from '../constants';

export class FollowService {
  async follow(data: FollowDTO): Promise<void> {
    const { followerId, followingId } = data;

    if (followerId === followingId) {
      throw new Error(FOLLOW_ERROR.CANNOT_FOLLOW_SELF);
    }

    const [follower, following] = await Promise.all([
      User.findById(followerId),
      User.findById(followingId),
    ]);

    if (!follower || !following) {
      throw new Error(FOLLOW_ERROR.USER_NOT_FOUND);
    }

    if (follower.following.includes(followingId as any)) {
      throw new Error(FOLLOW_ERROR.ALREADY_FOLLOWING);
    }

    const [followerUpdate, followingUpdate] = await Promise.all([
      User.findByIdAndUpdate(
        followerId,
        { $addToSet: { following: followingId } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        followingId,
        { $addToSet: { followers: followerId } },
        { new: true }
      ),
    ]);

    if (!followerUpdate || !followingUpdate) {
      throw new Error(FOLLOW_ERROR.USER_NOT_FOUND);
    }
  }

  async unfollow(data: FollowDTO): Promise<void> {
    const { followerId, followingId } = data;

    if (followerId === followingId) {
      throw new Error(FOLLOW_ERROR.CANNOT_FOLLOW_SELF);
    }

    const [follower, following] = await Promise.all([
      User.findById(followerId),
      User.findById(followingId),
    ]);

    if (!follower || !following) {
      throw new Error(FOLLOW_ERROR.USER_NOT_FOUND);
    }

    if (!follower.following.includes(followingId as any)) {
      throw new Error(FOLLOW_ERROR.NOT_FOLLOWING);
    }

    const [followerUpdate, followingUpdate] = await Promise.all([
      User.findByIdAndUpdate(
        followerId,
        { $pull: { following: followingId } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        followingId,
        { $pull: { followers: followerId } },
        { new: true }
      ),
    ]);

    if (!followerUpdate || !followingUpdate) {
      throw new Error(FOLLOW_ERROR.USER_NOT_FOUND);
    }
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const user = await User.findById(followerId);
    if (!user) {
      return false;
    }
    return user.following.includes(followingId as any);
  }

  async checkMutualFollow(currentUserId: string, targetUserId: string): Promise<{ isFollowing: boolean; followsBack: boolean }> {
    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(targetUserId),
    ]);

    if (!currentUser || !targetUser) {
      return { isFollowing: false, followsBack: false };
    }

    const isFollowing = currentUser.following.includes(targetUserId as any);
    const followsBack = targetUser.following.includes(currentUserId as any);

    return { isFollowing, followsBack };
  }

  async getFollowers(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedFollowResult> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(FOLLOW_ERROR.USER_NOT_FOUND);
    }

    const skip = (page - 1) * limit;
    const total = user.followers.length;

    const followers = await User.find({
      _id: { $in: user.followers },
    })
      .select('name username avatar bio')
      .skip(skip)
      .limit(limit)
      .lean();

    const safeFollowers: SafeFollow[] = followers.map((follower: any) => ({
      id: follower._id.toString(),
      name: follower.name,
      username: follower.username,
      avatar: follower.avatar || '',
      bio: follower.bio || '',
    }));

    return {
      users: safeFollowers,
      total,
      page,
      limit,
      hasMore: skip + followers.length < total,
    };
  }

  async getFollowing(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedFollowResult> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(FOLLOW_ERROR.USER_NOT_FOUND);
    }

    const skip = (page - 1) * limit;
    const total = user.following.length;

    const following = await User.find({
      _id: { $in: user.following },
    })
      .select('name username avatar bio')
      .skip(skip)
      .limit(limit)
      .lean();

    const safeFollowing: SafeFollow[] = following.map((user: any) => ({
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      avatar: user.avatar || '',
      bio: user.bio || '',
    }));

    return {
      users: safeFollowing,
      total,
      page,
      limit,
      hasMore: skip + following.length < total,
    };
  }

  async getStats(userId: string): Promise<FollowStats> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(FOLLOW_ERROR.USER_NOT_FOUND);
    }

    return {
      followersCount: user.followers.length,
      followingCount: user.following.length,
    };
  }

  async getFriends(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedFollowResult> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(FOLLOW_ERROR.USER_NOT_FOUND);
    }

    const mutualFollows = await User.find({
      _id: { $in: user.following },
      following: userId,
    })
      .select('name username avatar bio')
      .lean();

    const total = mutualFollows.length;
    const skip = (page - 1) * limit;
    const paginatedFriends = mutualFollows.slice(skip, skip + limit);

    const safeFriends: SafeFollow[] = paginatedFriends.map((friend: any) => ({
      id: friend._id.toString(),
      name: friend.name,
      username: friend.username,
      avatar: friend.avatar || '',
      bio: friend.bio || '',
    }));

    return {
      users: safeFriends,
      total,
      page,
      limit,
      hasMore: skip + paginatedFriends.length < total,
    };
  }

  async getFriendIds(userId: string): Promise<string[]> {
    const user = await User.findById(userId).select('followers following');
    if (!user) {
      return [];
    }

    const followersSet = new Set(user.followers.map(id => id.toString()));
    const friendIds = user.following
      .map(id => id.toString())
      .filter(id => followersSet.has(id));

    return friendIds;
  }

  async getFollowingIds(userId: string): Promise<string[]> {
    const user = await User.findById(userId).select('following');
    if (!user) {
      return [];
    }
    return user.following.map(id => id.toString());
  }
}

export const followService = new FollowService();
