import { IgApiClient } from 'instagram-private-api';
import Logger from "../../../helpers/logger";
import axios from "axios";

export async function mediaShare(post: any, destination: any): Promise<boolean> {
    try {
        const ig = new IgApiClient();
        ig.state.generateDevice(destination.username);
        await ig.simulate.preLoginFlow();
        await ig.account.login(destination.username, destination.password);
        process.nextTick(async () => await ig.simulate.postLoginFlow());
        const file = await axios.get(post.media.file.url, {
            responseType: 'stream'
        });

        // Publish based on media type
        if (post.media.name.match(/\.(mp4|mov)$/i)) {
            const coverImage = await axios.get(post.media.cover.url, {
                responseType: 'stream'
            });
            await ig.publish.video({
                video: file.data,
                coverImage: coverImage.data,
                caption: post.content,
            });
        } else {
            // Photo post
            await ig.publish.photo({
                file: file.data,
                caption: post.content
            });
        }
        
        return true;
    } catch (error) {
        Logger.error(error);
        return false;
    }
}