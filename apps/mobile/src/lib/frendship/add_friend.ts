import { onSupabaseError, User } from "@lib/actions";
import { supabase } from "@lib/supabase";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// const authUser = await supabase.auth.getUser();

const send_friend_request = async (friend_id: string) => {
  const authUser = await supabase.auth.getUser();
  if (!authUser.data?.user?.id) {
    onSupabaseError("No user logged in");
    return false;
  }
  const r = await supabase.from("Friendship").insert([
    {
      userAId: authUser.data.user.id,
      userBId: friend_id,
    },
  ]);
  if (r.error) {
    onSupabaseError(r.error);
    return false;
  }
  return true;
};

const accept_friend_request = async (friend_id: string) => {
  const authUser = await supabase.auth.getUser();
  if (!authUser.data?.user?.id) {
    onSupabaseError("No user logged in");
    return false;
  }
  const r = await supabase.from("Friendship").insert([
    {
      userAId: friend_id,
      userBId: authUser.data.user.id,
    },
  ]);
  if (r.error) {
    onSupabaseError(r.error);
    return false;
  }
  return true;
};

const check_for_friend_request = async () => {
  const authUser = await supabase.auth.getUser();
  if (!authUser.data?.user?.id) {
    onSupabaseError("No user logged in");
    return false;
  }
  const r = await supabase
    .from("Friendship")
    .select("*")
    .eq("userBId", authUser.data.user.id);
  if (r.error) {
    onSupabaseError(r.error);
    return false;
  }
  return r.data.length > 0;
};

const block_friend = async (friend_id: string) => {
  const authUser = await supabase.auth.getUser();
  if (!authUser.data?.user?.id) {
    onSupabaseError("No user logged in");
    return false;
  }
  const r = await supabase
    .from("Friendship")
    .update({
      blocked: true,
    })
    .eq("userAId", authUser.data.user.id)
    .eq("userBId", friend_id);
  if (r.error) {
    onSupabaseError(r.error);
    return false;
  }
  return true;
};

const remove_friend = async (friend_id: string) => {
  const authUser = await supabase.auth.getUser();
  if (!authUser.data?.user?.id) {
    onSupabaseError("No user logged in");
    return false;
  }
  const r1 = await supabase
    .from("Friendship")
    .delete()
    .eq("userAId", authUser.data.user.id)
    .eq("userBId", friend_id);
  const r2 = await supabase
    .from("Friendship")
    .delete()
    .eq("userAId", friend_id)
    .eq("userBId", authUser.data.user.id);
  if (r1.error || r2.error) {
    onSupabaseError(r1.error || r2.error);
    return false;
  }
  return true;
};
