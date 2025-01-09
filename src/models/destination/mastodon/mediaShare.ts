import { createRestAPIClient } from "masto";
import Logger from '../../../helpers/logger';


export async function mediaShare(post: any, destination: any) : Promise<boolean> {
    try {
        const masto = createRestAPIClient({
            accessToken: destination.accessToken,
            url: 'https://mastodon.social'
        });
        const file = await fetch(post.media.file.url).then(result => result.blob())
        const attachment = await masto.v2.media.create({
            file: new File([file as any], post.media.name)
        })
        await masto.v1.statuses.create({
            status: post.content,
            mediaIds: [attachment.id]

        });
        return true
    }
    catch (error: any) {
        Logger.error(JSON.stringify(error, null, 2));
        return false
    }
}
