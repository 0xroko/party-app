import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider, focusManager } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 1 min
      cacheTime: 1000 * 60,
      staleTime: 1000 * 60,
    },
  },
});

import type { AppStateStatus } from "react-native";
import { AppState, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// iako je ovo cool nezz dal revalidate sve query ili samo one koje su u component tree
// (iako je to cudno jel neznas kj react-navigation stavi u tree)
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export const Provider: FCC = ({ children }) => {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <Suspense>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>{children}</NavigationContainer>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </Suspense>
  );
};
