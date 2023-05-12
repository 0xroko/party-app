import { Div, T } from "@components/index";
import { formatRelative } from "date-fns";
import { hr } from "date-fns/locale";
import { Image } from "expo-image";
import { Pressable } from "react-native";

interface PostInfoProps {
  children?: React.ReactNode | React.ReactNode[];
  navigation?: any;
  post?: {
    id: string;
    created_at: string;
    author: {
      id: string | unknown;
      displayname: string | unknown;
      imagesId: string | unknown;
    };
    party: {
      id: string | unknown;
      name: string | unknown;
    };
  };
}

export const PostHeader = ({ children, navigation, post }: PostInfoProps) => {
  const parsedDate = Date.parse(post?.created_at ?? new Date().toISOString());

  return (
    <Div className={`flex flex-row g-4 mx-3 my-3`}>
      <Pressable
        onPress={() => {
          navigation.push("user", {
            id: post?.author?.id as any,
            previousScreenName: "User post",
          });
        }}
      >
        <Image
          style={{
            borderRadius: 9999,
            width: 44,
            aspectRatio: 1,
          }}
          source={{
            uri: post?.author?.imagesId as string,
          }}
        />
      </Pressable>

      <Div className={`flex justify-center g-0.5`}>
        <Div className={`flex flex-row items-center`}>
          <T className={`text-white font-figtree-semi-bold`}>
            {post?.author.displayname as string}
          </T>
          <T className={`text-accents-11`}> na </T>
          <T
            onPress={() => {
              if (!post?.party) return;
              navigation.push("party", {
                id: post?.party?.id as any,
                previousScreenName: "User post",
              });
            }}
            className={`text-white font-figtree-semi-bold`}
          >
            {(post?.party?.name as string) ?? "[deleted]"}
          </T>
        </Div>
        <T className={`text-accents-11 font-figtree-medium`}>
          {formatRelative(parsedDate, new Date(), {
            locale: hr,
          })}
        </T>
      </Div>
    </Div>
  );
};
