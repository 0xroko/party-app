import { onSupabaseError } from "@lib/actions";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import * as ImageManipulator from "expo-image-manipulator";
import ImagePicker, {
  MediaTypeOptions,
  launchImageLibraryAsync,
} from "expo-image-picker";
import { queryClient } from "../../provider/index";

export type UploadType = "pfp" | "party" | "party-cover";

export type PfpParams = { userId: string };

interface GetImgProps {
  pickerProps?: ImagePicker.ImagePickerOptions;
}

/**
 * Get image from user's library + compress + resize + return form data for supa upload
 */
export const getImg = async ({ pickerProps }: GetImgProps) => {
  const props = {
    mediaTypes: MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1] as [number, number],
    base64: true,
    quality: 1,
    ...pickerProps,
  };

  let result = await launchImageLibraryAsync(props);
  // get image from uri
  if (!result.assets) {
    return null;
  }

  const manipResult = await ImageManipulator.manipulateAsync(
    result.assets[0].uri,
    [{ resize: { width: 500 } }],
    { compress: 0.65, format: ImageManipulator.SaveFormat.JPEG }
  );

  let localUri = manipResult.uri;
  let filename = localUri.split("/").pop();

  // Infer the type of the image
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;

  // Upload the image using the fetch and FormData APIs
  let formData = new FormData();
  // Assume "photo" is the name of the form field the server expects

  formData.append("photo", { uri: localUri, name: filename, type } as any);

  return {
    formData,
    contentType: "multipart/form-data",
    localUri,
  };
};

export type GetImageProps = Awaited<ReturnType<typeof getImg>>;

export const uploadPfp = async (params: PfpParams) => {
  // No permissions request is necessary for launching the image library
  try {
    const img = await getImg({});
    if (!img) return;

    const f = await supabase.storage
      .from("pfp")
      .upload(params.userId, img.formData, {
        upsert: true,
        contentType: img.contentType,
      });

    const timeStamp = Date.now();
    const i =
      supabase.storage.from("pfp").getPublicUrl(params.userId).data.publicUrl +
      `?t=${timeStamp}`;

    if (f.error) {
      onSupabaseError(f.error);
    } else {
      const u = await supabase
        .from("Users")
        .update({
          imagesId: i,
        })
        .eq("id", params.userId);

      if (!u.error) {
      }
    }
  } catch (error) {
    throw error;
  }
};

export const uploadPartyCover = async (partyId: string) => {
  try {
    const img = await getImg({});
    if (!img) return;

    const f = await supabase.storage
      .from("party-covers")
      .upload(partyId, img.formData, {
        upsert: true,
        contentType: img.contentType,
      });

    const timeStamp = Date.now();
    const i =
      supabase.storage.from("party-covers").getPublicUrl(partyId).data
        .publicUrl + `?t=${timeStamp}`;

    if (f.error) {
      onSupabaseError(f.error);
    } else {
      try {
        const u = await supabase
          .from("Party")
          .update({
            imageUrl: i,
          })
          .eq("id", partyId);

        queryClient.invalidateQueries(queryKeys.partyId(partyId));
        console.log(u);
      } catch (error) {
        onSupabaseError(error);
      }
    }
  } catch (error) {
    throw error;
  }
};

import uuid from "react-native-uuid";

export const uploadPost = async ({
  contentType,
  formData,
  localUri,
}: GetImageProps) => {
  try {
    const uuidImg = uuid.v4().toString();
    const f = await supabase.storage
      .from("party-images")
      .upload(uuidImg, formData, {
        upsert: true,
        contentType: contentType,
      });

    const timeStamp = Date.now();
    const i =
      supabase.storage.from("party-images").getPublicUrl(uuidImg).data
        .publicUrl + `?t=${timeStamp}`;

    if (f.error) {
      onSupabaseError(f.error);
    } else {
      return i;
    }
  } catch (error) {
    throw error;
  }
};
