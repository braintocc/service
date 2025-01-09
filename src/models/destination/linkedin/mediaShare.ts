import axios from "axios";
import Logger from "../../../helpers/logger";
import isImage from 'is-image';
import { RestliClient } from 'linkedin-api-client';

const USER_INFO_RESOURCE = '/userinfo';
const UGC_POSTS_RESOURCE = '/ugcPosts';

async function UploadMedia(userId: string, media: any, accessToken: string): Promise<string> {
    const instance = axios.create({
        baseURL: 'https://api.linkedin.com/v2',
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
        timeout: 30000
    });
    const mediaReservation = await instance.post("/assets?action=registerUpload",
            {
                "registerUploadRequest": {
                    "recipes": [
                        `urn:li:digitalmediaRecipe:${isImage(media.name) ? 'feedshare-image' : 'feedshare-video'}`
                    ],
                    "owner": `urn:li:person:${userId}`,
                    "serviceRelationships": [
                        {
                            "relationshipType": "OWNER",
                            "identifier": "urn:li:userGeneratedContent"
                        }
                    ]
                }
            });
        const file = await axios.get(media.file.url, {
            responseType: 'stream'
        });

        await axios.put(mediaReservation.data.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl,
            file.data,
            {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/octet-stream',
                }
            });
    return mediaReservation.data.value.asset
}

export async function mediaShare(post: any, destination: any) : Promise<boolean> {
    try {
        const { accessToken } = destination
        const restliClient = new RestliClient();
        const userInfo = await restliClient.get({
            resourcePath: USER_INFO_RESOURCE,
            accessToken
          });
        const uploadedMediaId = await UploadMedia(userInfo.data.sub, post.media, accessToken)
        await restliClient.create({
            resourcePath: UGC_POSTS_RESOURCE,
            entity: {
                author: `urn:li:person:${userInfo.data.sub}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: post.content
                    },
                    "shareMediaCategory": isImage(post.media.name) ? "IMAGE" : "VIDEO",
                    "media": [
                        {
                            "status": "READY",
                            "media": uploadedMediaId
                        }
                    ]
                }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            },
            accessToken
        });
        return true
    }
    catch (error: any) {
        Logger.error(JSON.stringify(error, null, 2));
        return false
    }
}
