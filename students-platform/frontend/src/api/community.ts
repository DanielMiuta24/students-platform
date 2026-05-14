import type {
  SafeCommunity,
  CommunitiesResult,
  CommunityMembersResult,
  CreateCommunityPayload,
  UpdateCommunityPayload,
  InviteUsersPayload,
  SafeInvitation,
  SafeJoinRequest,
  CreateJoinRequestPayload,
  UpdateMemberRolePayload,
  TransferOwnershipPayload,
} from '../types/community';
import { secureApi } from '../services/secureApi';
import { api } from '../services/api';

/**
 * Get all communities with optional filters
 */
export const getCommunities = async (
  cursor?: string,
  limit: number = 10,
  category?: string,
  search?: string,
  founderId?: string
): Promise<CommunitiesResult> => {
  try {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (founderId) params.append('founderId', founderId);

    const response = await api.get<CommunitiesResult>(`/communities?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch communities');
  }
};

/**
 * Get a single community by ID
 */
export const getCommunityById = async (communityId: string): Promise<{ community: SafeCommunity }> => {
  try {
    const response = await api.get<{ community: SafeCommunity }>(`/communities/${communityId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Community not found');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch community');
  }
};

/**
 * Check if user can view community posts
 */
export const canViewCommunityPosts = async (communityId: string): Promise<{ canView: boolean; isMember: boolean; visibility: string }> => {
  try {
    const response = await api.get<{ canView: boolean; isMember: boolean; visibility: string }>(`/communities/${communityId}/can-view-posts`);
    return response.data;
  } catch (error: any) {
    return { canView: false, isMember: false, visibility: 'private' };
  }
};

/**
 * Create a new community
 */
export const createCommunity = async (formData: FormData): Promise<{ message: string; community: SafeCommunity }> => {
  try {
    const response = await secureApi.post<{ message: string; community: SafeCommunity }>('/communities', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to create a community');
    } else if (error.response?.status === 400) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors && Array.isArray(backendErrors)) {
        const errorMessage = backendErrors.map((e: any) => e.msg).join(', ');
        console.error('Validation errors:', backendErrors);
        throw new Error(errorMessage);
      }
      console.error('Backend error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Invalid community data');
    } else if (error.response?.status === 404) {
      throw new Error('Category not found or inactive');
    } else if (error.response?.status === 409) {
      throw new Error('A community with this name already exists');
    } else if (!error.response) {
      throw new Error('Network error: Cannot connect to server. Please check your connection.');
    }

    console.error('Create community error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to create community');
  }
};

/**
 * Update a community
 */
export const updateCommunity = async (communityId: string, formData: FormData): Promise<{ message: string; community: SafeCommunity }> => {
  try {
    const response = await secureApi.put<{ message: string; community: SafeCommunity }>(`/communities/${communityId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to update a community');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to update this community');
    } else if (error.response?.status === 404) {
      throw new Error('Community not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to update community');
  }
};

/**
 * Delete a community
 */
export const deleteCommunity = async (communityId: string): Promise<{ message: string }> => {
  try {
    const response = await secureApi.delete<{ message: string }>(`/communities/${communityId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to delete a community');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to delete this community');
    } else if (error.response?.status === 404) {
      throw new Error('Community not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to delete community');
  }
};

/**
 * Join a community
 */
export const joinCommunity = async (communityId: string): Promise<{ message: string; community: SafeCommunity }> => {
  try {
    const response = await secureApi.post<{ message: string; community: SafeCommunity }>(`/communities/${communityId}/join`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to join a community');
    } else if (error.response?.status === 403) {
      throw new Error('You are banned from this community');
    } else if (error.response?.status === 404) {
      throw new Error('Community not found');
    } else if (error.response?.status === 409) {
      throw new Error('You are already a member of this community');
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'This community requires approval to join');
    }

    throw new Error(error.response?.data?.message || 'Failed to join community');
  }
};

/**
 * Leave a community
 */
export const leaveCommunity = async (communityId: string): Promise<{ message: string }> => {
  try {
    const response = await secureApi.delete<{ message: string }>(`/communities/${communityId}/leave`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to leave a community');
    } else if (error.response?.status === 403) {
      throw new Error('Community founder cannot leave the community');
    } else if (error.response?.status === 404) {
      throw new Error('Community not found');
    } else if (error.response?.status === 400) {
      throw new Error('You are not a member of this community');
    }

    throw new Error(error.response?.data?.message || 'Failed to leave community');
  }
};

/**
 * Get community members
 */
export const getCommunityMembers = async (communityId: string): Promise<CommunityMembersResult> => {
  try {
    const response = await api.get<CommunityMembersResult>(`/communities/${communityId}/members`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Community not found');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch community members');
  }
};

/**
 * Send invitations to join a community
 */
export const sendInvitations = async (
  communityId: string,
  payload: InviteUsersPayload
): Promise<{ message: string; successCount: number; failedInvitations: any[] }> => {
  try {
    const response = await secureApi.post<{ message: string; successCount: number; failedInvitations: any[] }>(
      `/communities/${communityId}/invitations`,
      payload
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to send invitations');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to send invitations for this community');
    } else if (error.response?.status === 404) {
      throw new Error('Community not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to send invitations');
  }
};

/**
 * Get invitations for a community
 */
export const getInvitations = async (communityId: string): Promise<{ invitations: SafeInvitation[] }> => {
  try {
    const response = await secureApi.get<{ invitations: SafeInvitation[] }>(`/communities/${communityId}/invitations`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to view invitations');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to view invitations for this community');
    } else if (error.response?.status === 404) {
      throw new Error('Community not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to fetch invitations');
  }
};

/**
 * Cancel an invitation
 */
export const cancelInvitation = async (communityId: string, invitationId: string): Promise<{ message: string }> => {
  try {
    const response = await secureApi.delete<{ message: string }>(
      `/communities/${communityId}/invitations/${invitationId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to cancel invitations');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to cancel this invitation');
    } else if (error.response?.status === 404) {
      throw new Error('Invitation not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to cancel invitation');
  }
};

/**
 * Accept an invitation
 */
export const acceptInvitation = async (invitationId: string): Promise<{ message: string; community: SafeCommunity }> => {
  try {
    const response = await secureApi.post<{ message: string; community: SafeCommunity }>(
      `/communities/invitations/${invitationId}/accept`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to accept invitations');
    } else if (error.response?.status === 404) {
      throw new Error('Invitation not found');
    } else if (error.response?.status === 400) {
      const message = error.response?.data?.message || '';
      if (message.includes('expired')) {
        throw new Error('This invitation has expired');
      } else if (message.includes('already been used')) {
        throw new Error('This invitation has already been used');
      }
      throw new Error(message || 'Invalid invitation');
    }

    throw new Error(error.response?.data?.message || 'Failed to accept invitation');
  }
};

/**
 * Get my invitations
 */
export const getMyInvitations = async (): Promise<any[]> => {
  try {
    const response = await secureApi.get<any[]>('/communities/invitations/me');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to view invitations');
    }

    throw new Error(error.response?.data?.message || 'Failed to fetch invitations');
  }
};

/**
 * Get my sent invitations
 */
export const getMySentInvitations = async (): Promise<any[]> => {
  try {
    const response = await secureApi.get<any[]>('/communities/invitations/sent');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to view sent invitations');
    }

    throw new Error(error.response?.data?.message || 'Failed to fetch sent invitations');
  }
};

/**
 * Create a join request for a community that requires approval
 */
export const createJoinRequest = async (
  communityId: string,
  payload: CreateJoinRequestPayload
): Promise<{ message: string }> => {
  try {
    const response = await secureApi.post<{ message: string }>(
      `/communities/${communityId}/join-requests`,
      payload
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to request to join a community');
    } else if (error.response?.status === 403) {
      throw new Error('You are banned from this community');
    } else if (error.response?.status === 404) {
      throw new Error('Community not found');
    } else if (error.response?.status === 409) {
      throw new Error('You already have a pending join request');
    }

    throw new Error(error.response?.data?.message || 'Failed to create join request');
  }
};

/**
 * Cancel a pending join request
 */
export const cancelJoinRequest = async (communityId: string): Promise<{ message: string }> => {
  try {
    const response = await secureApi.delete<{ message: string}>(
      `/communities/${communityId}/join-requests/cancel`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to cancel a join request');
    } else if (error.response?.status === 404) {
      throw new Error('No pending join request found');
    }

    throw new Error(error.response?.data?.message || 'Failed to cancel join request');
  }
};

/**
 * Get join requests for a community (admin only)
 */
export const getJoinRequests = async (communityId: string): Promise<{ requests: SafeJoinRequest[] }> => {
  try {
    const response = await secureApi.get<{ requests: SafeJoinRequest[] }>(
      `/communities/${communityId}/join-requests`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to view join requests');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to view join requests for this community');
    } else if (error.response?.status === 404) {
      throw new Error('Community not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to fetch join requests');
  }
};

/**
 * Approve a join request (admin only)
 */
export const approveJoinRequest = async (
  communityId: string,
  requestId: string
): Promise<{ message: string; community: SafeCommunity }> => {
  try {
    const response = await secureApi.post<{ message: string; community: SafeCommunity }>(
      `/communities/${communityId}/join-requests/${requestId}/approve`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to approve join requests');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to approve join requests for this community');
    } else if (error.response?.status === 404) {
      throw new Error('Join request not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to approve join request');
  }
};

/**
 * Reject a join request (admin only)
 */
export const rejectJoinRequest = async (communityId: string, requestId: string): Promise<{ message: string }> => {
  try {
    const response = await secureApi.post<{ message: string }>(
      `/communities/${communityId}/join-requests/${requestId}/reject`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to reject join requests');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to reject join requests for this community');
    } else if (error.response?.status === 404) {
      throw new Error('Join request not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to reject join request');
  }
};

/**
 * Remove a member from a community (admin only)
 */
export const removeMember = async (communityId: string, memberId: string): Promise<{ message: string }> => {
  try {
    const response = await secureApi.delete<{ message: string }>(
      `/communities/${communityId}/members/${memberId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to remove members');
    } else if (error.response?.status === 403) {
      const message = error.response?.data?.message || '';
      if (message.includes('founder')) {
        throw new Error('Cannot remove the community founder');
      }
      throw new Error('You are not authorized to remove members from this community');
    } else if (error.response?.status === 404) {
      throw new Error('Community or member not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to remove member');
  }
};

/**
 * Ban a user from a community (admin only)
 */
export const banUser = async (communityId: string, memberId: string): Promise<{ message: string }> => {
  try {
    const response = await secureApi.post<{ message: string }>(
      `/communities/${communityId}/members/${memberId}/ban`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to ban users');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to ban users from this community');
    } else if (error.response?.status === 404) {
      throw new Error('Community or member not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to ban user');
  }
};

/**
 * Unban a user from a community (admin only)
 */
export const unbanUser = async (communityId: string, memberId: string): Promise<{ message: string }> => {
  try {
    const response = await secureApi.delete<{ message: string }>(
      `/communities/${communityId}/members/${memberId}/ban`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to unban users');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to unban users from this community');
    } else if (error.response?.status === 404) {
      throw new Error('Community or member not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to unban user');
  }
};

/**
 * Get banned users from a community (admin only)
 */
export const getBannedUsers = async (communityId: string): Promise<{ bannedUsers: CommunityMember[]; total: number }> => {
  try {
    const response = await secureApi.get<{ bannedUsers: CommunityMember[]; total: number }>(
      `/communities/${communityId}/banned-users`
    );
    return response.data;
  } catch (error: any) {
    console.error('getBannedUsers error - Status:', error.response?.status);
    console.error('getBannedUsers error - Status Text:', error.response?.statusText);
    console.error('getBannedUsers error - Data:', error.response?.data);
    console.error('getBannedUsers error - Message:', error.message);

    if (error.response?.status === 401) {
      throw new Error('You must be logged in to view banned users');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to view banned users from this community');
    } else if (error.response?.status === 404) {
      throw new Error('Community not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to fetch banned users');
  }
};

/**
 * Update a member's role (admin only)
 */
export const updateMemberRole = async (
  communityId: string,
  memberId: string,
  payload: UpdateMemberRolePayload
): Promise<{ message: string }> => {
  try {
    const response = await secureApi.patch<{ message: string }>(
      `/communities/${communityId}/members/${memberId}/role`,
      payload
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to update member roles');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to update member roles in this community');
    } else if (error.response?.status === 404) {
      throw new Error('Community or member not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to update member role');
  }
};

/**
 * Request ownership transfer (founder only)
 */
export const requestOwnershipTransfer = async (
  communityId: string,
  payload: TransferOwnershipPayload
): Promise<{ message: string }> => {
  try {
    const response = await secureApi.post<{ message: string }>(
      `/communities/${communityId}/ownership-transfer`,
      payload
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to transfer ownership');
    } else if (error.response?.status === 403) {
      throw new Error('Only the founder can transfer ownership');
    } else if (error.response?.status === 404) {
      throw new Error('Community or user not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to request ownership transfer');
  }
};

/**
 * Get pending ownership transfer request (founder only)
 */
export const getPendingOwnershipTransfer = async (communityId: string): Promise<any> => {
  try {
    const response = await secureApi.get<any>(
      `/communities/${communityId}/ownership-transfer`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to view ownership transfer');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to view this transfer request');
    } else if (error.response?.status === 404) {
      throw new Error('No pending transfer request found');
    }

    throw new Error(error.response?.data?.message || 'Failed to fetch ownership transfer');
  }
};

/**
 * Cancel ownership transfer request (founder only)
 */
export const cancelOwnershipTransfer = async (communityId: string): Promise<{ message: string }> => {
  try {
    const response = await secureApi.delete<{ message: string }>(
      `/communities/${communityId}/ownership-transfer`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to cancel ownership transfer');
    } else if (error.response?.status === 403) {
      throw new Error('Only the founder can cancel ownership transfer');
    } else if (error.response?.status === 404) {
      throw new Error('No pending transfer request found');
    }

    throw new Error(error.response?.data?.message || 'Failed to cancel ownership transfer');
  }
};

/**
 * Cancel ownership transfer request by transfer ID (from outgoing requests)
 */
export const cancelOwnershipTransferById = async (transferId: string): Promise<{ message: string }> => {
  try {
    const response = await secureApi.delete<{ message: string }>(
      `/communities/ownership-transfers/${transferId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to cancel ownership transfer');
    } else if (error.response?.status === 403) {
      throw new Error('Only the founder can cancel ownership transfer');
    } else if (error.response?.status === 404) {
      throw new Error('No pending transfer request found');
    }

    throw new Error(error.response?.data?.message || 'Failed to cancel ownership transfer');
  }
};

/**
 * Accept ownership transfer request (target admin only)
 */
export const acceptOwnershipTransfer = async (transferId: string): Promise<{ message: string; community: SafeCommunity }> => {
  try {
    const response = await secureApi.post<{ message: string; community: SafeCommunity }>(
      `/communities/ownership-transfers/${transferId}/accept`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to accept ownership transfer');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to accept this transfer');
    } else if (error.response?.status === 404) {
      throw new Error('Transfer request not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to accept ownership transfer');
  }
};

/**
 * Get my ownership transfer requests (transfers directed to me)
 */
export const getMyOwnershipTransferRequests = async (): Promise<any[]> => {
  try {
    const response = await secureApi.get<any[]>(
      '/communities/ownership-transfers/me'
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to view ownership transfers');
    }

    throw new Error(error.response?.data?.message || 'Failed to fetch ownership transfers');
  }
};

/**
 * Get my sent ownership transfer requests (transfers I initiated)
 */
export const getMySentOwnershipTransferRequests = async (): Promise<any[]> => {
  try {
    const response = await secureApi.get<any[]>(
      '/communities/ownership-transfers/sent'
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to view sent ownership transfers');
    }

    throw new Error(error.response?.data?.message || 'Failed to fetch sent ownership transfers');
  }
};

/**
 * Reject ownership transfer request (target admin only)
 */
export const rejectOwnershipTransfer = async (transferId: string): Promise<{ message: string }> => {
  try {
    const response = await secureApi.post<{ message: string }>(
      `/communities/ownership-transfers/${transferId}/reject`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to reject ownership transfer');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to reject this transfer');
    } else if (error.response?.status === 404) {
      throw new Error('Transfer request not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to reject ownership transfer');
  }
};
