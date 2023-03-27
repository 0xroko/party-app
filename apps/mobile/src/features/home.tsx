import { Button } from "@components/button";
import { Div } from "@components/index";
import { SafeArea } from "@components/safe-area";
import { useAuthUser } from "@hooks/useAuthUser";
import { User } from "@lib/actions";
import { getRandomUserButNotMe } from "@lib/actions/user";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { useQuery } from "react-query";

const useRandomUser = () => {
  const q = useQuery("random-user", async () => {
    return (await getRandomUserButNotMe()) as User;
  });

  return q;
};

export const HomeScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "home">
> = ({ navigation, route }) => {
  const { data, isFetched, refetch } = useAuthUser();

  const { data: randomUserData, isFetched: randomUserFetched } =
    useRandomUser();

  return (
    <SafeArea gradient>
      <Div className={`mx-[22px] flex h-full justify-evenly`}>
        <Div className={`flex flex-col g-2`}>
          <Button
            disabled={!isFetched}
            onPress={() => {
              navigation.navigate("user", { id: data?.user.id });
            }}
          >
            My Profile
          </Button>
          <Button
            disabled={!isFetched}
            onPress={() => {
              navigation.navigate("user", { id: randomUserData?.id });
            }}
          >
            {randomUserData?.displayname}
          </Button>
        </Div>
      </Div>
    </SafeArea>
  );
};
