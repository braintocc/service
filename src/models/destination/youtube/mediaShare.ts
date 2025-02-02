import Logger from "../../../helpers/logger";
import { google } from "googleapis";
import axios from "axios";

const youtube = google.youtube('v3');


export async function mediaShare(post: any, destination: any) : Promise<boolean> {
    try {
        const { accessToken } = destination
        const auth = new google.auth.OAuth2()
        auth.setCredentials({
            access_token: accessToken
        })
        const file = await axios.get(post.media.file.url, {
            responseType: 'stream'
        });
        await youtube.videos.insert({
            notifySubscribers: true,
            requestBody: {
              snippet: {
                title: post.title,
                description: post.content,
              },
              status: {
                privacyStatus: 'public',
              },
            },
            media: {
              body: file.data,
            },
          })
        return true
    }
    catch (error) {
        Logger.error(error);
        return false
    }
}
