export const getAvatarUrl = (name: string, avatar?: string): string => {
  if (avatar && avatar.trim() !== '') {
    return avatar;
  }

  const displayName = name || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff&size=150&bold=true`;
};

export const getAuthorInitials = (name: string): string => {
  if (!name) return 'U';

  const words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};
