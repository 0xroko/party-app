import { Button } from '@components/button';
import { Div, Img, Text } from '@components/index';
import { Input } from '@components/input';
import { SafeArea } from '@components/safe-area';
import { User } from '@lib/actions';
import { supabase } from '@lib/supabase';
import { Link, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useEffect, useRef, useState } from 'react';
import React from 'react';

// import { AddressAutofill } from '@mapbox/search-js-react';

export const SearchPage: FC<
    NativeStackScreenProps<StackNavigatorParams, "search-page">
> = ({ navigation, route }) => {
    const [search, setSearch] = useState('')
    const [returnedUsers, setReturnedUsers] = useState<User[]>([])
    useEffect(() => {
        (async () => {
            const { data, error } = await supabase.rpc('search_usersname', { username: search })
            console.log(data, error)
            setReturnedUsers(data)
        })()
    }, [search])
    return <SafeArea pureBlack={true}>
        <Div className='p-3'>
            <Input placeholder="Pretraži" onChangeText={(e) => setSearch(e)} />
        </Div>
        {returnedUsers.length === 0 ?
            <Div className='p-3'>
                <Div className={`h-36 flex justify-center items-center`}>
                    <Text
                        className={`text-lg font-figtree-medium text-accents-8 text-center mb-8 mt-2`}
                    >
                        {search.length > 0 ? "Nema rezultata" : "Pretraži korisnike"}
                    </Text>
                </Div>
            </Div> :
            <Div className='p-3'>
                {returnedUsers.map((el, i) => {
                    return <UserList
                        key={el.id}
                        user={{
                            id: el.id,
                            name: el.name,
                            email: '',
                            imagesId: el.imagesId,
                            displayname: el.displayname,
                        }} />
                })}
            </Div>}
    </SafeArea>;

};

const UserList = ({ user }: { user: User }) => {
    return <Link to={{ screen: 'user', params: { id: user.id } }}><Div
        className='flex-row bg-black p-2 mt-2'>
        <Div className=''>
            {/* add profile photo in ring */}
            <Img source={{ uri: user.imagesId }} className='w-12 h-12 rounded-full bg-gray-400' />
        </Div>
        <Div className='flex-row items-start pl-5'>
            <Div className='text-lg'>
                <Text className='text-white font-semibold text-lg'>{user.name}</Text>
                <Text className='text-white font-semibold text-sm'>@{user.displayname}</Text>
            </Div>
        </Div>
    </Div >
    </Link>;
}
