import { createRestAPIClient } from "masto";
import Logger from '../../../helpers/logger';

export async function linkShare(post: any, destination: any) : Promise<boolean> {
    try {
        const masto = createRestAPIClient({
            accessToken: destination.accessToken,
            url: 'https://mastodon.social'
        });
        await masto.v1.statuses.create({
            status: `${post.content} ${post.media.external.url}`
        });
        return true
    }
    catch (error: any) {
        Logger.error(JSON.stringify(error, null, 2));
        return false
    }
}
