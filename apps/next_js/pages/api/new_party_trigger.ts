// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
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
    .select(`userB: userBId (id, pushtoken), userA: userAId (displayname)`)
    .not("pushtoken", "eq", null)
    .or(`userAId.eq.${record.hostId}`)
    .eq("accepted", true);
  if (type == "INSERT") {
    console.log(data, error);
    if (data) {
      sendPush(
        data.map((el) => {
          // console.log(el?.userB?.pushtoken);

          return {
            // @ts-ignore
            pushtoken: el?.userB?.pushtoken,
            // @ts-ignore
            data: { partyId: record.id, userId: el.userB.id },
            // @ts-ignore
            body: `${el.userA.displayname} te poziva na ${record.name}`,
            categoryId: "new_party_notification",
          };
        })
      );

      const { data: data_chat_res, error: error1 } = await supabase
        .from("Chat")
        .upsert([
          {
            partyId: record.id,
          },
        ]);
      console.log("Chat", data_chat_res, error1);
      // const { data: friend_list, error: error2 } = await supabase
      //   .from("Friendship")
      //   .select("*")
      //   .eq("userAId", record.hostId)
      //   .eq("accepted", true);
      const people_attending = data.map((el) => {
        return {
          partyId: record.id,
          //@ts-ignore
          userId: el.userB.id,
        };
      });

      people_attending.push({
        partyId: record.id,
        userId: record.hostId,
      });
      const { data: attending_return, error: attending_error } = await supabase
        .from("Attending")
        .upsert(people_attending);

      console.log("Attending", attending_return, attending_error);

      // console.log("🤯🤯", data_chat_res, error);
    }
  } else if (type == "DELETE") {
    if (data)
      sendPush(
        data.map((el) => {
          // console.log(el?.userB?.pushtoken);
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
