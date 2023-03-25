import { NavigationContainer } from "@react-navigation/native";
import { Suspense } from "react";

export const Provider: FCC = ({ children }) => {
  return (
    <Suspense>
      <NavigationContainer>{children}</NavigationContainer>
    </Suspense>
  );
};
