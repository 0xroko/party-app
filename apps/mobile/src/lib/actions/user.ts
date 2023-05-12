import { onSupabaseError, User } from "@lib/actions";
import { User as AuthUser } from "@supabase/supabase-js";

import { supabase } from "@lib/supabase";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const checkIfUserHasData = async () => {
  const authUser = await supabase.auth.getUser();
  console.log("checkIfUserHasData");

  if (!authUser.data?.user?.id) {
    onSupabaseError("No user logged in");
    return false;
  }
  const r = await supabase
    .from("Users")
    .select("*")
    .match({ id: authUser?.data.user.id });

  if (r.error) {
    onSupabaseError(r.error);
    return false;
  }

  return r.data.length > 0;
};

export const checkIfDisplayNameExists = async (
  displayName: string,
  ignoreId?: string
) => {
  const query = supabase
    .from("Users")
    .select("count")
    .filter("displayname", "eq", displayName);

  if (ignoreId) query.filter("id", "neq", ignoreId ?? "");

  const { data, error } = await query;

  if (error) {
    onSupabaseError(error);
    return false;
  }

  if (data[0].count === 0) {
    return false;
  }
  return true;
};

export async function registerForPushNotificationsAsync() {
  let token: string;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Dobiven token", token);
    const authUser = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("Users")
      .update({
        pushtoken: token,
      })
      .eq("id", authUser.data.user.id)
      .select();
    if (error) onSupabaseError(error);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export const updateUser = async (d: Partial<User>, authUser: AuthUser) => {
  if (!authUser) {
    onSupabaseError("No user logged in");
    return;
  }

  const { data, error } = await supabase
    .from("Users")
    .update(d)
    .eq("id", authUser.id)
    .select();

  if (error) {
    onSupabaseError(error);
  }

  return data;
};

export const createUser = async (
  d: Pick<User, "displayname" | "surname" | "name">
) => {
  const authUser = await supabase.auth.getUser();
  if (!authUser) {
    onSupabaseError("No user logged in");
    return;
  }

  const { data, error } = await supabase
    .from("Users")
    .insert({
      ...d,
      id: authUser.data.user.id,
    })
    .select();

  if (error) {
    onSupabaseError(error);
  }

  return data;
};

export const getUserById = async (id: User["id"]) => {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .match({ id })
    .single();

  if (error) {
    onSupabaseError(error);
    return undefined;
  }

  return data;
};

export const getRandomUserButNotMe = async () => {
  const authUser = await supabase.auth.getUser();
  if (!authUser) {
    onSupabaseError("No user logged in");
    return;
  }

  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .not("id", "eq", authUser?.data?.user?.id)
    .limit(1);

  if (error) {
    onSupabaseError(error);
    return;
  }

  return data[0] as User;
};
