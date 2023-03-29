import { Button } from "@components/button";
import { Div, Img, Text } from "@components/index";
import { SafeArea } from "@components/safe-area";
import { EllipsisVerticalIcon } from "react-native-heroicons/solid";

import { ArrowLeftIcon, Cog6ToothIcon } from "react-native-heroicons/outline";

import { useAuthUser } from "@hooks/useAuthUser";
import { User } from "@lib/actions";
import { getUserById } from "@lib/actions/user";
import {
  accept_friend_request,
  checkIfFriend,
  remove_friend,
  send_friend_request,
} from "@lib/frendship/add_friend";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useMemo, useState } from "react";
import { Pressable } from "react-native";
import { useQuery } from "react-query";

export const useUser = (id: User["id"]) => {
  const q = useQuery(["user", id], async () => {
    const u = await getUserById(id);
    return u[0];
  });

  return q;
};

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

import { logOut } from "@lib/actions/auth";
import * as DropdownMenu from "zeego/dropdown-menu";

interface NavBarProps {
  children?: React.ReactNode | React.ReactNode[];
  trailing?: React.ReactNode | React.ReactNode[];
}

export const NavBar = ({ children, trailing }: NavBarProps) => {
  const navigation = useNavigation();

  const lastRouteName = navigation.getState().routes.slice(-2)[0];

  return (
    <Div
      className={`flex mx-[22px] flex-row items-center justify-between my-6`}
    >
      <Pressable onPress={() => navigation.goBack()}>
        <Div className={`flex g-4 flex-row items-center`}>
          <ArrowLeftIcon color={"#fff"} size={20} strokeWidth={2} />
          <Text
            className={`text-accents-12 font-figtree-bold capitalize leading-5`}
          >
            {lastRouteName.name}
          </Text>
        </Div>
      </Pressable>
      <Div className={`flex g-4 flex-row`}>
        {trailing}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Cog6ToothIcon size={24} strokeWidth={2} color={"#fff"} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Label>Test</DropdownMenu.Label>
            <DropdownMenu.Item
              onSelect={() => {
                logOut();
              }}
              style={{
                backgroundColor: "#232323",
                padding: 10,
              }}
              key="2"
            >
              <DropdownMenu.ItemTitle>Log out</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Div>
    </Div>
  );
};

interface BadgeProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const Badge = ({ children }: BadgeProps) => {
  return (
    <Div
      className={`flex flex-row items-center justify-center bg-accents-1 rounded-full px-3 py-1.5 border-accents-12 border`}
    >
      <Text className={`text-accents-12 font-figtree-bold`}>{children}</Text>
    </Div>
  );
};

export const UserInfoScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "user">
> = ({ navigation, route }) => {
  // screen width and height
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

  const handleUserAction = () => {
    console.log("friendShipStatus", friendShipStatus);

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
      actionFn: async () => navigation.navigate("home"),
      text: "Edit profile",
    };
  };

  const { actionFn, text } = useMemo(() => {
    return handleUserAction();
  }, [friendShipStatus, actions]);

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
            <Div
              className={`mt-12 g-3 flex flex-row items-center justify-center`}
            >
              <Badge>Zagreb (fake)</Badge>
              <Badge>TODO</Badge>
              <Badge>TODO</Badge>
            </Div>

            <Div className={`mt-7`}>
              <Text
                className={`font-figtree-medium text-base text-center text-accents-12 tracking-wide leading-7`}
              >
                Je*enti, samo Split, samo Mediteran, nebriga, šporkica i leđero.
                Ovo je čudo, znači ovo ja u životu nisan vidia da ja mogu
                četrspet minuta stajat na mistu
              </Text>
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
