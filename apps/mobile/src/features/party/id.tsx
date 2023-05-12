import { CoverTextShadowStyle, Div, T } from "@components/index";
import { NavBar } from "@components/navbar";
import { SafeArea } from "@components/safe-area";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useMemo } from "react";

import { ActionSheet, actionSheetRef } from "@components/action-sheet";
import { Badge } from "@components/badge";
import { Button } from "@components/button";
import { PartyCover } from "@components/party-cover";
import { PostGallery } from "@components/post-gallery";
import { Spinner } from "@components/spinner";
import { UserList } from "@components/user-h-list";
import { useMutatePartyAttendance } from "@hooks/mutation/useMutatePartyAttendance";
import { useParty } from "@hooks/query/useParty";
import { usePartyAttendance } from "@hooks/query/usePartyAttendance";
import { usePartyAttendanceMe } from "@hooks/query/usePartyAttendanceMe";
import { usePartyPosts } from "@hooks/query/usePartyPosts";
import { addFillerPosts } from "@hooks/query/useUserPosts";
import { useAuthUser } from "@hooks/useAuthUser";
import { formatUserDisplayName, partyDateFormatStr } from "@lib/misc";
import { queryClient } from "@lib/queryCache";
import { FlashList } from "@shopify/flash-list";
import { format, isAfter } from "date-fns";
import { hr } from "date-fns/locale";
import { Platform, Pressable, Share } from "react-native";
import { MapPinIcon, ShareIcon, UserIcon } from "react-native-heroicons/mini";
import {
  ChatBubbleBottomCenterIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import openMap from "react-native-open-maps";
import colors from "../../../colors";

export const PartyInfo: FC<
  NativeStackScreenProps<StackNavigatorParams, "party">
> = ({ navigation, route }) => {
  const partyId = route.params.id;

  const { data: party, isLoading } = useParty(partyId);
  const user = useAuthUser();

  const { mutateAsync: attend, isLoading: isAttendingLoading } =
    useMutatePartyAttendance(partyId, user?.data?.user?.id);

  const { data: attendanceMe, isLoading: isAttendanceLoading } =
    usePartyAttendanceMe(partyId, user?.data?.user?.id);

  const { data: attendance, isLoading: isAttendanceListLoading } =
    usePartyAttendance(partyId);

  const { data: posts, isLoading: isPostsLoading } = usePartyPosts(partyId);

  const postsFlat = useMemo(() => {
    const p = posts?.pages.map((p) => p.data).flat();
    return addFillerPosts(p ?? []);
  }, [posts]);

  const hasBg = !!party?.imageUrl;
  const isMyParty = party?.hostId === user?.data?.user?.id;
  const partyTime = new Date(party?.time_starting) ?? new Date();
  const partyStarted = isAfter(new Date(), partyTime);

  return (
    <SafeArea className={`flex-1`} midGradient={false} gradient={!hasBg}>
      <PartyCover imgUri={party?.imageUrl} />
      <NavBar includeDefaultTrailing={false} />
      {!isLoading ? (
        <>
          <FlashList
            ListHeaderComponent={() => {
              return (
                <>
                  <SafeArea.Content className="z-10">
                    <T
                      style={CoverTextShadowStyle}
                      className={`text-4xl tracking-tight font-figtree-bold text-accents-12 mt-6`}
                    >
                      {party.name}
                    </T>
                    <T
                      style={CoverTextShadowStyle}
                      className={`text-xl font-figtree-medium capitalize text-accents-11 mt-2`}
                    >
                      {format(
                        new Date(party.time_starting),
                        partyDateFormatStr,
                        {
                          locale: hr,
                        }
                      )}
                    </T>
                    <Div
                      className={`flex flex-grow-0 flex-row g-3 mt-4 flex-wrap `}
                    >
                      {party?.location && (
                        <Pressable
                          onPress={() => {
                            openMap({
                              query: party?.location,
                            });
                          }}
                        >
                          <Badge icon={<MapPinIcon color={"#fff"} size={16} />}>
                            {party.location}
                          </Badge>
                        </Pressable>
                      )}
                      <Pressable
                        onPress={() =>
                          navigation.navigate("user", {
                            id: (party.host as any).id,
                            previousScreenName: party?.name ?? "Party",
                          })
                        }
                      >
                        <Badge icon={<UserIcon color={"#fff"} size={16} />}>
                          {formatUserDisplayName(
                            (party.host as any).displayname
                          )}
                        </Badge>
                      </Pressable>
                      {party?.tags?.map((tag, i) => (
                        <Badge key={tag + i.toString()} intent="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </Div>
                    <Div>
                      <T
                        style={CoverTextShadowStyle}
                        className={`text-accents-11 mt-4 font-figtree-medium`}
                      >
                        {party.description}
                      </T>
                    </Div>
                    <Div className={`mt-28 flex flex-row g-4`}>
                      <Div className={`flex grow`}>
                        {isMyParty ? (
                          <Div className={`flex flex-row g-2`}>
                            <Button
                              onPress={() => {
                                actionSheetRef.current?.expand();
                              }}
                              className={`flex-1`}
                            >
                              Uredi
                            </Button>
                          </Div>
                        ) : (
                          <>
                            {attendanceMe?.accepted ? (
                              <Button
                                disabled={
                                  isAttendanceLoading ||
                                  isAttendingLoading ||
                                  party?.ended
                                }
                                onPress={async () => {
                                  await attend(false);
                                }}
                                intent="secondary"
                                className={`flex-1`}
                              >
                                Ne dolazim
                              </Button>
                            ) : (
                              <Button
                                disabled={
                                  isAttendanceLoading ||
                                  isAttendingLoading ||
                                  party?.ended
                                }
                                onPress={async () => {
                                  await attend(true);
                                }}
                              >
                                Idem
                              </Button>
                            )}
                          </>
                        )}
                      </Div>
                      {party?.chatId && attendanceMe?.accepted && (
                        <Button
                          iconOnly
                          className={`w-10`}
                          onPress={() => {
                            navigation.navigate("chat", {
                              id: party?.chatId,
                              previousScreenName: party?.name ?? "Party",
                            });
                          }}
                        >
                          <ChatBubbleBottomCenterIcon
                            size={20}
                            strokeWidth={2.4}
                            color={"#000"}
                          />
                        </Button>
                      )}
                      <Button
                        onPress={() => {
                          Platform.select({
                            ios: () => {
                              Share.share({
                                url:
                                  "https://party-app-nextjs.vercel.app/?party=" +
                                  party?.id,
                                title: "Party App - " + party?.name ?? "Party",
                              });
                            },
                            android: () => {
                              Share.share({
                                message:
                                  "https://party-app-nextjs.vercel.app/?party=" +
                                  party?.id,
                                title: "Party App - " + party?.name ?? "Party",
                              });
                            },
                          })();
                        }}
                        iconOnly
                        className={`w-10`}
                      >
                        <ShareIcon size={20} color={"#000"} />
                      </Button>
                    </Div>
                    {/* <T className={`text-accents-12 font-figtree-medium mt-4`}>
          @roko, @div <T className={`text-accents-11`}>i 12 ostalih idu</T>
        </T> */}
                    {/* <Button
                      onPress={() => {
                        navigation.navigate("postAdd", {
                          partyId: partyId,
                          previousScreenName: party?.name ?? "Party",
                        });
                      }}
                      className={`mt-3`}
                      intent="secondary"
                    >
                      Dodaj dojam (privremeno)
                    </Button> */}
                  </SafeArea.Content>
                  <Div className={`mt-6 px-2`}>
                    <UserList
                      emptyText="Još niko ne dolazi"
                      users={(attendance?.map((a) => a.user) as any) ?? []}
                      title="Ko dolazi"
                      onUserPress={(user) => {
                        navigation.navigate("user", {
                          id: user.id,
                          previousScreenName: party?.name ?? "Party",
                        });
                      }}
                    />
                  </Div>
                  <Div
                    className={`justify-between bg-black py-5 mt-8 px-[18px] items-center rounded-t-2xl flex flex-row `}
                  >
                    <T className={`font-figtree-bold text-accents-12 text-xl`}>
                      Objave s partya
                    </T>

                    <Button
                      disabled={
                        isPostsLoading &&
                        !partyStarted &&
                        !attendanceMe?.accepted
                      }
                      onPress={() => {
                        navigation.navigate("postAdd", {
                          partyId: partyId,
                          previousScreenName: party?.name ?? "Party",
                        });
                      }}
                      intent="secondary"
                    >
                      Dodaj
                    </Button>
                  </Div>
                </>
              );
            }}
            data={postsFlat ?? []}
            numColumns={3}
            ListFooterComponent={() => {
              return <Div className={`h-60 bg-black w-full`}></Div>;
            }}
            ListEmptyComponent={() => {
              return (
                <Div className={`h-60 bg-black`}>
                  <Div
                    className={`flex flex-col items-center justify-center h-full`}
                  >
                    {isPostsLoading ? (
                      <Spinner />
                    ) : (
                      <T
                        className={`text-lg font-figtree-medium text-accents-11`}
                      >
                        Party nema objava
                      </T>
                    )}
                  </Div>
                </Div>
              );
            }}
            estimatedItemSize={300}
            stickyHeaderIndices={[0]}
            renderItem={({ item, target }) => {
              return (
                <PostGallery
                  item={item}
                  navigation={navigation}
                  onPress={() => {
                    navigation.push("post", {
                      id: (item as any)?.id,
                      previousScreenName: formatUserDisplayName(
                        party?.name ?? "Party"
                      ),
                    });
                  }}
                  target={target}
                />
              );
            }}
          />
        </>
      ) : (
        <Div className={`flex flex-col items-center justify-center flex-grow`}>
          <Spinner />
        </Div>
      )}

      <ActionSheet>
        <ActionSheet.Item
          onPress={() => {
            if (party?.ended) return;
            navigation.push("party-add", {
              id: partyId,
            });
          }}
        >
          <ActionSheet.ItemIcon>
            <PencilIcon
              strokeWidth={1.75}
              size={22}
              color={party?.ended ? colors.accents[8] : "white"}
            />
          </ActionSheet.ItemIcon>
          <ActionSheet.ItemTitle
            style={party?.ended ? { color: colors.accents[8] } : {}}
          >
            Izmjeni podatke
          </ActionSheet.ItemTitle>
        </ActionSheet.Item>
        <ActionSheet.Item
          onPress={async () => {
            await supabase
              .from("Party")
              .update({ ended: true })
              .filter("id", "eq", partyId);
            queryClient.invalidateQueries(queryKeys.latestParties);
            queryClient.invalidateQueries(queryKeys.partyId(partyId));
          }}
        >
          <ActionSheet.ItemIcon>
            <CheckIcon
              strokeWidth={1.75}
              size={22}
              color={party?.ended ? colors.accents[8] : "white"}
            />
          </ActionSheet.ItemIcon>
          <ActionSheet.ItemTitle
            style={party?.ended ? { color: colors.accents[8] } : {}}
          >
            {!party?.ended ? "Završi" : "Završio"}{" "}
          </ActionSheet.ItemTitle>
        </ActionSheet.Item>

        <ActionSheet.Item
          onLongPress={async () => {
            await supabase.from("Party").delete().filter("id", "eq", partyId);
            queryClient.invalidateQueries(queryKeys.latestParties);
            navigation.goBack();
          }}
        >
          <ActionSheet.ItemIcon>
            <TrashIcon
              strokeWidth={1.75}
              size={22}
              color={colors.error.primary}
            />
          </ActionSheet.ItemIcon>
          <ActionSheet.ItemTitle style={{ color: colors.error.primary }}>
            Izbriši (drži za potvrdu)
          </ActionSheet.ItemTitle>
        </ActionSheet.Item>
      </ActionSheet>
    </SafeArea>
  );
};
