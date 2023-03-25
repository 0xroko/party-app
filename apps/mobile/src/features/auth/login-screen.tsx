import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { supabase } from '@supabase/supabase-js';
import * as Contacts from 'expo-contacts';
import { FC, useEffect, useState } from "react";
import {
    useSafeAreaInsets
} from 'react-native-safe-area-context';
import {
    Button,
    H1, Input, Label, ListItem, Paragraph, ScrollView, XStack, YStack
} from "tamagui";
import { MyStack } from "../../components/MyStack";
import { supabase } from "../../lib/supabase";

export const LoginScreen: FC<
    NativeStackScreenProps<StackNavigatorParams, "home">
> = ({ navigation }) => {

    const [verificationCode, setVerificationCode] = useState<string>('')
    const [step, setStep] = useState<'phone' | 'info' | 'import'>('phone')
    const [verificationSent, setVerificationSent] = useState<boolean>(false)
    const [phoneNumber, setPhoneNumber] = useState<string>('')

    return (

        <MyStack>
            {/* <ContactsComp /> */}
            {step == 'phone' ? <>
                <Header
                    heading="Prijava"
                    paragraph="Koristimo brojeve kako bi lakše te spojili s prijateljima, uvijek ga možeš promjeniti" />
                <YStack space="$5">

                    {/* <XStack justifyContent="space-between" marginHorizontal="$2">
                    <Button>Kreiraj račun</Button>
                    <Button themeInverse>Ulogriaj se</Button>
                </XStack> */}
                    {/* <Button onPress={async () => {
                    let { user, error } = await supabase.auth.signInWithOtp({
                        phone: '+3850955364478',
                    })
                    console.log(user, error)
                }}>Test Login</Button> */}
                    {/* <Paragraph>{verificationCode}</Paragraph> */}
                    {!verificationSent ? <>
                        <Label htmlFor="name">Broj telefona</Label>
                        <Input placeholder="vaš broj telefona"
                            size="$4"
                            borderWidth={2}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber} />
                        {/* <Button onPress={async () => {
                    let { session, error } = await supabase.auth.verifyOtp({
                        phone: '+3850955364478',
                        token: verificationCode,
                        type: 'sms',
                    })
                    console.log(session, error)
                }}>verify</Button> */}
                        <Button marginBottom="$20" themeInverse onPress={async () => {
                            let { user, error } = await supabase.auth.signInWithOtp({
                                phone: phoneNumber,
                            }) //TODO: error handling
                            // console.log(user, error)step
                            // setStep('code')
                            setVerificationSent(true)
                        }}>Nastavi</Button>
                    </> :
                        <>
                            <Label htmlFor="name">Kod za verifikaciju</Label>
                            <Input placeholder="vaš kod"
                                size="$4"
                                borderWidth={2}
                                value={verificationCode}
                                onChangeText={setVerificationCode} />
                            {/* <Button onPress={async () => {
                    let { session, error } = await supabase.auth.verifyOtp({
                        phone: '+3850955364478',
                        token: verificationCode,
                        type: 'sms',
                    })
                    console.log(session, error)
                }}>verify</Button> */}
                            <Button marginBottom="$20" themeInverse onPress={async () => {
                                // let { user, error } = await supabase.auth.signInWithOtp({
                                //     phone: '+3850955364478',
                                // })
                                setStep('info')
                                let { session, error } = await supabase.auth.verifyOtp({
                                    phone: phoneNumber,
                                    token: verificationCode,
                                    type: 'sms',
                                })
                                //TODO: error handling
                                // console.log(user, error)step
                                // setStep('code')
                                setVerificationSent(true)
                            }}>Potvrdi kod</Button>
                        </>
                    }
                </YStack>
            </> : step == 'info' ?
                <>
                    <Header
                        heading="Još par stvari o tebi"
                        paragraph="Personaliziraj svoj račun" />
                    <YStack space="$5">
                        <Label htmlFor="name">Korisnično ime</Label>
                        <Input placeholder="vaše korisničko ime" size="$4" borderWidth={2} value={verificationCode} onChangeText={setVerificationCode} />
                        <XStack>
                            <Button onPress={() => {
                                setStep('phone')
                            }}>Nazad</Button>
                            <Button onPress={() => {
                                setStep('import')
                            }}>
                                Nastavi
                            </Button>
                        </XStack>
                    </YStack>
                </> : step == 'import' ? <>
                    <Header
                        heading="Uvezi Kontakte"
                        paragraph="Uvozi kontakte i lakše pronađi prijatelje koji koriste Party App" />
                    {/* <YStack space="$5"> */}
                    <ContactList />

                    {/* </YStack> */}
                </> : null


            }
        </MyStack >
    );
};

const Header = ({ heading, paragraph }) => {
    const insets = useSafeAreaInsets();
    return <YStack
        marginTop="$10"
        paddingTop={insets.top}
        space="$4"
        maxWidth={600}
    >
        <H1 textAlign="left">{heading}</H1>
        <Paragraph textAlign="left">
            {/* Koristimo brojeve kako bi lakše te spojili s prijataljima, uvijek ga možeš promjeniti */}{paragraph}
        </Paragraph>
    </YStack>
}


const ContactsComp = () => {
    useEffect(() => {

        (async () => {
            console.log("test")
            const { status } = await Contacts.requestPermissionsAsync();

            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [
                        Contacts.Fields.PhoneNumbers,
                        Contacts.Fields.FirstName,
                        Contacts.Fields.LastName],
                });
                console.log(data)
                if (data.length > 0) {
                    const contact = data[0];
                    console.log(contact);
                }
            }
        })();
    }, []);

    return (
        <Paragraph>Kontakti</Paragraph>
    );
}


const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
            fields: [
                Contacts.Fields.PhoneNumbers,
                Contacts.Fields.FirstName,
                Contacts.Fields.LastName],
        });
        return data
    } else {
        return []
    }
}

const ContactList = () => {
    const [contacts, setContacts] = useState([])
    useEffect(() => {
        (async () => setContacts(await getContacts()))()
    }, [])

    return <ScrollView marginTop="$5" onPress={() => { }} zIndex={"$1"}>
        <YStack>
            {contacts.map(el => <ListItem
                hoverTheme
                pressTheme
                title={el.name}
                subTitle="Subtitle"
                iconAfter={<Button>Dodaj</Button>}
            />)}
        </YStack>
    </ScrollView>

}