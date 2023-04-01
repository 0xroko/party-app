import { SafeArea } from "@components/safe-area";

import { Button } from "@components/button";
import { Div, Img, Text } from "@components/index";
import { NavBar } from "@components/navbar";
import { useAuthUser } from "@hooks/useAuthUser";
import { useUser } from "@hooks/useUser";
import { User } from "@lib/actions";
import {
  accept_friend_request,
  unsend_friend_request,
} from "@lib/frendship/add_friend";
import { formatName, formatUserDisplayName } from "@lib/misc";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { User as AuthUser } from "@supabase/supabase-js";
import { FC } from "react";
import { Pressable, ScrollView } from "react-native";
import { useMutation, useQuery } from "react-query";

const useFriendRequest = (authUser: AuthUser) => {
  return useQuery(
    ["friend-request", authUser?.id],
    async () => {
      // create query from Friendship table where authUser is userAId
      const { data, error } = await supabase
        .from("Friendship")
        .select(
          `*,
        userA: userAId (name, surname, imagesId, displayname),
        userB: userBId (name, surname, imagesId, displayname)
        `
        )
        .or(`userAId.eq.${authUser?.id},userBId.eq.${authUser?.id}`)
        .eq("accepted", false);

      return data;
    },
    {
      enabled: !!authUser,
    }
  );
};

export const UserFriendReqests: FC<
  NativeStackScreenProps<StackNavigatorParams, "user-friend-request">
> = ({ navigation, route }) => {
  // screen width and height

  const { data: authUser, isFetched, refetch } = useAuthUser();
  const { data: user, isLoading } = useUser(authUser?.user?.id);

  const { data: friendRequests, isLoading: isFriendRequestsLoading } =
    useFriendRequest(authUser?.user);

  const usePositiveMutateStauts = useMutation<unknown, unknown, unknown>({
    // @ts-ignore
    mutationFn: async (friendId: string, status: "pending" | "accept") => {
      if (status === "accept") {
        await accept_friend_request(friendId, authUser?.user);
      } else {
        await unsend_friend_request(friendId, authUser?.user);
      }

      return true;
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["user", authUser.user.id] });
    },
    onError: (err) => {},
  });

  return (
    <SafeArea gradient>
      <NavBar includeDefaultTrailing={false} />
      <SafeArea.Content>
        <Text
          className={`text-3xl tracking-tight font-figtree-bold text-accents-12 mb-8 mt-6`}
        >
          Zahtjevi
        </Text>
        <ScrollView>
          {friendRequests?.map((friendRequest) => {
            const user = (friendRequest.userAId === authUser?.user?.id
              ? friendRequest.userB
              : friendRequest.userA) as unknown as Pick<
              User,
              "id" | "name" | "surname" | "displayname"
            >;

            const friendStatus =
              friendRequest.userAId === authUser?.user?.id
                ? "pending"
                : "accept";

            const negativeFriendStatus =
              friendStatus === "accept" ? "decline" : "cancel";

            if (!user) return null;
            return (
              <Pressable
                onClick={() => {
                  console.log("go to user");

                  navigation.navigate("user", {
                    id:
                      friendRequest.userAId === authUser?.user?.id
                        ? friendRequest.userBId
                        : friendRequest.userAId,
                  });
                }}
              >
                <Div
                  className={`flex flex-row items-center bg-accents-1 rounded-lg justify-between`}
                >
                  <Div className={`flex flex-row items-center g-4`}>
                    <Img
                      className={`w-20 h-20 rounded-full`}
                      source={{
                        uri: "https://images.unsplash.com/photo-1657320815727-2512f49f61d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=60",
                      }}
                    />
                    <Div className={`flex flex-col items-start justify-start`}>
                      <Text
                        className={`font-figtree-bold text-xl text-accents-12`}
                      >
                        {formatName(user.name, user.surname)}
                      </Text>
                      <Text className={`font-figtree text-accents-11`}>
                        {formatUserDisplayName(user.displayname)}
                      </Text>
                    </Div>
                  </Div>
                  <Div className={`flex g-3 flex-row`}>
                    <Div className={``}>
                      <Button intent="secondary">{negativeFriendStatus}</Button>
                    </Div>

                    <Div className={``}>
                      <Button disabled={friendStatus === "pending"}>
                        {friendStatus}
                      </Button>
                    </Div>
                  </Div>
                </Div>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeArea.Content>
    </SafeArea>
  );
};
