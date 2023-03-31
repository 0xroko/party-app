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
      <Div className={`justify-evenly mx-[22px] flex h-full`}>
        <Div className={`flex flex-col g-2`}>
          <Button
            disabled={!isFetched}
            onPress={() => {
              navigation.navigate("user", {
                id: data?.user.id,
                previousScreenName: "Home",
              });
            }}
          >
            My Profile
          </Button>

          <Button
            disabled={!isFetched}
            onPress={() => {
              navigation.navigate("user", {
                id: randomUserData?.id,
                previousScreenName: "Home",
              });
            }}
          >
            {randomUserData?.displayname}
          </Button>
          <Button
            // disabled={!isFetched}
            onPress={() => {
              navigation.navigate("party-add");
            }}
          >
            add party
          </Button>
        </Div>
      </Div>
    </SafeArea>
  );
};
