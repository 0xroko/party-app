import { Div, EmptyPageMessage, Img, Text } from "@components/index";
import { Input } from "@components/input";
import { SafeArea } from "@components/safe-area";
import { User } from "@lib/actions";
import { formatUserDisplayName } from "@lib/misc";
import { supabase } from "@lib/supabase";
import { Link } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FC, useEffect, useState } from "react";

// import { AddressAutofill } from '@mapbox/search-js-react';

export const SearchPage: FC<
  NativeStackScreenProps<StackNavigatorParams, "search-page">
> = ({ navigation, route }) => {
  const [search, setSearch] = useState("");
  const [returnedUsers, setReturnedUsers] = useState<User[] | any>([]);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("search_usersname", {
        username: search,
      });
      console.log(data);

      setReturnedUsers(data);
    })();
  }, [search]);

  return (
    <SafeArea pureBlack={true}>
      <Div className="p-3">
        <Input placeholder="Pretraži" onChangeText={(e) => setSearch(e)} />
      </Div>
      {returnedUsers?.length === 0 ? (
        <EmptyPageMessage>
          {search?.length > 0 ? "Nema rezultata" : "Pretraži korisnike"}
        </EmptyPageMessage>
      ) : (
        <Div className="p-3">
          {returnedUsers?.map((el, i) => {
            return (
              <UserList
                key={el.id}
                user={{
                  id: el.id,
                  name: el.name,
                  //   @ts-ignore
                  email: "",
                  imagesId: el.imagesId,
                  displayname: el.displayname,
                }}
              />
            );
          })}
        </Div>
      )}
    </SafeArea>
  );
};

const UserList = ({ user }: { user: User }) => {
  return (
    <Link
      to={{
        screen: "user",
        params: { id: user.id, previousScreenName: "Pretraga" },
      }}
    >
      <Div className="flex-row bg-black p-2 mt-2">
        <Div className="">
          {/* add profile photo in ring */}
          <Img
            source={{ uri: user.imagesId }}
            className="w-12 h-12 rounded-full bg-gray-400"
          />
        </Div>
        <Div className="flex-row items-start pl-3">
          <Div className="">
            <Text className="text-white font-figtree-semi-bold text-lg">
              {user.name}
            </Text>
            <Text className="text-accents-11 font-figtree-semi-bold text-sm">
              {formatUserDisplayName(user.displayname)}
            </Text>
          </Div>
        </Div>
      </Div>
    </Link>
  );
};
