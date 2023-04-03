import { Div, Text } from '@components';
import { Button } from '@components/button';
import { Input } from '@components/input';
import { NavBar } from '@components/navbar';
import { SafeArea } from '@components/safe-area';
import { useAuthUser } from '@hooks/useAuthUser';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { FC, useMemo, useState } from 'react';
import React from 'react';
import { StyleSheet } from 'react-native';
// import Select from 'react-select';
import { SelectDropdown, DropdownData } from "expo-select-dropdown";
import TagInput from 'react-native-tag-input';

export const Upload: FC<
    NativeStackScreenProps<StackNavigatorParams, "upload-images">
> = ({ navigation, route }) => {
    // const userId = route.params?.id;
    // const { data: user, isLoading } = useUser();
    const { data: authUser, isFetched, refetch } = useAuthUser();
    const [result, setResult] = useState<any>(null);
    const [current, setCurrent] = useState(0);
    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            console.log(result);
            setResult(result?.assets);
        } else {
            alert('You did not select any image.');
        }
        // console.log("result", result)

    };
    console.log("images", result)
    const [selected, setSelected] = useState<DropdownData<string, string> | null>(null);
    const [data] = useState<DropdownData<string, string>[]>([
        { key: "1", value: "Toothbrush" },
        { key: "2", value: "Laptop" },
        { key: "3", value: "Sunglasses" },
        { key: "4", value: "Baseball" },
        { key: "5", value: "Scissors" },
        { key: "6", value: "Bicycle" },
        { key: "7", value: "Camera" },
        { key: "8", value: "Umbrella" },
        { key: "9", value: "Backpack" },
        { key: "10", value: "Water bottle" }
    ]);
    const [emails, setEmails] = useState<string[]>([]);
    const [input, setInput] = useState<string>("");
    return (
        <SafeArea gradient>
            <NavBar includeDefaultTrailing={false} />
            <SafeArea.Content>
                <Text
                    className={`text-3xl tracking-tight font-figtree-bold text-accents-12 mb-8 mt-6`}
                >
                    Uploadaj slike s party-a
                </Text>
                {/* //         {result && <>
                    //             <Text>{result[0]?.uri}</Text>
                    //             <Image style={styles.image} source={result[0]} />
                    //         </>}
                    //         <Button onPress={() => pickImageAsync()}>Odaberi slike</Button> */}
                {result && <>
                    {/* <Text>{result[current]?.uri}</Text> */}
                    {/* <Image style={styles.image} source={result[0]} /> */}

                    <Image
                        className="w-full h-1/2"
                        // source="https://picsum.photos/seed/696/3000/2000"
                        source={result[current]}
                        // placeholder={blurhash}
                        contentFit="cover"
                        transition={1000}
                    />
                    <Input large placeholder='Komentar' />
                </>}




                {/* const MyComponent = () => ( */}

                <TagInput
                    value={emails}
                    onChange={(emails) => console.log(emails)}
                    labelExtractor={(email) => email}
                    text={input}
                    onChangeText={(text) => console.log(text)}
                />


                <Text>{current}</Text>
                <Div className={`flex flex-row g-5`}>
                    <Div className={`flex-1`}>
                        <Button onPress={() => setCurrent(current - 1)}>Prošla</Button>
                        <Button onPress={() => pickImageAsync()}>Odaberi slike</Button>
                    </Div>
                    <Button onPress={() => setCurrent(current + 1)}>Sljedeća</Button>
                </Div>
            </SafeArea.Content>
        </SafeArea >
    );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     image: {
//         flex: 1,
//         width: '100%',
//         backgroundColor: '#0553',
//     },
// });