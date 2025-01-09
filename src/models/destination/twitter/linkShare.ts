import Logger from "../../../helpers/logger";
import { TweetV2PostTweetResult, TwitterApi } from "twitter-api-v2";
import { splitStringBySize } from "../../../helpers/splitStringBySize";

export async function linkShare(post: any, destination: any) : Promise<boolean> {
    try {
        const client = new TwitterApi(destination.accessToken);
        const contentArray = splitStringBySize(`${post.media.external.url} ${post.content}`, 279);
        let in_reply_to_tweet_id: string | undefined = undefined;
        for (const text of contentArray) {
            const result: TweetV2PostTweetResult = await client.v2.tweet({
                text,
                reply: in_reply_to_tweet_id
                    ? { in_reply_to_tweet_id }
                    : undefined
            });
            in_reply_to_tweet_id = result.data.id;
        }
        return true
    }
    catch (error) {
        Logger.error(error);
        return false
    }
}
