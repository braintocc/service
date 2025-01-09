import substack from "substack-sdk";
import Logger from "../../../helpers/logger";

export async function linkShare(post: any, destination: any) : Promise<boolean> {
    try {
        await substack.init(destination.cookie)
        const attachment = await substack.attachment.create("link",post.media.external.url)
        await substack.note.create(post.content.split('\n').filter((text: string) => text !== "").map((message: string) => ({message})), [attachment.id])
        return true
    }
    catch (error: any) {
        Logger.error(JSON.stringify(error, null, 2));
        return false
    }
}

