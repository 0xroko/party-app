export const queryKeys = {
  authUser: ["authUser"],
  user: (id: string) => ["user", id],
  friends: (id: string, page: number) => ["friends", page, id],
  friendship: (id: string) => ["friendship", id],
  friendReqest: (id: string) => ["friendRequests", id],
  friendRequestCount: ["friendRequestCount"],
  latestParties: ["latestParties"],
  partyId: (id: string) => ["partyId", id],
} as const;
