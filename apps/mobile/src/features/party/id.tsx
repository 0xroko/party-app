import { Div, T } from "@components/index";
import { NavBar } from "@components/navbar";
import { SafeArea } from "@components/safe-area";
import { useRefreshOnFocus } from "@hooks/useRefetchOnFocus";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { useQuery } from "react-query";

export const useParty = (partyId?: string) => {
  const q = useQuery(
    queryKeys.partyId(partyId),
    async () => {
      const { data, error } = await supabase
        .from("Party")
        .select(
          `*, 
        host:hostId (id, displayname)`
        )
        .eq("id", partyId)
        .single();

      return data;
    },
    {
      enabled: !!partyId,
    }
  );

  useRefreshOnFocus(q.refetch);

  return q;
};

export const partyDateFormat = "HH:mm EEE, dd.MM.yyyy";

import { format, isAfter } from "date-fns";

import { Badge } from "@components/badge";
import { Button } from "@components/button";
import { Spinner } from "@components/spinner";
import { UserList } from "@features/user/id";
import { useAuthUser } from "@hooks/useAuthUser";
import { formatUserDisplayName } from "@lib/misc";
import { hr } from "date-fns/locale";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";
import { ShareIcon, UserIcon } from "react-native-heroicons/mini";

interface PartyCoverProps {
  children?: React.ReactNode | React.ReactNode[];
  imgUri?: string;
}
export const PartyCover = ({ children, imgUri }: PartyCoverProps) => {
  return (
    <Div
      className={`absolute`}
      style={{
        height: "55%",
        width: "100%",
      }}
    >
      <Image
        style={{
          height: "100%",
          width: "100%",
          opacity: 0.8,
        }}
        source={{ uri: imgUri }}
      ></Image>
      <LinearGradient
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        // Background Linear Gradient
        locations={[0.0, 0.3, 0.9]}
        colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,1)"]}
      />
    </Div>
  );
};

export const PartyInfo: FC<
  NativeStackScreenProps<StackNavigatorParams, "party">
> = ({ navigation, route }) => {
  const partyId = route.params.id;

  const { data: party, isLoading } = useParty(partyId);
  const user = useAuthUser();

  const hasBg = !!party?.imageUrl;

  const isMyParty = party?.hostId === user?.data?.user?.id;

  const partyTime = new Date(party?.time_starting) ?? new Date();

  const partyStarted = isAfter(new Date(), partyTime);

  return (
    <SafeArea midGradient={false} gradient={!hasBg}>
      <PartyCover imgUri={party?.imageUrl} />
      <NavBar includeDefaultTrailing={false} />
      {!isLoading ? (
        <>
          <SafeArea.Content className="z-10">
            <T
              className={`text-4xl tracking-tight font-figtree-bold text-accents-12 mt-6`}
            >
              {party.name}
            </T>
            <T
              style={{
                textShadowColor: "#00000077",
                textShadowRadius: 9,
              }}
              className={`text-xl font-figtree-medium capitalize text-accents-11 mt-2`}
            >
              {format(new Date(party.time_starting), partyDateFormat, {
                locale: hr,
              })}
            </T>
            <Div className={`flex flex-grow-0 flex-row g-3 mt-4 flex-wrap `}>
              <Badge>{party.location}</Badge>
              <Pressable
                onPress={() =>
                  navigation.navigate("user", {
                    id: (party.host as any).id,
                    previousScreenName: party?.name ?? "Party",
                  })
                }
              >
                <Badge icon={<UserIcon color={"#fff"} size={16} />}>
                  {formatUserDisplayName((party.host as any).displayname)}
                </Badge>
              </Pressable>
              <Badge>TAGS (NEMA IH U DB)</Badge>
            </Div>
            <Div>
              <T className={`text-accents-11 mt-4 font-figtree-medium`}>
                {party.description}
              </T>
            </Div>
            <Div className={`mt-28 flex flex-row g-4`}>
              <Div className={`flex grow`}>
                {isMyParty ? (
                  <Div className={`flex flex-row g-2`}>
                    <Button disabled className={`flex-1`}>
                      Uredi
                    </Button>
                    <Button className={`flex-1`}>Obriši</Button>
                    {partyStarted && (
                      <Button className={`flex-1`}>Završi</Button>
                    )}
                  </Div>
                ) : (
                  <Button>Idem</Button>
                )}
              </Div>
              <Button iconOnly className={`w-10`}>
                <ShareIcon size={20} color={"#000"} />
              </Button>
            </Div>
            {/* <T className={`text-accents-12 font-figtree-medium mt-4`}>
          @roko, @div <T className={`text-accents-11`}>i 12 ostalih idu</T>
        </T> */}
          </SafeArea.Content>
          <Div className={`mt-6 px-2`}>
            <UserList
              emptyText="Još niko ne dolazi"
              users={[]}
              title="Ko dolazi"
            />
          </Div>
        </>
      ) : (
        <Div className={`flex flex-col items-center justify-center flex-grow`}>
          <Spinner />
        </Div>
      )}
    </SafeArea>
  );
};
