import { useAuthUser } from '@hooks/useAuthUser';
import { supabase } from '@lib/supabase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useCallback, useEffect, FC } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

// export function Chat() {
export const Chat: FC<
    NativeStackScreenProps<StackNavigatorParams, "chat">
> = ({ navigation, route }) => {
    const [messages, setMessages] = useState([]);
    // console.log(route.params.id)
    const { data: authUser, isFetched, refetch } = useAuthUser();
    useEffect(() => {
        (async () => {
            const { data, error } = await supabase
                .from('Message')
                .select('*, Users (id, displayname, imagesId)')
                .eq('chatId', route.params.id)
                .order('createdAt', { ascending: false });
            console.log("🤯", data, error)
            setMessages(data?.map(el => {
                return {
                    _id: el.id,
                    text: el.content,
                    createdAt: new Date(el.createdAt),
                    user: {
                        _id: el.Users.id,
                        name: el.Users.displayname,
                        avatar: el.Users.imagesId
                    },
                }
            }))
        })();
    }, [])

    // supabase on change listener
    useEffect(() => {
        const mySubscription = supabase
            .channel('public:Message')
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
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Message' }, (payload) => {
                console.log("payload", payload, payload.new.id);
                //check if the message is already in the list
                if (payload.new.senderId === authUser.user.id) return;
                setMessages(previousMessages => GiftedChat.append(previousMessages, {
                    _id: payload.new.id,
                    text: payload.new.content,
                    createdAt: new Date(payload.new.createdAt),
                    user: {
                        _id: payload.new.senderId,
                        name: payload?.new?.Users?.displayname || "Anonymous",
                    },
                }))
            }
            )
            .subscribe()
    }, [])

    const onSend = useCallback(async (messages = []) => {
        console.log("🔥🔥", messages)

        const { data, error } = await supabase
            .from('Message')
            .insert([
                {
                    id: messages[0]._id,
                    content: messages[0].text,
                    createdAt: messages[0].createdAt,
                    chatId: route.params.id,
                    senderId: authUser.user.id,
                }])
            .select('*, Users (id, displayname, imagesId)')
        setMessages(previousMessages => GiftedChat.append(previousMessages, {
            _id: data[0].id,
            text: data[0].content,
            createdAt: new Date(data[0].createdAt),
            sent: true,
            user: {
                _id: data[0].senderId,
                name: data[0].Users.displayname,
            }
        }))
        console.log("✅✅", data, error)
    }, [])
    console.log(authUser.user.id)
    return (
        <GiftedChat
            // isLoadingEarlier={messages.length === 0}
            messages={messages}
            onPressAvatar={(profile) => { navigation.navigate("user", { id: profile._id }) }}
            onSend={messages => onSend(messages)}
            user={{
                _id: authUser.user.id,
            }}

            inverted={true}
            alwaysShowSend={true}

        />
    )
}