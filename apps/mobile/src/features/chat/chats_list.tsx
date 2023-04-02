import { Div, Img, Text } from "@components/index";
import { Button } from "@components/button";
import { SafeArea } from '@components/safe-area';
import { useAuthUser } from '@hooks/useAuthUser';
import { useUser } from '@hooks/useUser';
import { formatName, formatUserDisplayName } from '@lib/misc';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useEffect, useMemo, useState } from 'react';
import { NavBar } from "@components/navbar";
import { Pressable } from "react-native";
// import { Button } from 'react-native';



export const Chats: FC<
    NativeStackScreenProps<StackNavigatorParams, "chats">
> = ({ navigation, route }) => {

    const { data: authUser, isFetched, refetch } = useAuthUser();

    useEffect(() => {

    }, []);
    return (
        <SafeArea gradient>
            <NavBar includeDefaultTrailing={false} />
            <SafeArea.Content>
                <Text
                    className={`text-3xl tracking-tight font-figtree-bold text-accents-12 mb-8 mt-6`}
                >
                    Razgorvori
                </Text>
                <Pressable onPress={() => navigation.navigate("chat")}>
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
                                    epic
                                </Text>
                                <Text className={`font-figtree text-accents-11`}>
                                    epic32
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
            </SafeArea.Content>
        </SafeArea>
    );
};