import substack from "substack-sdk";
import Logger from "../../../helpers/logger";
import { toDataURL } from "../../../helpers/toDataURL";

export async function mediaShare(post: any, destination: any) : Promise<boolean> {
    try {
        await substack.init(destination.cookie)
        const file = await toDataURL(post.media.file.url)
        const uploaded = await substack.image.upload(file)
        const attachment = await substack.attachment.create("image",uploaded.url)
        await substack.note.create(post.content.split('\n').filter((text: string) => text !== "").map((message: string) => ({message})), [attachment.id])
        return true
    }
    catch (error: any) {
        Logger.error(JSON.stringify(error, null, 2));
        return false
    }
}

