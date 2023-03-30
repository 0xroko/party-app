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

export const formatName = (name?: string, surname?: string) => {
  if (!name || !surname) {
    return `Anonimni korisnik`;
  }
  return `${name} ${surname}`;
};
