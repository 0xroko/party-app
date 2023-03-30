export const formatUserDisplayName = (displayName?: string) => {
  if (!displayName) {
    return `@anon`;
  }
  return `@${displayName}`;
};
