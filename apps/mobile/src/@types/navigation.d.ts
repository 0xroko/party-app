interface DefaultNavigationOptions {
  previousScreenName?: string;
  showBackButton?: boolean;
  showNavBar?: boolean;
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
  "user-friend-request": {} & DefaultNavigationOptions;
  "party-add": DefaultNavigationOptions;
  "party-add-more": {
    id: string;
  };
  postAdd: {
    partyId: string;
  } & DefaultNavigationOptions;
  post: {
    id: string;
  } & DefaultNavigationOptions;
  chats: DefaultNavigationOptions;
  chat: { id: string };
  "upload-images": undefined;
  party: {
    id: string;
  } & DefaultNavigationOptions;
  "search-page": undefined;
  "tag-users": {
    userId: string;
    imgUuId: string;
  } & DefaultNavigationOptions;
};
