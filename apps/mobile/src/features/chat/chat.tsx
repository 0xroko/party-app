import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

export function Chat() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages([
            // {
            //     _id: 1,
            //     text: 'Hello developer',
            //     createdAt: new Date(),
            //     user: {
            //         _id: 2,
            //         name: 'React Native',
            //         avatar: 'https://placeimg.com/140/140/any',
            //     },
            // },
            {
                _id: 2,
                text: 'Dobrodošli na razgovor',
                createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
                system: true,
            },
        ])
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        console.log(messages)
    }, [])

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
        />
    )
}