// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Expo } from "expo-server-sdk";
// import { supabase } from "@party-app/mobile/src/lib/supabase";
import { Database } from "@party-app/database/supabase";

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
  if (type == "INSERT") {
    const r = await supabase
      .from("Friendship")
      .select("*")
      .eq("userAId", userId)
      .eq("userBId", record.userAId);

    const {
      //@ts-ignore
      data: { pushtoken },
    } = await supabase
      .from("Users")
      .select("pushtoken")
      .eq("id", userId)
      .single();
    const {
      //@ts-ignore
      data: { name, surname },
    } = await supabase
      .from("Users")
      .select("*")
      .eq("id", record.userAid)
      .single();

    console.log(pushtoken);
    if (r.data == null) {
      sendPush([
        {
          pushtoken,
          data: { userAid: record.userAid },
          body: `${name} ${surname} vam šalje zahtjev za prijateljstvo`,
          categoryId: "friendship_request",
        },
      ]);
    } else {
      sendPush([
        {
          pushtoken,
          data: {},
          body: `${name} ${surname} je prihvatio vaš zahtjev za prijateljstvo`,
        },
      ]);
    }
  }
  res.status(200).json({ name: "John Doe" });
}

export const sendPush = async (
  pushobjects: {
    pushtoken: string;
    data: object;
    body: string;
    sound?: string;
    categoryId?: string;
  }[]
) => {
  let expo = new Expo();

  let messages = [];
  for (let pushobject of pushobjects) {
    const { pushtoken, data, body, sound, categoryId } = pushobject;

    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushtoken)) {
      console.error(`Push token ${pushtoken} is not a valid Expo push token`);
      continue;
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      to: pushtoken,
      sound: sound || "default",
      body,
      data,
      categoryId,
    });
    console.log(messages)
  }

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  //@ts-ignore
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  })();
};
