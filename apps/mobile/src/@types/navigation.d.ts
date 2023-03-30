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
};
