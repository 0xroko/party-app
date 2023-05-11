import { CoverTextShadowStyle, Div, T } from "@components/index";
import { NavBar } from "@components/navbar";
import { SafeArea } from "@components/safe-area";
import { useRefreshOnFocus } from "@hooks/useRefetchOnFocus";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { useMutation, useQuery } from "react-query";

import { format, isAfter } from "date-fns";

import { ActionSheet, actionSheetRef } from "@components/action-sheet";
import { Badge } from "@components/badge";
import { Button } from "@components/button";
import { Spinner } from "@components/spinner";
import { UserList } from "@features/user/id";
import { useAuthUser } from "@hooks/useAuthUser";
import { formatUserDisplayName } from "@lib/misc";
import { queryClient } from "@lib/queryCache";
import { hr } from "date-fns/locale";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";
import { MapPinIcon, ShareIcon, UserIcon } from "react-native-heroicons/mini";
import { PencilIcon, TrashIcon } from "react-native-heroicons/outline";
import colors from "../../../colors";

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

export const usePartyAttendanceMe = (partyId?: string, userId?: string) => {
  const q = useQuery(
    queryKeys.partyAttendanceMe(partyId),
    async () => {
      const { data, error } = await supabase
        .from("Attending")
        .select(
          `*, 
        user:userId (id, displayname)`
        )
        .eq("partyId", partyId)
        .eq("userId", userId)
        .single();
      return data;
    },
    {
      enabled: !!partyId && !!userId,
    }
  );

  return q;
};

export const useMutatePartyAttendance = (partyId?: string, userId?: string) => {
  const a = useMutation(async (accepted: boolean) => {
    const { data } = await supabase.from("Attending").upsert(
      {
        partyId,
        userId,
        accepted: accepted,
      },
      { onConflict: "partyId, userId" }
    );

    queryClient.invalidateQueries(queryKeys.partyAttendanceMe(partyId));
    queryClient.invalidateQueries(queryKeys.partyAttendance(partyId));
    return data;
  });

  return a;
};

export const usePartyAttendance = (partyId?: string) => {
  const q = useQuery(
    queryKeys.partyAttendance(partyId),
    async () => {
      const { data, error } = await supabase
        .from("Attending")
        .select(
          `*, 
        user:userId (id, displayname, imagesId, name, surname)`
        )
        .eq("partyId", partyId)
        .eq("accepted", true);

      return data;
    },
    {
      enabled: !!partyId,
    }
  );

  return q;
};

export const partyDateFormat = "HH:mm EEE, dd.MM.yyyy";

interface PartyCoverProps {
  children?: React.ReactNode | React.ReactNode[];
  imgUri?: string;
  height?: number | string;
}

export const PartyCover = ({ children, imgUri, height }: PartyCoverProps) => {
  return (
    <Div
      className={`absolute`}
      style={{
        height: height ?? "55%",
        width: "100%",
      }}
    >
      <Image
        style={{
          height: "100%",
          width: "100%",
          opacity: 0.5,
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

  const { mutateAsync: attend, isLoading: isAttendingLoading } =
    useMutatePartyAttendance(partyId, user?.data?.user?.id);

  const { data: attendanceMe, isLoading: isAttendanceLoading } =
    usePartyAttendanceMe(partyId, user?.data?.user?.id);

  const { data: attendance, isLoading: isAttendanceListLoading } =
    usePartyAttendance(partyId);

  return (
    <SafeArea className={`flex-1`} midGradient={false} gradient={!hasBg}>
      <PartyCover imgUri={party?.imageUrl} />
      <NavBar includeDefaultTrailing={false} />
      {!isLoading ? (
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
              {format(new Date(party.time_starting), partyDateFormat, {
                locale: hr,
              })}
            </T>
            <Div className={`flex flex-grow-0 flex-row g-3 mt-4 flex-wrap `}>
              <Badge icon={<MapPinIcon color={"#fff"} size={16} />}>
                {party.location}
              </Badge>
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
                        disabled={isAttendanceLoading || isAttendingLoading}
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
                        disabled={isAttendanceLoading || isAttendingLoading}
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
              <Button onPress={() => {}} iconOnly className={`w-10`}>
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
              users={(attendance?.map((a) => a.user) as any) ?? []}
              title="Ko dolazi"
            />
          </Div>
        </>
      ) : (
        <Div className={`flex flex-col items-center justify-center flex-grow`}>
          <Spinner />
        </Div>
      )}

      <ActionSheet>
        <ActionSheet.Item
          onPress={() => {
            navigation.push("party-add", {
              id: partyId,
            });
          }}
        >
          <ActionSheet.ItemIcon>
            <PencilIcon strokeWidth={1.75} size={22} color={"white"} />
          </ActionSheet.ItemIcon>
          <ActionSheet.ItemTitle>Izmjeni podatke</ActionSheet.ItemTitle>
        </ActionSheet.Item>

        <ActionSheet.Item
          onLongPress={() => {
            actionSheetRef.current?.close();
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
