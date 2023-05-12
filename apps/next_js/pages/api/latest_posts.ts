// pages/api/latest-posts.js
import { Database } from "@party-app/database/supabase";
import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize your Supabase client
const supabase = createClient<Database>(
	"https://nfdwiivovdwuobzxompi.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZHdpaXZvdmR3dW9ienhvbXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg3MDYwODIsImV4cCI6MTk5NDI4MjA4Mn0.R-7PyVaxNmKbvNd9brbOtQULxNXU9sJUqxG_v-stneY"
);

// Fetch the latest posts
const fetchLatestPosts = async (
	userId: string,
	limit: number,
	offset: number
) => {
	const { data: friends, error: friendsError } = await supabase
		.from("Friendship")
		.select("userAId, userBId")
		.or(`userAId.eq.${userId},userBId.eq.${userId}`)
		.filter("accepted", "eq", true);

	if (friendsError) {
		return { error: friendsError };
	}

	const friendIds = friends
		.flatMap((friend: { userAId: any; userBId: any }) => [
			friend.userAId,
			friend.userBId,
		])
		.filter((id: string) => id !== userId);

	// Fetch friends of friends
	const { data: friendsOfFriends, error: friendsOfFriendsError } =
		await supabase
			.from("Friendship")
			.select("userAId, userBId")
			.in("userAId", friendIds)
			.filter("accepted", "eq", true);

	if (friendsOfFriendsError) {
		return { error: friendsOfFriendsError };
	}

	const friendsOfFriendsIds = friendsOfFriends
		.flatMap((friend: { userAId: any; userBId: any }) => [
			friend.userAId,
			friend.userBId,
		])
		.filter((id: string) => id !== userId);
	const combinedIds = Array.from(
		new Set([...friendIds, ...friendsOfFriendsIds])
	);

	const { data: posts, error: postsError } = await supabase
		.from("Post")
		.select(
			`
      id,
      created_at,
      authorId,
      description,
      partyId,
      author:authorId(
        id,
        displayname,
        name,
        surname,
        imagesId
      ),
      party:partyId(
        id,
        name
      ),
      images:Images(
        id,
        pic_url
      ),
			comment:Comment(
				id,
				content,
				author:authorId(
					id,
					displayname
				)
			)
    `
		)
		.in("authorId", combinedIds)
		.order("created_at", { ascending: false })
		.limit(1, { foreignTable: "Comment" })
		.order("createdAt", { ascending: false, foreignTable: "Comment" })
		.range(offset, offset + limit - 1);

	if (postsError) {
		return { error: postsError };
	}

	return { posts };
};

// Set up the API route handler function
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { userId, limit = "10", offset = "0" } = req.query;
	//   check types
	if (typeof userId !== "string") {
		res
			.status(400)
			.json({ error: "Invalid query, userId missing or not string" });
		return;
	}
	if (typeof limit !== "string") {
		res
			.status(400)
			.json({ error: "Invalid query, limit missing or not string" });
		return;
	}
	if (typeof offset !== "string") {
		res
			.status(400)
			.json({ error: "Invalid query, offset missing or not string" });
		return;
	}

	if (req.method !== "GET") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}

	const { posts, error } = await fetchLatestPosts(
		userId,
		parseInt(limit),
		parseInt(offset)
	);

	if (error) {
		res.status(500).json({ error: error.message });
		return;
	}

	res.status(200).json({ posts });
}
