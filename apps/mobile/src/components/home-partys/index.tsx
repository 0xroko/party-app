import {
  Div,
  Img,
  PlaceHolderUserImage,
  T,
  placeHolderBaseImage,
} from "@components/index";
import { useUser } from "@hooks/query/useUser";
import { useAuthUser } from "@hooks/useAuthUser";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMemo } from "react";
import { Pressable, ScrollView } from "react-native";
import { useQuery } from "react-query";

const useParties = () => {
  const q = useQuery(queryKeys.latestParties, async () => {
    const authUser = await supabase.auth.getUser();
    const { data: friends } = await supabase
      .from("Friendship")
      .select(`*`)
      .eq("userAId", authUser?.data?.user?.id)
      .filter("accepted", "eq", true);

    if (!friends) return [];

    const { data, error } = await supabase
      .from("Party")
      .select(
        `*,
        host: hostId(id, displayname, imagesId)
    `
      )
      .eq("ended", false)
      .in(
        "hostId",
        friends?.map((friend) => friend?.userBId)
      )
      .order("time_starting", { ascending: true });

    return data ?? [];
  });

  return q;
};

interface HomePartysProps {
  children?: React.ReactNode | React.ReactNode[];
  navigation?: NativeStackNavigationProp<
    StackNavigatorParams,
    "home",
    undefined
  >;
}

export const HomePartys = ({ children, navigation }: HomePartysProps) => {
  const { data: authUser, isFetched, refetch } = useAuthUser();

  const { data: parties, isFetched: partiesFetched } = useParties();
  const { data: authUserData, isFetched: authUserFetched } = useUser(
    authUser?.user.id
  );

  const placeHolder = useMemo(() => {
    return new Array(5).fill(0);
  }, []);

  return (
    <Div className={`flex grow-0 mb-1`}>
      {partiesFetched ? (
        <>
          {parties?.length > 0 ? (
            <ScrollView
              horizontal
              contentContainerStyle={{
                paddingTop: 8,
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 18,
                gap: 8,
              }}
            >
              <Pressable
                key={authUser?.user.id}
                onPress={() => {
                  navigation.navigate("party-add");
                }}
              >
                <Div className={`flex g-3 w-24 h-36 items-center`}>
                  <Div className={`relative`}>
                    <Div
                      className={`absolute -right-2 -bottom-2 w-8 h-8 flex justify-center z-50 items-center rounded-xl bg-[#3c165c]`}
                    >
                      <T
                        className={`font-figtree-semi-bold text-3xl leading-8 text-accents-12`}
                      >
                        +
                      </T>
                    </Div>
                    <Img
                      recyclingKey={authUserData?.imagesId}
                      className={`w-20 h-20 rounded-full`}
                      placeholder={{
                        uri: placeHolderBaseImage,
                      }}
                      source={{
                        uri: authUserData?.imagesId ?? placeHolderBaseImage,
                      }}
                    ></Img>
                  </Div>
                  <T
                    className={`text-center text-accents-12 font-figtree-bold text-sm px-1`}
                  >
                    Dodaj party
                  </T>
                </Div>
              </Pressable>
              {parties?.map((party) => {
                // @ts-ignore
                const hostAvatar = party?.host?.imagesId;
                return (
                  <Pressable
                    key={party.id}
                    onLongPress={() => {
                      navigation.navigate("chat", {
                        id: party.chatId,
                      });
                    }}
                    onPress={() => {
                      navigation.navigate("party", {
                        id: party.id,
                        previousScreenName: "Home",
                      });
                    }}
                  >
                    <Div className={`flex g-3 w-24 h-36 items-center relative`}>
                      <Img
                        className={`w-20 h-20 rounded-full border-0 border-spacing-2 border-accents-12`}
                        source={{
                          uri:
                            party.imageUrl ??
                            hostAvatar ??
                            placeHolderBaseImage,
                        }}
                      ></Img>
                      {party?.imageUrl && (
                        <Div
                          className={`absolute bottom-14 shadow-2xl right-0`}
                        >
                          <Img
                            contentFit="contain"
                            className={`h-8 w-8 rounded-xl border-2 border-black`}
                            source={{
                              uri: hostAvatar,
                            }}
                          ></Img>
                        </Div>
                      )}
                      <T
                        className={`text-center text-accents-12 font-figtree-bold text-sm px-1`}
                      >
                        {party.name}
                      </T>
                      {/* <T
                    className={`text-center text-accents-10 font-figtree-bold text-sm px-1`}
                    >
                    {formatUserDisplayName((party?.host as any)?.displayname)}
                  </T> */}
                    </Div>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <Div
              className={`flex flex-row`}
              style={{
                paddingTop: 8,
                gap: 8,
                paddingHorizontal: 18,
              }}
            >
              <Pressable
                key={authUser?.user.id}
                onPress={() => {
                  navigation.navigate("party-add");
                }}
              >
                <Div className={`flex g-3 w-24 h-36 items-center`}>
                  <Div className={`relative`}>
                    <Div
                      className={`absolute -right-2 -bottom-2 w-8 h-8 flex justify-center z-50 items-center rounded-xl bg-[#3c165c]`}
                    >
                      <T
                        className={`font-figtree-semi-bold text-3xl leading-8 text-accents-12`}
                      >
                        +
                      </T>
                    </Div>
                    <Img
                      recyclingKey={authUserData?.imagesId}
                      className={`w-20 h-20 rounded-full`}
                      source={
                        authUserData?.imagesId
                          ? {
                              uri: authUserData?.imagesId,
                            }
                          : PlaceHolderUserImage
                      }
                    ></Img>
                  </Div>
                  <T
                    className={`text-center text-accents-12 font-figtree-bold text-sm px-1`}
                  >
                    Dodaj party
                  </T>
                </Div>
              </Pressable>
              <Div className={`flex-row flex h-36 flex-1 justify-center`}>
                <T className={`text-accents-4 font-figtree-medium mt-10`}>
                  Nema prijateljskih partyija
                </T>
              </Div>
            </Div>
          )}
        </>
      ) : (
        <Div
          style={{
            paddingTop: 8,
            gap: 8,
            paddingHorizontal: 18,
          }}
          className={`flex-row flex`}
        >
          {placeHolder.map((_, i) => (
            <Div key={i} className={`flex g-3 w-24 h-36 items-center relative`}>
              <Div
                className={`w-20 h-20 rounded-full border-0 border-spacing-2 border-accents-12 bg-accents-3`}
              ></Div>
              {i > 0 && (
                <Div className={`absolute bottom-14 shadow-2xl right-0`}>
                  <Div
                    className={`h-8 w-8 rounded-xl border-2 border-black bg-accents-3`}
                  ></Div>
                </Div>
              )}
              <Div
                className={`text-center text-accents-12 font-figtree-bold text-sm px-1 h-4 py-1 w-20 bg-accents-3 rounded-full`}
              ></Div>
            </Div>
          ))}
        </Div>
      )}
    </Div>
  );
};
