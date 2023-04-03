import { Button } from '@components/button';
import { Div, Text } from "@components/index";
import { NavBar } from '@components/navbar';
import { SafeArea } from '@components/safe-area';
import { useAuthUser } from '@hooks/useAuthUser';
import { useUser } from '@hooks/useUser';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useMemo, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const Upload: FC<
    NativeStackScreenProps<StackNavigatorParams, "upload-images">
> = ({ navigation, route }) => {
    // const userId = route.params?.id;
    // const { data: user, isLoading } = useUser();
    const { data: authUser, isFetched, refetch } = useAuthUser();

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            console.log(result);
        } else {
            alert('You did not select any image.');
        }
    };
    return (
        <SafeArea gradient>
            <NavBar includeDefaultTrailing={false} />
            <SafeArea.Content>
                <Text
                    className={`text-3xl tracking-tight font-figtree-bold text-accents-12 mb-8 mt-6`}
                >
                    Uploadaj slike s party-a
                </Text>
                <Button onPress={() => pickImageAsync()}>Odaberi slike</Button>
            </SafeArea.Content>
        </SafeArea>
    );
};