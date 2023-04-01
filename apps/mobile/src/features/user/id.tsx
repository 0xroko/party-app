import { Button } from "@components/button";
import { Div, Img, Text } from "@components/index";
import { SafeArea } from "@components/safe-area";
import {
  EllipsisVerticalIcon,
  UserPlusIcon,
} from "react-native-heroicons/outline";

import { MapPinIcon } from "react-native-heroicons/mini";

import { Badge } from "@components/badge";
import { NavBar, NavBarItem } from "@components/navbar";
import { useAuthUser } from "@hooks/useAuthUser";
import { useUser } from "@hooks/useUser";
import { User } from "@lib/actions";
import {
  accept_friend_request,
  checkIfFriend,
  remove_friend,
  send_friend_request,
  unsend_friend_request,
} from "@lib/frendship/add_friend";
import { formatBio, formatName, formatUserDisplayName } from "@lib/misc";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthUser } from "@supabase/supabase-js";
import { styled } from "nativewind";
import { FC, useMemo, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { useQuery } from "react-query";
import colors from "../../../colors";

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
      unsendFriendRequest: unsend_friend_request,
    },
  };
};

interface UserListProps {
  children?: React.ReactNode | React.ReactNode[];
  users: User[];
}

export const StyledScrollDiv = styled(ScrollView);

export const UserList = ({ users }: UserListProps) => {
  return (
    <Div className={`flex flex-col g-7 px-4 bg-accents-9 rounded-3xl py-6`}>
      <Text className={`font-figtree-bold text-accents-12 text-xl`}>
        Prijatelji
      </Text>
      <ScrollView
        horizontal
        contentContainerStyle={{
          alignItems: "center",
          flexDirection: "row",
          gap: 22,
        }}
      >
        {users.map((user, i) => (
          <Div
            key={i.toString()}
            className={`flex flex-col items-center justify-between g-4`}
          >
            <Img
              className={`w-28 h-28 rounded-full`}
              source={{
                uri: "https://images.unsplash.com/photo-1657320815727-2512f49f61d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=60",
              }}
            />
            <Div className={`flex flex-col items-center  justify-center`}>
              <Text
                className={`font-figtree-bold text-center text-lg text-accents-12`}
              >
                {formatName(user.name, user.surname)}
              </Text>
              <Text className={`font-figtree text-accents-11 text-center`}>
                {formatUserDisplayName(user.displayname)}
              </Text>
            </Div>
          </Div>
        ))}
      </ScrollView>
    </Div>
  );
};

export const useFriendReqestCount = (user: User, isMe: boolean) => {
  const req = useQuery(
    ["friend-requests", user?.id],
    async () => {
      return await supabase
        .from("Friendship")
        .select("*", { count: "exact", head: true })
        .eq("userBId", user?.id)
        .eq("accepted", false);
    },
    {
      enabled: isMe,
    }
  );

  return req;
};

export const UserInfoScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "user">
> = ({ navigation, route }) => {
  const userId = route.params?.id;

  const { data: user, isLoading } = useUser(userId);
  const { data: authUser, isFetched, refetch } = useAuthUser();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const testUsers = [
    { name: "John", age: 20, surname: "Smith", displayname: "jjjjjooon" },
    { name: "John", age: 20, surname: "Smith", displayname: "jjjjjooon" },
    { name: "John", age: 20, surname: "Smith", displayname: "jjjjjooon" },
    { name: "John", age: 20, surname: "Smith", displayname: "jjjjjooon" },
    { name: "John", age: 20, surname: "Smith", displayname: "jjjjjooon" },
    { name: "John", age: 20, surname: "Smith", displayname: "jjjjjooon" },
    { name: "John", age: 20, surname: "Smith", displayname: "jjjjjooon" },
    { name: "John", age: 20, surname: "Smith", displayname: "jjjjjooon" },
    { name: "John", age: 20, surname: "Smith", displayname: "jjjjjooon" },
  ] as User[];

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

  const handleUserAction = (userId: string, authUser: AuthUser) => {
    if (!isMe) {
      if (friendShipStatus === "friend") {
        return {
          actionFn: async () => actions.removeFriend(userId, authUser),
          text: "Remove friend",
        };
      } else if (friendShipStatus === "accept") {
        return {
          actionFn: async () => actions.acceptFriendRequest(userId, authUser),
          text: "Accept request",
        };
      } else if (friendShipStatus === "none") {
        return {
          actionFn: async () => actions.sendFriendRequest(userId, authUser),
          text: "Send friend request",
        };
      } else if (friendShipStatus === "requested") {
        return {
          actionFn: async () => actions.unsendFriendRequest(userId, authUser),
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
    return handleUserAction(user?.id, authUser.user);
  }, [friendShipStatus, actions, user, authUser]);

  const { data: friendRequestCount } = useFriendReqestCount(user, isMe);

  const hasBio = user?.bio?.length > 0;

  if (isLoading) return null;

  return (
    <SafeArea gradient>
      <NavBar includeDefaultTrailing={isMe}>
        {isMe && (
          <NavBarItem
            onPress={() => {
              navigation.navigate("user-friend-request", {
                previousScreenName: formatUserDisplayName(user.displayname),
              });
            }}
          >
            {friendRequestCount?.count > 0 && (
              <Div
                className={`bg-error-primary  rounded-full p-1 absolute min-w-[16px] text-center flex justify-center items-center -right-1 -top-1 z-30 shadow-lg`}
              >
                <Text
                  className={`text-[8px] text-accents-12 font-figtree-bold`}
                >
                  {friendRequestCount.count}
                </Text>
              </Div>
            )}
            <UserPlusIcon strokeWidth={2} size={24} color="#fff" />
          </NavBarItem>
        )}
      </NavBar>
      {isFetched && (
        <Div className={`mx-[20px] flex h-full `}>
          <Div className={`flex flex-col items-center`}>
            <Img
              className={`rounded-full w-[124px] h-[124px] mt-4`}
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
              <Div className={`mt-1`}>
                <Text
                  className={`text-2xl text-center font-figtree-medium tracking-tight text-accents-10`}
                >
                  @{user?.displayname}
                </Text>
              </Div>
            </Pressable>
            <Pressable onPress={handleDataPress}>
              <Div
                className={`mt-6 g-3 flex flex-row items-center justify-center`}
              >
                {user?.location ? (
                  <Badge
                    icon={<MapPinIcon color={"#fff"} size={16} />}
                    intent="primary"
                  >
                    {user?.location}
                  </Badge>
                ) : (
                  <Badge
                    icon={<MapPinIcon color={colors.accents[9]} size={16} />}
                    intent="disabled"
                  >
                    ???? grad
                  </Badge>
                )}
                {user?.age ? (
                  <Badge intent="primary">{user?.age} god.</Badge>
                ) : (
                  <Badge intent="disabled">?? god.</Badge>
                )}
              </Div>
            </Pressable>
            <Div className={`mt-12 max-h-[56px] h-full`}>
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
            <Div className={`mt-12 flex flex-col w-full`}>
              <UserList users={testUsers} />
            </Div>
          </Div>
        </Div>
      )}
    </SafeArea>
  );
};
