import { Div, Img, T, Text } from "@components/index";
import { SafeArea } from "@components/safe-area";
import { useAuthUser } from "@hooks/useAuthUser";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FC, useCallback, useEffect, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
  Time,
} from "react-native-gifted-chat";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
// import { Input } from "@components/input";

// export function Chat() {
export const Chat: FC<NativeStackScreenProps<StackNavigatorParams, "chat">> = ({
  navigation,
  route,
}) => {
  const [messages, setMessages] = useState([]);
  const [chatData, setChatData] = useState<any>([]);
  // console.log(route.params.id)
  const { data: authUser, isFetched, refetch } = useAuthUser();
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("Message")
        .select("*, Users (id, displayname, imagesId), Chat (Party (*))")
        .eq("chatId", route.params.id)
        .order("createdAt", { ascending: false });
      console.log("🤯", data, error);
      setChatData(data[0].Chat)
      console.log("chat", chatData)
      setMessages(
        data?.map((el) => {
          return {
            _id: el.id,
            text: el.content,
            createdAt: new Date(el.createdAt),
            user: {
              // @ts-ignore
              _id: el.Users.id,
              // @ts-ignore
              name: el.Users.displayname,
              // @ts-ignore
              avatar: el.Users.imagesId,
            },
          };
        })
      );
    })();
  }, []);

  // supabase on change listener
  useEffect(() => {
    const mySubscription = supabase
      .channel("public:Message")
      // .on('INSERT', payload => {
      //     console.log('Change received!', payload)
      //     // setMessages(previousMessages => GiftedChat.append(previousMessages, {
      //     //     _id: payload.new.id,
      //     //     text: payload.new.content,
      //     //     createdAt: new Date(payload.new.createdAt),
      //     //     user: {
      //     //         _id: payload.new.userId,
      //     //         name: payload.new.Users.displayname,
      //     //     },
      //     // }))
      // })
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Message" },
        (payload) => {
          console.log("payload", payload, payload.new.id);
          //check if the message is already in the list
          if (payload.new.senderId === authUser.user.id) return;
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, {
              //  @ts-ignore
              _id: payload.new.id,
              text: payload.new.content,
              createdAt: new Date(payload.new.createdAt),
              user: {
                _id: payload.new.senderId,
                name: payload?.new?.Users?.displayname || "Anonymous",
              },
            })
          );
        }
      )
      .subscribe();
  }, []);

  const onSend = useCallback(async (messages = []) => {
    console.log("🔥🔥", messages);

    const { data, error } = await supabase
      .from("Message")
      .insert([
        {
          id: messages[0]._id,
          content: messages[0].text,
          createdAt: messages[0].createdAt,
          chatId: route.params.id,
          senderId: authUser.user.id,
        },
      ])
      .select("*, Users (id, displayname, imagesId)");
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, {
        // @ts-ignore
        _id: data[0].id,
        text: data[0].content,
        createdAt: new Date(data[0].createdAt),
        sent: true,
        user: {
          _id: data[0].senderId,
          //   @ts-ignore
          name: data[0].Users.displayname,
        },
      })
    );
    console.log("✅✅", data, error);
  }, []);
  console.log(authUser.user.id);
  const d = useWindowDimensions();
  return (
    <SafeArea>
      {/* <Div className="bg-red-600 w-full h-16"> */}
      <Div className="flex-row bg-black p-2">

        <Div className={`flex p-3 g-4 flex-row items-center`}>
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeftIcon color={"#fff"} size={20} strokeWidth={2.4} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate("party", { id: chatData.Party.id })}>
            <Text
              className={`text-accents-12 font-figtree-bold leading-[20]`}
            >
              <Div className="pl-5">
                {/* add profile photo in ring */}
                <Img
                  source={{ uri: chatData?.Party?.imageUrl }}
                  className="w-8 h-8 rounded-full bg-gray-400"
                />
              </Div>
              <Div className="flex-row items-start pl-5">
                <Div className="text-lg">
                  <Text className="text-white font-figtree-semi-bold text-lg">
                    {chatData?.Party?.name}
                  </Text>
                </Div>
              </Div>
            </Text>
          </Pressable>
        </Div>


      </Div>
      {/* </Div> */}

      <GiftedChat
        // isLoadingEarlier={messages.length === 0}
        // renderLoading={() => <></>}
        // renderBubble={() => <View style={{ width: 100, height: 100, backgroundColor: "red" }} />}
        renderUsernameOnMessage={true}
        messages={messages}
        onPressAvatar={(profile) => {
          navigation.navigate("user", {
            id: profile?._id as string,
            previousScreenName: `Chats`,
          });
        }}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: authUser.user.id,
        }}
        placeholder="Poruka..."
        inverted={true}
        alwaysShowSend={true}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            optionTintColor="white"
            renderComposer={(props) => (
              <Composer {...props} textInputStyle={{ color: "white" }} />
            )}
            containerStyle={{
              backgroundColor: "black",
              borderTopColor: "rgba(255, 255, 255, 0.1)",
              borderTopWidth: 1,
            }}
          />
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: "black",
                borderColor: "rgba(255, 255, 255, 1)",
                borderWidth: 1,
              },
              right: {
                backgroundColor: "white",
                borderColor: "black",
                borderWidth: 1,
              },
            }}
            textStyle={{
              left: {
                color: "white",
              },
              right: {
                color: "black",

                // textShadowColor: "black"
              },
            }}
            renderTime={(props) => (
              <Time
                {...props}
                timeTextStyle={{
                  right: {
                    color: "black",
                  },
                }}
              />
            )}
            renderUsernameOnMessage={true}
            tickStyle={{ color: "red" }}
          />
        )}
        listViewProps={{
          style: {
            backgroundColor: "transparent",
            // background: "radial-gradient(ellipse at center, #6500B7 54%, #6500B7 77%, #FFA0FF 100%)"
          },
        }}
        renderSend={(props) => (
          <Send {...props} text={props.text} textStyle={{ color: "white" }} />
        )}
      />
    </SafeArea >
  );
};
