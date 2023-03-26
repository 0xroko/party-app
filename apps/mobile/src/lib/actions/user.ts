import { onSupabaseError, User } from "@lib/actions";
import { supabase } from "@lib/supabase";

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

export const checkIfDisplayNameExists = async (displayName: string) => {
  const { data, error } = await supabase
    .from("Users")
    .select("count")
    .filter("displayname", "eq", displayName);

  if (error) {
    onSupabaseError(error);
    return false;
  }

  if (data[0].count === 0) {
    return false;
  }
  return true;
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
    .match({ id });

  if (error) {
    onSupabaseError(error);
  }

  return data;
};
