import { Button } from "@components/button";
import { Div, Img, T } from "@components/index";
import { NavBar } from "@components/navbar";
import { SafeArea } from "@components/safe-area";
import { User } from "@lib/actions";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { FC, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CheckCircleIcon } from "react-native-heroicons/outline";
import { useQuery } from "react-query";
import { create } from "zustand";

// create zustand store and for tagged users per postIndex

export type Friend = Pick<
  User,
  "id" | "name" | "surname" | "displayname" | "imagesId"
>;

export type useAllFriendsData = {
  id: string;
  userAId: string;
  userBId: string;
  accepted: boolean;
  friend: Friend;
};

export const useAllFriends = (userId: User["id"]) => {
  const req = useQuery(
    queryKeys.allFriends(userId),
    async () => {
      let q = supabase
        .from("Friendship")
        .select(
          "id, userAId, userBId, accepted, friend: userBId (id, name, surname, displayname, imagesId)"
        )
        .eq("userAId", userId)
        .eq("accepted", true)
        .order("createdAt", { ascending: false });

      const { data, error } = await q;

      return data as useAllFriendsData[];
    },
    {
      enabled: !!userId,
    }
  );

  return req;
};

type TaggedUserRecord = Record<string, Friend[]>;

interface TagStore {
  taggedUsers: TaggedUserRecord;
  addTaggedUser: (user: Friend) => void;
  removeTaggedUser: (user: Friend) => void;
  clearTaggedUsers: () => void;
  setCurrentImgID: (currentImgID: string) => void;
  isAdded: (user: Friend) => boolean;
  clearForCurrentImgID: (currentImgID: string) => void;
  currentImgID: string;
  countTaggedUsers: (currentImgID: string) => number;
  getTaggedUsers: (currentImgID: string) => Friend[];
}

export const useTaggedUsers = create<TagStore>()((set, get) => ({
  currentImgID: "",
  setCurrentImgID: (currentImgID: string) => {
    set((state) => ({
      ...state,
      currentImgID: currentImgID,
    }));
  },
  clearForCurrentImgID: (currentImgID: string) => {
    set((state) => ({
      ...state,
      taggedUsers: {
        ...state.taggedUsers,
        [currentImgID]: [],
      },
    }));
  },
  getTaggedUsers: (currentImgID: string) => {
    const taggedUsers = get().taggedUsers[currentImgID] ?? [];
    return taggedUsers;
  },
  countTaggedUsers: (currentImgID: string) => {
    const taggedUsers = get().taggedUsers[currentImgID] ?? [];
    return taggedUsers.length ?? 0;
  },
  addTaggedUser: (user: User) => {
    set((state) => {
      const currentTaggedUsers = state.taggedUsers[state.currentImgID] ?? [];

      const newTaggedUsers = [...currentTaggedUsers, user];

      return {
        ...state,
        taggedUsers: {
          ...state.taggedUsers,
          [state.currentImgID]: newTaggedUsers,
        },
      };
    });
  },
  removeTaggedUser: (user: User) => {
    set((state) => {
      const currentTaggedUsers = state.taggedUsers[state.currentImgID] ?? [];

      const newTaggedUsers = currentTaggedUsers.filter((u) => u.id !== user.id);

      return {
        ...state,
        taggedUsers: {
          ...state.taggedUsers,
          [state.currentImgID]: newTaggedUsers,
        },
      };
    });
  },
  taggedUsers: {},
  clearTaggedUsers: () => {
    set((state) => ({
      ...state,
      taggedUsers: {},
    }));
  },
  isAdded: (user: User) => {
    const taggedUsers = get().taggedUsers[get().currentImgID] ?? [];
    return taggedUsers.some((u) => u.id === user.id);
  },
}));

export const TagModal: FC<
  NativeStackScreenProps<StackNavigatorParams, "tag-users">
> = ({ navigation, route }) => {
  const [value, setValue] = useState("");

  const { data: users } = useAllFriends(route.params.userId);

  const { addTaggedUser, removeTaggedUser, isAdded, getTaggedUsers } =
    useTaggedUsers();

  const taggedUsers = getTaggedUsers(route.params.imgUuId);

  return (
    <SafeArea>
      <NavBar></NavBar>
      <Div
        style={{
          flex: 1,
        }}
        className={`mx-[18px]`}
      >
        {/* <Input
          value={value}
          onChangeText={(text) => setValue(text)}
          placeholder={"Traži korisnike"}
        /> */}
        <T
          className={`text-3xl tracking-tight font-figtree-bold text-accents-12 mb-8 mt-6`}
        >
          Označi prijatelje
        </T>
        <Div
          style={{
            flex: 1,
          }}
        >
          <FlashList
            data={users ?? []}
            estimatedItemSize={80}
            extraData={taggedUsers}
            // keyExtractor={(item) => item.friend.id}
            renderItem={({ item: user, extraData }) => {
              const isTagged = extraData?.some(
                (u: Friend) => u?.id === user?.friend?.id
              );

              return (
                <TouchableOpacity
                  onPress={() => {
                    if (isTagged) {
                      removeTaggedUser(user.friend);
                    } else {
                      addTaggedUser(user.friend);
                    }
                  }}
                >
                  <Div className={`w-full h-20 flex`}>
                    <Div className="flex-row p-2 mt-2 justify-between">
                      <Div className={`flex flex-row`}>
                        <Img
                          recyclingKey={user.friend.imagesId}
                          source={{ uri: user.friend.imagesId }}
                          className="w-14 h-14 rounded-full bg-gray-400"
                        />

                        <Div className="flex-row items-start pl-3">
                          <Div className="text-lg">
                            <T className="text-white font-figtree-semi-bold text-lg">
                              {user.friend.name} {user.friend.surname}
                            </T>
                            <T className="text-accents-11 font-figtree-semi-bold text-sm">
                              @{user.friend.displayname}
                            </T>
                          </Div>
                        </Div>
                      </Div>
                      <Div className={`flex justify-center items-center`}>
                        {isTagged && (
                          <CheckCircleIcon
                            color={"#fff"}
                            size={24}
                            strokeWidth={2}
                          />
                        )}
                      </Div>
                    </Div>
                  </Div>
                </TouchableOpacity>
              );
            }}
          />
        </Div>

        <Div className={`flex-row justify-center items-center mb-10`}>
          <Button
            onPress={() => {
              navigation.goBack();
            }}
            className={`w-full`}
          >
            <T className={`text-black font-figtree-bold text-lg`}>Gotovo</T>
          </Button>
        </Div>
      </Div>
    </SafeArea>
  );
};
