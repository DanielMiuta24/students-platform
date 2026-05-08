import { ref, computed } from 'vue';

interface FollowState {
  isFollowing: boolean;
  followsBack: boolean;
}

// Global reactive store for follow states
const followStates = ref<Map<string, FollowState>>(new Map());

export function useFollowStore() {
  const getFollowState = (userId: string): FollowState | undefined => {
    return followStates.value.get(userId);
  };

  const setFollowState = (userId: string, state: FollowState) => {
    followStates.value.set(userId, state);
    // Trigger reactivity by creating a new Map
    followStates.value = new Map(followStates.value);
  };

  const updateFollowStatus = (userId: string, isFollowing: boolean) => {
    const currentState = followStates.value.get(userId) || { isFollowing: false, followsBack: false };
    followStates.value.set(userId, { ...currentState, isFollowing });
    // Trigger reactivity
    followStates.value = new Map(followStates.value);
  };

  const updateFollowsBack = (userId: string, followsBack: boolean) => {
    const currentState = followStates.value.get(userId) || { isFollowing: false, followsBack: false };
    followStates.value.set(userId, { ...currentState, followsBack });
    // Trigger reactivity
    followStates.value = new Map(followStates.value);
  };

  const clearFollowState = (userId: string) => {
    followStates.value.delete(userId);
    followStates.value = new Map(followStates.value);
  };

  const clearAllFollowStates = () => {
    followStates.value.clear();
    followStates.value = new Map(followStates.value);
  };

  return {
    followStates,
    getFollowState,
    setFollowState,
    updateFollowStatus,
    updateFollowsBack,
    clearFollowState,
    clearAllFollowStates,
  };
}
