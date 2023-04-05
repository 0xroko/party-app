import { Div, T } from "@components/index";
import { NavBar } from "@components/navbar";
import { SafeArea } from "@components/safe-area";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { useQuery } from "react-query";

const useParty = (partyId?: string) => {
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

  return q;
};

export const partyDateFormat = "HH:mm EEE, dd.MM.yyyy";

import { format } from "date-fns";

import { Badge } from "@components/badge";
import { Button } from "@components/button";
import { UserList } from "@features/user/id";
import { formatUserDisplayName } from "@lib/misc";
import { hr } from "date-fns/locale";
import { Image } from "expo-image";
import { ShareIcon, UserIcon } from "react-native-heroicons/mini";

export const PartyInfo: FC<
  NativeStackScreenProps<StackNavigatorParams, "party">
> = ({ navigation, route }) => {
  const partyId = route.params.id;

  const { data: party } = useParty(partyId);

  if (!party) {
    return null;
  }

  return (
    <SafeArea midGradient={false}>
      <Image
        style={{ height: "55%", width: "100%", position: "absolute" }}
        source={require("../../assets/ppp.png")}
      ></Image>
      <NavBar />
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
          <Badge icon={<UserIcon color={"#fff"} size={16} />}>
            {formatUserDisplayName((party.host as any).displayname)}
          </Badge>
          <Badge>TAGS (NEMA IH U DB)</Badge>
        </Div>
        <Div>
          <T className={`text-accents-11 mt-4 font-figtree-medium`}>
            {party.description}
          </T>
        </Div>
        <Div className={`mt-28 flex flex-row g-4`}>
          <Div className={`flex grow`}>
            <Button>Idem</Button>
          </Div>
          <Button iconOnly className={`w-10`}>
            <ShareIcon size={20} color={"#000"} />
          </Button>
        </Div>
        <T className={`text-accents-12 font-figtree-medium mt-4`}>
          @roko, @div <T className={`text-accents-11`}>i 12 ostalih idu</T>
        </T>
      </SafeArea.Content>
      <Div className={`mt-6 px-2`}>
        <UserList users={[]} title="Ko dolazi" />
      </Div>
    </SafeArea>
  );
};