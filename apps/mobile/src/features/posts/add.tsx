import { Button } from "@components/button";
import { Div, T } from "@components/index";
import { Input } from "@components/input";
import { NavBar } from "@components/navbar";
import { SafeArea } from "@components/safe-area";
import { PartyCover, useParty } from "@features/party/id";
import { useTaggedUsers } from "@features/posts/tag";
import { useAuthUser } from "@hooks/useAuthUser";
import { onSupabaseError } from "@lib/actions";
import { GetImageProps, getImg, uploadPost } from "@lib/actions/img";
import { queryKeys } from "@lib/const";
import { queryClient } from "@lib/queryCache";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { FC, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { TagIcon } from "react-native-heroicons/mini";
import { XMarkIcon } from "react-native-heroicons/outline";
import Carousel from "react-native-reanimated-carousel";
import { useMutation } from "react-query";

export const AddPostScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "postAdd">
> = ({ navigation, route }) => {
  const { partyId } = route.params;
  const authUser = useAuthUser();
  const { data: party } = useParty(partyId);

  const [img, setImg] = useState<GetImageProps[]>([]);

  const [description, setDescription] = useState("");

  const {
    setCurrentImgID,
    clearForCurrentImgID,
    currentImgID,
    countTaggedUsers,
    getTaggedUsers,
    taggedUsers,
  } = useTaggedUsers();

  const addPost = useMutation({
    mutationFn: async () => {
      try {
        console.log(img, taggedUsers, description);

        const uploadPromises = img!.map(async (i) => {
          const r = await uploadPost(i);
          return r;
        });

        let ids = await Promise.all(uploadPromises);

        const r = await supabase
          .from("Post")
          .insert({
            authorId: authUser.data.user.id,
            partyId: partyId,
            description: description,
          })
          .select()
          .single();

        if (r.data) {
          const images = ids.map((i) => {
            return {
              pic_url: i.url,
              postId: r.data.id,
              originalUuid: i.uuid,
            };
          });

          const { data, count, error } = await supabase
            .from("Images")
            .insert(images)
            .select();

          console.log(data);

          // create object of {imageId : string, userId: string}[]
          const taggedOnImages = data
            .map((img) => {
              const t = taggedUsers[img.originalUuid];

              if (!t) {
                return [];
              }
              return taggedUsers[img.originalUuid].map((user) => {
                return {
                  imageId: img.id,
                  userId: user.id,
                };
              });
            })
            .flat();

          console.log(taggedOnImages);

          // add all tagged users
          const p = await supabase
            .from("TaggedOnImages")
            .insert(taggedOnImages);
        }

        queryClient.invalidateQueries(
          queryKeys.postsByUser(authUser.data.user.id, 0)
        );
      } catch (error) {
        onSupabaseError(error);
      }
    },
  });

  const width = Dimensions.get("window").width;
  const carRef = useRef<any>(null);
  const height = Dimensions.get("window").height;

  const addImg = async () => {
    const i = await getImg({});
    if (i) {
      setImg((t) => [...t, i]);

      carRef.current?.scrollTo({
        count: 1,
        animated: true,
      });
    }
  };

  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

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
            {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate("party", {
                  id: partyId,
                  previousScreenName: "Nova objava",
                });
              }}
            > */}
            <T
              style={{
                textShadowColor: "#00000077",
                textShadowRadius: 9,
              }}
              className={`text-4xl tracking-tight font-figtree-bold text-accents-12 mt-2`}
            >
              {party?.name}
            </T>
            {/* </TouchableOpacity> */}
          </Div>
          <Div className={`mt-12`}>
            <T
              className={`text-accents-11 font-figtree-semi-bold text-sm mb-2`}
            >
              Slike
            </T>
            {img.length === 0 ? (
              <Pressable onPress={addImg}>
                <Div
                  className={`h-[400px] flex justify-center items-center rounded-3xl bg-accents-1 border border-accents-12`}
                >
                  <T className={`text-accents-11 font-figtree-medium text-lg`}>
                    Dodaj sliku
                  </T>
                </Div>
              </Pressable>
            ) : (
              <Carousel
                width={width - 30}
                height={400}
                ref={carRef}
                data={img}
                loop={false}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => {
                  setCurrentCarouselIndex(index);
                }}
                renderItem={({ item, index }) => {
                  const cnt = countTaggedUsers(item.uuid);

                  return (
                    <Div
                      style={{
                        flex: 1,
                        position: "relative",
                        justifyContent: "center",
                      }}
                    >
                      <Div
                        className={`absolute bg-white shadow rounded-xl p-2.5 top-2 right-2 z-50`}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            carRef.current?.scrollTo({
                              count: -1,
                              animated: true,
                            });
                            setImg((t) => t.filter((i) => i !== item));
                          }}
                        >
                          <XMarkIcon
                            color={"black"}
                            strokeWidth={2}
                            size={20}
                          />
                        </TouchableOpacity>
                      </Div>

                      {cnt > 0 && (
                        <Div
                          className={`absolute bg-accents-1 flex flex-row justify-center g-2 items-center shadow rounded-xl p-2.5 bottom-2 left-2 z-50`}
                        >
                          <TagIcon color={"white"} strokeWidth={2} size={20} />
                          <T
                            className={`text-white font-figtree-semi-bold text-base`}
                          >
                            {cnt}
                          </T>
                        </Div>
                      )}

                      <Div
                        className={`absolute bg-white shadow rounded-xl p-2.5 top-2 right-2 z-50`}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            carRef.current?.scrollTo({
                              count: -1,
                              animated: true,
                            });
                            setImg((t) => t.filter((i) => i !== item));
                          }}
                        >
                          <XMarkIcon
                            color={"black"}
                            strokeWidth={2}
                            size={20}
                          />
                        </TouchableOpacity>
                      </Div>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setCurrentImgID(item?.uuid);
                          navigation.navigate("tag-users", {
                            previousScreenName: "Nova objava",
                            userId: authUser.data.user.id,
                            imgUuId: item?.uuid,
                          });
                        }}
                      >
                        <Image
                          style={{
                            borderRadius: 12,
                            width: "100%",
                            height: "100%",
                            resizeMode: "cover",
                          }}
                          source={{
                            uri: item?.localUri,
                          }}
                        />
                      </TouchableOpacity>
                    </Div>
                  );
                }}
              />
            )}

            {img.length > 0 && img.length <= 6 && (
              <Div className={`mt-5 flex flex-row g-2`}>
                {/* <Button
                  className={`flex-1`}
                  intent="secondary"
                  onPress={() => {
                    setCurrentImgID(img[currentCarouselIndex].localUri);
                    navigation.navigate("tag-users", {
                      previousScreenName: "Nova objava",
                      userId: authUser.data.user.id,
                    });
                  }}
                >
                  Taggaj
                </Button> */}
                <Button className={`flex-1`} onPress={addImg}>
                  Dodaj sliku
                </Button>
              </Div>
            )}
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
            <Div className={`my-10`}>
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
