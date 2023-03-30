export const formatUserDisplayName = (displayName?: string) => {
  if (!displayName) {
    return `@anon`;
  }
  return `@${displayName}`;
};

export const formatBio = (bio?: string) => {
  if (!bio) {
    return `Korisnik se nije još predstavio. :<`;
  }
  return bio.replaceAll(/\n/g, " ");
};
