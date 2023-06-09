import { Div, Text } from "@components/index";
import { NavBar } from "@components/navbar";
import { SafeArea } from "@components/safe-area";
import { useAuthUser } from "@hooks/useAuthUser";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useEffect, useState } from "react";
import { Pressable } from "react-native";
// import { Button } from 'react-native';

export const Chats: FC<
  NativeStackScreenProps<StackNavigatorParams, "chats">
> = ({ navigation, route }) => {
  const { data: authUser, isFetched, refetch } = useAuthUser();
  const [chats, setChats] = useState([]);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("get_messages_for_user", {
        user_id: authUser?.user.id,
      });
      console.log(data, error);

      setChats(data);
    })();
  }, []);
  return (
    <SafeArea gradient>
      <NavBar
        showBackButton={route.params?.showBackButton}
        showNavBar={route.params?.showNavBar}
        includeDefaultTrailing={false}
      />
      <SafeArea.Content>
        <Text
          className={`text-3xl tracking-tight font-figtree-bold text-accents-12 mb-8 mt-6`}
        >
          Razgorvori
        </Text>
        {chats?.map((el) => {
          return (
            <Pressable
              key={el?.chat_id}
              onPress={() => navigation.navigate("chat", { id: el.chat_id })}
            >
              <Div
                className={`flex flex-row items-center bg-accents-1 rounded-lg justify-between`}
              >
                <Div className={`flex flex-row items-center g-4`}>
                  {/* <Img
                            className={`w-20 h-20 rounded-full`}
                            source={{
                                uri: "https://images.unsplash.com/photo-1657320815727-2512f49f61d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=60",
                            }}
                        /> */}
                  <Div className={`flex flex-col items-start justify-start`}>
                    <Text
                      className={`font-figtree-bold text-xl text-accents-12`}
                    >
                      {el?.party_name}
                    </Text>
                    <Text className={`font-figtree text-accents-11`}>
                      <Text className={`font-black text-accents-11`}>
                        {el.displayname}
                      </Text>{" "}
                      {el.last_message_content}
                    </Text>
                  </Div>
                </Div>
                {/* <Div className={`flex g-3 flex-row`}>
                        <Div className={``}>
                            <Button intent="secondary">btn1</Button>
                        </Div>

                        <Div className={``}>
                            <Button >
                                btn2
                            </Button>
                        </Div>
                    </Div> */}
              </Div>
            </Pressable>
          );
        })}
      </SafeArea.Content>
    </SafeArea>
  );
};
