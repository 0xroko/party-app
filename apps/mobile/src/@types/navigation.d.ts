interface DefaultNavigationOptions {
  previousScreenName?: string;
}

type StackNavigatorParams = {
  home: undefined;
  splash: undefined;
  "user-detail": {
    id: string;
  };
  login: undefined;
  "login-login": undefined;
  "login-info": undefined;
  user: {
    id: string;
  } & DefaultNavigationOptions;
  "user-edit": {} & DefaultNavigationOptions;
  "user-modal": undefined;
  "user-friend-request": {} & DefaultNavigationOptionsundefined;
  "party-add": undefined;
  "party-add-more": {
    id: string;
  };
  postAdd: {
    partyId: string;
  } & DefaultNavigationOptions;
  post: {
    id: string;
  } & DefaultNavigationOptions;
  chats: undefined;
  chat: { id: string };
  "upload-images": undefined;
  party: {
    id: string;
  } & DefaultNavigationOptions;
};
