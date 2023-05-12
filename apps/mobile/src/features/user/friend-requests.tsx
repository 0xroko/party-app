import { SafeArea } from "@components/safe-area";

import { Button } from "@components/button";
import {
  Div,
  EmptyPageMessage,
  Img,
  PageTitle,
  PlaceHolderUserImage,
  Text,
} from "@components/index";
import { NavBar } from "@components/navbar";
import { Spinner } from "@components/spinner";
import { useFriendRequestAction } from "@hooks/mutation/useFriendRequestAction";
import { useFriendRequests } from "@hooks/query/useFriendRequests";
import { useUser } from "@hooks/query/useUser";
import { useAuthUser } from "@hooks/useAuthUser";
import { User } from "@lib/actions";
import { formatName, formatUserDisplayName } from "@lib/misc";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { RefreshControl, ScrollView, TouchableOpacity } from "react-native";

export const UserFriendReqests: FC<
  NativeStackScreenProps<StackNavigatorParams, "user-friend-request">
> = ({ navigation, route }) => {
  // screen width and height

  const { data: authUser, isFetched } = useAuthUser();
  const { data: user, isLoading } = useUser(authUser?.user?.id);

  const {
    data: friendRequests,
    isLoading: isFriendRequestsLoading,
    refetch,
  } = useFriendRequests(authUser?.user);

  const {
    mutateAsync: friendRequestAction,
    isLoading: isfriendRequestActionLoading,
  } = useFriendRequestAction();

  return (
    <SafeArea gradient>
      <NavBar
        showBackButton={route.params?.showBackButton}
        showNavBar={route.params?.showNavBar}
        includeDefaultTrailing={false}
      />
      <SafeArea.Content>
        <PageTitle>Zathjevi </PageTitle>
        {isFriendRequestsLoading ? (
          <Div className={`h-96 `}>
            <Spinner />
          </Div>
        ) : (
          <>
            {friendRequests?.length === 0 ? (
              <EmptyPageMessage>Trenutno nemaš zahtjeva</EmptyPageMessage>
            ) : (
              <ScrollView
                style={{ height: "100%" }}
                contentContainerStyle={{
                  gap: 10,
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={isFriendRequestsLoading}
                    onRefresh={refetch}
                  />
                }
              >
                {friendRequests?.map((friendRequest) => {
                  const user = (friendRequest.userAId === authUser?.user?.id
                    ? friendRequest.userB
                    : friendRequest.userA) as unknown as Pick<
                    User,
                    "id" | "name" | "surname" | "displayname" | "imagesId"
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
                      key={friendRequest?.id}
                      className={`flex flex-row items-center  rounded-lg justify-between`}
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
                            source={
                              user?.imagesId
                                ? {
                                    uri: user?.imagesId,
                                  }
                                : PlaceHolderUserImage
                            }
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
                            loading={isfriendRequestActionLoading}
                            onPress={async () => {
                              await friendRequestAction({
                                friendId: user.id,
                                authUser: authUser,
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
                            onPress={async () => {
                              await friendRequestAction({
                                friendId: user.id,
                                authUser: authUser,
                                action: "accept",
                              });
                            }}
                            loading={isfriendRequestActionLoading}
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
          </>
        )}
      </SafeArea.Content>
    </SafeArea>
  );
};
