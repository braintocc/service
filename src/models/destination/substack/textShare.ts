import Logger from '../../../helpers/logger';
import substack from "substack-sdk";

export async function textShare(post: any, destination: any) : Promise<boolean> {
    try {
        await substack.init(destination.cookie)
        await substack.note.create(post.content.split('\n').filter((text: string) => text !== "").map((message: string) => ({message})))
       return true
    }
    catch (error: any) {
        Logger.error(JSON.stringify(error, null, 2));
        return false
    }
}
