import { Button } from "@components/button";
import { Div, T } from "@components/index";
import { Input } from "@components/input";
import { NavBar } from "@components/navbar";
import { SafeArea } from "@components/safe-area";
import { PartyCover, useParty } from "@features/party/id";
import { useAuthUser } from "@hooks/useAuthUser";
import { onSupabaseError } from "@lib/actions";
import { GetImageProps, getImg, uploadPost } from "@lib/actions/img";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { FC, useState } from "react";
import { Pressable, ScrollView, TouchableOpacity } from "react-native";
import { useMutation } from "react-query";

export const AddPostScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "postAdd">
> = ({ navigation, route }) => {
  const { partyId } = route.params;
  const authUser = useAuthUser();
  const { data: party } = useParty(partyId);
  const [imageSelected, setImageSelected] = useState(false);

  const [img, setImg] = useState<GetImageProps | null>(null);
  const [description, setDescription] = useState("");

  const addPost = useMutation({
    mutationFn: async () => {
      try {
        const imageUrl = await uploadPost(img);

        const r = await supabase.from("Images").insert({
          authorId: authUser.data.user.id,
          partyId: partyId,
          pic_url: imageUrl,
          description: description,
        });
        console.log(r);
      } catch (error) {
        onSupabaseError(error);
      }
    },
  });

  return (
    <SafeArea midGradient={false}>
      <PartyCover imgUri={party?.imageUrl} />
      <NavBar includeDefaultTrailing={false} />
      <ScrollView>
        <SafeArea.Content>
          <Div className={`mt-10`}>
            <T
              style={{
                textShadowColor: "#00000055",
                textShadowRadius: 9,
              }}
              className={`text-xl font-figtree-medium capitalize text-accents-11 mt-2`}
            >
              Nova objava za
            </T>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("party", {
                  id: partyId,
                  previousScreenName: "Nova objava",
                });
              }}
            >
              <T
                style={{
                  textShadowColor: "#00000077",
                  textShadowRadius: 9,
                }}
                className={`text-4xl tracking-tight font-figtree-bold text-accents-12 mt-2`}
              >
                {party?.name}
              </T>
            </TouchableOpacity>
          </Div>
          <Div className={`mt-2`}>
            <T>Dodaj novu objavu</T>
            <Pressable
              onPress={async () => {
                const i = await getImg({});
                if (i) {
                  setImg(i);
                }

                // setImg();
              }}
            >
              {img ? (
                <Image
                  style={{
                    width: "100%",
                    height: 400,
                    resizeMode: "cover",
                    borderRadius: 12,
                  }}
                  source={{
                    uri: img?.localUri,
                  }}
                ></Image>
              ) : (
                <Div
                  className={`h-[400px] flex justify-center items-center rounded-3xl bg-accents-1 border border-accents-12`}
                >
                  <T className={`text-accents-11 font-figtree-medium text-lg`}>
                    Dodaj sliku
                  </T>
                </Div>
              )}
            </Pressable>

            <Div className={`mt-5`}>
              <Input
                value={description}
                large
                label="Opis partyja"
                onChange={(t) => {
                  setDescription(t.nativeEvent.text);
                }}
                placeholder={"Opis partyja"}
              />
            </Div>
            <Div className={`mt-10`}>
              <Button
                disabled={!img}
                loading={addPost.isLoading}
                onPress={async () => {
                  if (img) {
                    await addPost.mutateAsync();
                    navigation.navigate("home");
                  }
                }}
              >
                Objavi
              </Button>
            </Div>
          </Div>
        </SafeArea.Content>
      </ScrollView>
    </SafeArea>
  );
};
