import { onSupabaseError } from "@lib/actions";
import { supabase } from "@lib/supabase";
import * as ImageManipulator from "expo-image-manipulator";
import ImagePicker from "expo-image-picker";

export type UploadType = "pfp" | "party" | "party-cover";

export type Params = { userId: string };

interface GetImgProps {
  pickerProps?: ImagePicker.ImagePickerOptions;
}

export const getImg = async ({ pickerProps }: GetImgProps) => {
  const props = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1] as [number, number],
    base64: true,
    quality: 0.6,
    ...pickerProps,
  };

  let result = await ImagePicker.launchImageLibraryAsync(props);
  // get image from uri
  if (!result.assets) {
    return null;
  }

  const manipResult = await ImageManipulator.manipulateAsync(
    result.assets[0].uri,
    [{ resize: { width: 500 } }],
    { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
  );

  let localUri = result.assets[0].uri;
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
  };
};

export const uploadPfp = async (params: Params) => {
  // No permissions request is necessary for launching the image library

  try {
    const { formData, contentType } = await getImg({});

    const f = await supabase.storage
      .from("pfp")
      .upload(params.userId, formData, {
        upsert: true,
        contentType: contentType,
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
