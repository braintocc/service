import { createRestAPIClient } from "masto";
import Logger from '../../../helpers/logger';
import { splitStringBySize } from "../../../helpers/splitStringBySize";


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
        const arrayPosts = splitStringBySize(post.content, 450)
        await Promise.all((arrayPosts).map(async (content: string, index: number) => {
            await masto.v1.statuses.create({
                    status: `${content}
(${index+1}/${arrayPosts.length})`,
                mediaIds: index === 0 ? [attachment.id] : undefined
            });
        }));
        return true
    }
    catch (error: any) {
        Logger.error(JSON.stringify(error, null, 2));
        return false
    }
}
