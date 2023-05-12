import { Div } from "@components/index";
import { UserPostListType } from "@hooks/query/useUserPosts";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { Pressable, View } from "react-native";
import { Squares2X2Icon, TagIcon } from "react-native-heroicons/outline";

interface PostGalleryProps {
  children?: React.ReactNode | React.ReactNode[];
  navigation?: NativeStackScreenProps<any, any>["navigation"];
  item?: UserPostListType;
  onPress?: () => void;
  target?: "StickyHeader" | any;
}

export const PostGallery = ({
  children,
  item,
  navigation,
  target,
  onPress,
}: PostGalleryProps) => {
  if (item?.withStickyHeader) {
    if (target === "StickyHeader") {
      return (
        <Div className={`h-16 bg-black flex flex-row w-full`}>
          <Div
            className={`flex grow border-b-2 border-b-accents-12  justify-center items-center`}
          >
            <Squares2X2Icon strokeWidth={2} size={26} color={"#fff"} />
          </Div>
          <Div
            className={`flex border-b-2 border-b-accents-1  grow justify-center items-center`}
          >
            <TagIcon size={26} strokeWidth={2} color={"#ddd"} />
          </Div>
        </Div>
      );
    }
  }

  if (item?.type === "filler") {
    return (
      <View
        style={{
          flex: 1,
          aspectRatio: 1,
          backgroundColor: "black",
        }}
      />
    );
  }

  return (
    <Pressable style={{ flex: 1 }} onPress={onPress}>
      <Image
        style={{ aspectRatio: 1, flex: 1 }}
        // recyclingKey={item.id.toString()}
        contentFit="cover"
        source={{
          uri: item?.Images?.[0]?.pic_url,
        }}
      />
    </Pressable>
  );
};
