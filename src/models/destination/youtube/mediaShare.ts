import axios from "axios";
import Logger from "../../../helpers/logger";
import { TwitterApi } from "twitter-api-v2";
import path from "path";

export async function mediaShare(post: any, destination: any) : Promise<boolean> {
    try {
        const client = new TwitterApi(destination.accessToken);
        const file = await axios.get(post.media.file.url, {
            responseType: 'arraybuffer'
        });
        const mediaId = await client.v1.uploadMedia(file.data, { type: path.extname(post.media.name) });
        await client.v2.tweet({
            text: post.content,
            media: { media_ids: [mediaId] }
        });
        return true
    }
    catch (error) {
        Logger.error(error);
        return false
    }
}
