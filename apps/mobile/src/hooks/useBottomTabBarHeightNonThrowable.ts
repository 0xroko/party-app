import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import React from "react";

// this won't throw if context is not defined which is what we want
export function useBottomTabBarHeightNonThrowable() {
  const height = React.useContext(BottomTabBarHeightContext);

  if (height === undefined) {
    return 0;
  }

  return height;
}
