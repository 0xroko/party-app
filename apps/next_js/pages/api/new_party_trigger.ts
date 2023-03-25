// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Expo } from "expo-server-sdk";
type Data = {
  name: string;
};
// https://nfdwiivovdwuobzxompi.supabase.co

const supabase = createClient(
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
  const partyId = record.id;
  const db_res = await supabase
    .from("Chat")
    .insert([
      {
        partyId,
      },
    ])
    .select();
  // update party with chat id
  console.log("epic", db_res);
  const chatId = db_res.data![0].id;

  const db_res2 = await supabase
    .from("Party")
    .update({ chatId })
    .eq("id", record.id);
  // get all attendees of party
  // get push tokens of attendees from users table
  const db_res3 = await supabase
    .from("Attending")
    .select("userId")
    .eq("partyId", partyId);

  console.log(db_res3.data);

  console.log(db_res3.data);
  res.status(200).json({ name: "John Doe" });

  
}
