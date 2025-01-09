import { RestliClient } from 'linkedin-api-client';
import Logger from '../../../helpers/logger';

const USER_INFO_RESOURCE = '/userinfo';
const UGC_POSTS_RESOURCE = '/ugcPosts';

export async function linkShare(post: any, destination: any) : Promise<boolean> {
    try {
        const { accessToken } = destination
        const restliClient = new RestliClient();
        const userinfo = await restliClient.get({
            resourcePath: USER_INFO_RESOURCE,
            accessToken
          });
        await restliClient.create({
            resourcePath: UGC_POSTS_RESOURCE,
            entity: {
                author: `urn:li:person:${userinfo.data.sub}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: post.content
                    },
                    "shareMediaCategory": "ARTICLE",
                    "media": [
                        {
                            "status": "READY",
                            "originalUrl": post.media.external.url
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
