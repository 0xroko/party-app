// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Expo } from "expo-server-sdk";
// import { supabase } from "@party-app/mobile/src/lib/supabase";
import { Database } from "@party-app/database/supabase";
import { sendPush } from "./frendship_request";

type Data = {
  name: string;
};
// https://nfdwiivovdwuobzxompi.supabase.co

const supabase = createClient<Database>(
  "https://nfdwiivovdwuobzxompi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZHdpaXZvdmR3dW9ienhvbXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg3MDYwODIsImV4cCI6MTk5NDI4MjA4Mn0.R-7PyVaxNmKbvNd9brbOtQULxNXU9sJUqxG_v-stneY"
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // TODO: create chat for party and add users
  // sendpush to users in party
  const { record, type, table } = req.body;
  // console.log(record);
  const userId = record.userBid;
  const { data, error } = await supabase
    .from("Friendship")
    .select(`userB: userBId (pushtoken), userA: userAId (displayname)`)
    .or(`userAId.eq.${record.hostId}`)
    .eq("accepted", true);
  if (type == "INSERT") {
    console.log(data, error);
    if (data)
      sendPush(
        data.map((el) => {
          console.log(el?.userB?.pushtoken);
          return {
            // @ts-ignore
            pushtoken: el?.userB?.pushtoken,
            data: {},
            // @ts-ignore
            body: `${el.userA.displayname} te poziva na ${record.name}`,
            categoryId: "new_party_notification",
          };
        })
      );
    else console.log(data, "no data");
  } else if (type == "DELETE") {
    if (data)
      sendPush(
        data.map((el) => {
          console.log(el?.userB?.pushtoken);
          return {
            // @ts-ignore
            pushtoken: el?.userB?.pushtoken,
            data: {},
            // @ts-ignore
            body: `${el.userA.displayname} je otkazao ${record.name}`,
            categoryId: "generic_party_notification",
          };
        })
      );
  }

  res.status(200).json({ name: "John Doe" });
}
