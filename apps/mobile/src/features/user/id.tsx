import { Button } from "@components/button";
import { Div, Img, Text } from "@components/index";
import { SafeArea } from "@components/safe-area";
import { EllipsisVerticalIcon } from "react-native-heroicons/solid";

import { Badge } from "@components/badge";
import { NavBar } from "@components/navbar";
import { useAuthUser } from "@hooks/useAuthUser";
import { useUser } from "@hooks/useUser";
import { User } from "@lib/actions";
import {
  accept_friend_request,
  checkIfFriend,
  remove_friend,
  send_friend_request,
} from "@lib/frendship/add_friend";
import { formatBio, formatUserDisplayName } from "@lib/misc";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useMemo, useState } from "react";
import { Pressable } from "react-native";
import { useQuery } from "react-query";

export const useFriendship = (id: User["id"]) => {
  const authUser = useAuthUser();

  const q = useQuery(
    ["friendship", id],
    async () => {
      return await checkIfFriend(id, authUser.data.user);
    },
    {
      enabled: !!authUser.data,
    }
  );

  return {
    ...q,
    actions: {
      sendFriendRequest: send_friend_request,
      acceptFriendRequest: accept_friend_request,
      removeFriend: remove_friend,
    },
  };
};

export const UserInfoScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "user">
> = ({ navigation, route }) => {
  const userId = route.params?.id;

  const { data: user, isLoading } = useUser(userId);
  const { data: authUser, isFetched, refetch } = useAuthUser();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: friendShipStatus,
    actions,
    refetch: refetchStatus,
  } = useFriendship(userId);

  const isMe = authUser?.user.id === userId;

  const handleDataPress = () => {
    if (!isMe) return;
    navigation.navigate("user-edit", {
      previousScreenName: formatUserDisplayName(user.displayname),
    });
  };

  const handleUserAction = () => {
    if (!isMe) {
      if (friendShipStatus === "friend") {
        return {
          actionFn: async () => actions.removeFriend(userId, authUser.user),
          text: "Remove friend",
        };
      } else if (friendShipStatus === "accept") {
        return {
          actionFn: async () =>
            actions.acceptFriendRequest(userId, authUser.user),
          text: "Accept request",
        };
      } else if (friendShipStatus === "none") {
        return {
          actionFn: async () =>
            actions.sendFriendRequest(userId, authUser.user),
          text: "Send friend request",
        };
      } else if (friendShipStatus === "requested") {
        return {
          actionFn: async () => actions.removeFriend(userId, authUser.user),
          text: "Cancel request",
        };
      }
    }
    return {
      actionFn: async () => {
        handleDataPress();
      },
      text: "Edit profile",
    };
  };

  const { actionFn, text } = useMemo(() => {
    return handleUserAction();
  }, [friendShipStatus, actions, user]);

  const hasBio = user?.bio?.length > 0;

  return (
    <SafeArea gradient>
      <NavBar />
      {isFetched && (
        <Div className={`mx-[22px] flex h-full`}>
          <Div className={`flex flex-col items-center`}>
            <Img
              className={`rounded-full w-[124px] h-[124px] mt-12`}
              source={{
                uri: "https://images.unsplash.com/photo-1657320815727-2512f49f61d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=60",
                width: 100,
              }}
            />
            <Pressable onPress={handleDataPress}>
              <Div className={`mt-6`}>
                <Text
                  className={`text-4xl text-center font-figtree-bold text-accents-12`}
                >
                  {user?.name} {user?.surname}
                </Text>
              </Div>
              <Div className={``}>
                <Text
                  className={`text-2xl text-center font-figtree-medium tracking-tight text-accents-10`}
                >
                  @{user?.displayname}
                </Text>
              </Div>
            </Pressable>
            <Pressable onPress={handleDataPress}>
              <Div
                className={`mt-12 g-3 flex flex-row items-center justify-center`}
              >
                {user?.location ? (
                  <Badge intent="primary">{user?.location}</Badge>
                ) : (
                  <Badge intent="disabled">???? grad</Badge>
                )}
                {user?.age ? (
                  <Badge intent="primary">{user?.age} god.</Badge>
                ) : (
                  <Badge intent="disabled">?? god.</Badge>
                )}
              </Div>
            </Pressable>
            <Div className={`mt-7 max-h-[56px] h-full`}>
              <Pressable onPress={handleDataPress}>
                <Text
                  className={`font-figtree-medium text-base text-center ${
                    !hasBio ? "text-accents-10" : "text-accents-12"
                  } tracking-wide leading-7`}
                >
                  {formatBio(user?.bio)}
                </Text>
              </Pressable>
            </Div>
            <Div className={`mt-16 flex g-4 flex-row w-full`}>
              <Div className={`flex grow`}>
                <Button
                  disabled={isSubmitting}
                  onPress={async () => {
                    setIsSubmitting(true);
                    await actionFn();
                    refetchStatus();
                    setIsSubmitting(false);
                  }}
                >
                  {text}
                </Button>
              </Div>
              <Div className={`flex grow-0 shrink`}>
                <Button className={`w-10`}>
                  <EllipsisVerticalIcon
                    strokeWidth={2}
                    size={20}
                    color={"#000"}
                  />
                </Button>
              </Div>
            </Div>
          </Div>
        </Div>
      )}
    </SafeArea>
  );
};
