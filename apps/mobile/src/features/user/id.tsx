import { z } from "zod";

import { Div } from "@components/index";
import { SafeArea } from "@components/safe-area";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";

const phoneShema = z
  .string()
  .regex(/^[0-9]{9,15}$/, "Broj telefona nije validan");

export const UserInfoScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "user">
> = ({ navigation, route }) => {
  // screen width and height

  const userId = route.params?.id;

  return (
    <SafeArea gradient>
      <Div className={`mx-[22px] flex h-full justify-evenly`}>
        <Div className={`flex flex-col`}></Div>
      </Div>
    </SafeArea>
  );
};
