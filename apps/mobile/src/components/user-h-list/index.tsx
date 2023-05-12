import { Div, Img, PlaceHolderUserImage, T } from "@components/index";
import { Spinner } from "@components/spinner";
import { FriendshipUser } from "@hooks/query/useFriendship";
import { formatName, formatUserDisplayName } from "@lib/misc";
import { format } from "date-fns";
import { Pressable, ScrollView } from "react-native";

export interface BaseUserListUser {
  id: string;
  displayname: string;
  surname: string;
  name: string;
  imagesId: string;
}
export interface UserListUser extends BaseUserListUser {}

export interface UserListProps {
  children?: React.ReactNode | React.ReactNode[];
  users: UserListUser[];
  title?: string;
  loading?: boolean;
  emptyText?: string;
  onViewAllPress?: () => void;
  onUserPress?: (user: FriendshipUser) => void;
}

export const UserList = ({
  users,
  onUserPress,
  title,
  loading = false,
  emptyText,
  onViewAllPress,
}: UserListProps) => {
  const hasFriends = users?.length > 0;

  return (
    <Div
      className={`flex flex-col g-7 px-5 bg-accents-1 rounded-3xl py-6 border-accents-2 border`}
    >
      <Div className={`w-full flex justify-between flex-row`}>
        <T className={`font-figtree-bold text-accents-12 text-xl`}>
          {title ? title : "Prijatelji"}
        </T>
        <Pressable onPress={onViewAllPress}>
          {/* <T className={`font-figtree-semi-bold text-accents-11 text-base`}>
            Vidi sve
          </T> */}
        </Pressable>
      </Div>
      {loading ? (
        <Div className={`h-44 flex items-center justify-center`}>
          <Spinner />
        </Div>
      ) : (
        <>
          {hasFriends ? (
            <ScrollView
              horizontal
              contentContainerStyle={{
                alignItems: "center",
                flexDirection: "row",
                gap: 22,
              }}
            >
              {users.map((user, i) => (
                <Pressable
                  key={i.toString()}
                  onPress={() => {
                    onUserPress?.(user);
                  }}
                >
                  <Div
                    className={`flex flex-col items-center justify-between g-4`}
                  >
                    <Img
                      className={`w-28 h-28 rounded-full`}
                      source={
                        user?.imagesId
                          ? {
                              uri: user.imagesId,
                            }
                          : PlaceHolderUserImage
                      }
                    />
                    <Div
                      className={`flex flex-col items-center  justify-center`}
                    >
                      <T
                        className={`font-figtree-bold text-center text-lg text-accents-12`}
                      >
                        {formatName(user.name, user.surname)}
                      </T>
                      <T className={`font-figtree text-accents-11 text-center`}>
                        {formatUserDisplayName(user.displayname)}
                      </T>
                    </Div>
                  </Div>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <Div className={`h-44 flex items-center justify-center`}>
              <T className={`text-accents-10 text-base font-figtree-medium`}>
                {emptyText ?? "Korisnik nema prijatelja"}
              </T>
            </Div>
          )}
        </>
      )}
    </Div>
  );
};

export interface BaseUserListPartyList {
  id: string;
  name: string;
  time_starting: string;
  imageUrl: string;
}
export interface PartyListParty extends BaseUserListPartyList {}

export interface PartyListProps {
  children?: React.ReactNode | React.ReactNode[];
  partys: PartyListParty[];
  title?: string;
  loading?: boolean;
  emptyText?: string;
  onViewAllPress?: () => void;
  onUserPress?: (p: PartyListParty) => void;
}

export const PartyList = ({
  partys,
  onUserPress,
  title,
  loading = false,
  emptyText,
  onViewAllPress,
}: PartyListProps) => {
  const hasPartys = partys?.length > 0;

  return (
    <Div
      className={`flex flex-col g-7 px-5 bg-accents-1 rounded-3xl py-6 border-accents-2 border`}
    >
      <Div className={`w-full flex justify-between flex-row`}>
        <T className={`font-figtree-bold text-accents-12 text-xl`}>
          {title ? title : "Prijatelji"}
        </T>
        <Pressable onPress={onViewAllPress}>
          {/* <T className={`font-figtree-semi-bold text-accents-9 text-base`}>
            Vidi sve
          </T> */}
        </Pressable>
      </Div>
      {loading ? (
        <Div className={`h-44 flex items-center justify-center`}>
          <Spinner />
        </Div>
      ) : (
        <>
          {hasPartys ? (
            <ScrollView
              horizontal
              contentContainerStyle={{
                alignItems: "center",
                flexDirection: "row",
                gap: 22,
              }}
            >
              {partys.map((p, i) => {
                const date = new Date(p?.time_starting ?? 0);
                const t = format(date, "dd.MM.yyyy");

                return (
                  <Pressable
                    key={i.toString()}
                    onPress={() => {
                      onUserPress?.(p);
                    }}
                  >
                    <Div
                      className={`flex flex-col items-center justify-between g-4`}
                    >
                      <Img
                        className={`w-28 h-28 bg-accents-3 rounded-[28px]`}
                        source={{
                          uri: p?.imageUrl,
                        }}
                      />
                      <Div
                        className={`flex flex-col items-center  justify-center`}
                      >
                        <T
                          className={`font-figtree-bold text-center text-lg text-accents-12`}
                        >
                          {p?.name}
                        </T>
                        <T
                          className={` text-accents-11 text-center font-figtree-medium`}
                        >
                          {t}
                        </T>
                      </Div>
                    </Div>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <Div className={`h-44 flex items-center justify-center`}>
              <T className={`text-accents-10 text-base font-figtree-medium`}>
                {emptyText ?? "0 za sada :<"}
              </T>
            </Div>
          )}
        </>
      )}
    </Div>
  );
};
