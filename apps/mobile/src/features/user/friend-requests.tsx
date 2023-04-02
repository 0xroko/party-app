import { SafeArea } from "@components/safe-area";

import { Button } from "@components/button";
import { Div, Img, Text } from "@components/index";
import { NavBar } from "@components/navbar";
import { useAuthUser } from "@hooks/useAuthUser";
import { useUser } from "@hooks/useUser";
import { User } from "@lib/actions";
import { queryKeys } from "@lib/const";
import {
  accept_friend_request,
  decline_friend_request,
  unsend_friend_request,
} from "@lib/frendship/add_friend";
import { formatName, formatUserDisplayName } from "@lib/misc";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { User as AuthUser } from "@supabase/supabase-js";
import { FC } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "../../provider/index";

const useFriendRequests = (authUser: AuthUser) => {
  return useQuery(
    queryKeys.friendReqest(authUser?.id),
    async () => {
      // create query from Friendship table where authUser is userAId
      const { data, error } = await supabase
        .from("Friendship")
        .select(
          `*,
        userA: userAId (id,name, surname, imagesId, displayname),
        userB: userBId (id,name, surname, imagesId, displayname)
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
    useFriendRequests(authUser?.user);

  const useFriendAction = useMutation({
    mutationFn: async ({
      friendId,
      action,
    }: {
      friendId: string;
      action: "decline" | "accept" | "cancel";
    }) => {
      if (action === "accept") {
        await accept_friend_request(friendId, authUser?.user);
      } else if (action === "cancel") {
        await unsend_friend_request(friendId, authUser?.user);
      } else if (action === "decline") {
        await decline_friend_request(friendId, authUser?.user);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.friendReqest(authUser?.user.id),
      });
    },
    onError: (err) => {},
  });

  if (isFriendRequestsLoading) return null;

  return (
    <SafeArea gradient>
      <NavBar includeDefaultTrailing={false} />
      <SafeArea.Content>
        <Text
          className={`text-3xl tracking-tight font-figtree-bold text-accents-12 mb-8 mt-6`}
        >
          Zahtjevi
        </Text>
        {friendRequests?.length === 0 ? (
          <Text
            className={`text-2xl font-figtree-medium text-accents-10 mb-8 mt-2`}
          >
            Trenutno nemaš zahtjeva
          </Text>
        ) : (
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
                <Div
                  className={`flex flex-row items-center bg-accents-1 rounded-lg justify-between`}
                >
                  <TouchableOpacity
                    key={friendRequest.id}
                    onPress={() => {
                      console.log("user");

                      navigation.push("user", {
                        previousScreenName: "Zahtjevi",
                        id:
                          friendRequest.userAId === authUser?.user?.id
                            ? friendRequest.userBId
                            : friendRequest.userAId,
                      });
                    }}
                  >
                    <Div className={`flex flex-row items-center g-4`}>
                      <Img
                        className={`w-20 h-20 rounded-full`}
                        source={{
                          uri: "https://images.unsplash.com/photo-1657320815727-2512f49f61d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=60",
                        }}
                      />
                      <Div
                        className={`flex flex-col items-start justify-start`}
                      >
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
                  </TouchableOpacity>

                  <Div className={`flex g-3 flex-row`}>
                    <Div className={``}>
                      <Button
                        textClassName={`capitalize`}
                        loading={useFriendAction.isLoading}
                        onPress={() => {
                          useFriendAction.mutate({
                            friendId: user.id,
                            action:
                              negativeFriendStatus === "cancel"
                                ? "cancel"
                                : "decline",
                          });
                        }}
                        intent="secondary"
                      >
                        {negativeFriendStatus}
                      </Button>
                    </Div>

                    <Div className={``}>
                      <Button
                        textClassName={`capitalize`}
                        onPress={() => {
                          useFriendAction.mutate({
                            friendId: user.id,
                            action: "accept",
                          });
                        }}
                        loading={useFriendAction.isLoading}
                        disabled={friendStatus === "pending"}
                      >
                        {friendStatus}
                      </Button>
                    </Div>
                  </Div>
                </Div>
              );
            })}
          </ScrollView>
        )}
      </SafeArea.Content>
    </SafeArea>
  );
};
