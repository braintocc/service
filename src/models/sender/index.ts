import { PostResult } from "../../types/PostResult";
import Logger from "../../helpers/logger";
import { substackStrategies } from "../destination/substack";
import { linkedInStrategies } from "../destination/linkedin";
import { twitterStrategies } from "../destination/twitter";
import { mastodonStrategies } from "../destination/mastodon";
import { blueskyStrategies } from "../destination/bluesky";
import { youtubeStrategies } from "../destination/youtube";
import { instagramStrategies } from "../destination/instagram";
import { archivePosts } from "../source/notion/archivePosts";
import { getAwaitingPosts } from "../source/notion/getAwaitingPosts";

const strategies = [...linkedInStrategies, ...twitterStrategies, ...mastodonStrategies, ...substackStrategies, ...blueskyStrategies, ...youtubeStrategies, ...instagramStrategies]

function postToSocial(posts: any[], destination: any) : Promise<PostResult>[] {
    return posts.map(async (post: any) => {
        if(post.version[0] < 0 || post.version[1] < 7)
            return { 
                id: post.id, 
                result: {
                    executed: false,
                    error: "Incompatible Template version, please update your template"
                } 
            };
        const results = await Promise.all(strategies.
            filter(strategy => strategy.shouldRun(post, destination.find((destination: any) => strategy.site === destination.site)))
            .map(strategy => strategy.run(post, destination.find((destination: any) => strategy.site === destination.site))))
        return { 
            id: post.id, 
            result: {
                executed: results.some(result => result),
                error: "Unable to publish to one of more target social network"
            } 
        };
        
    });
}

const processUserMapping = async (map: any, sources: any[], destinations: any[]) => {
    if(map?.type !== "social" || sources?.length || destinations?.length)
        return
    try{
        const awaitingPosts = (await Promise.all(map.sources.map((source: any) => getAwaitingPosts(source.tableId, sources[source.id].accessToken)))).flat()
        const result = await Promise.all(postToSocial(awaitingPosts, map.destinations.map((destination: any) => destinations[destination.id])))
        await archivePosts(result, sources[map.sources[0].id])
    }
    catch(error){
        Logger.error(error)
    }   
}

export const processUserMappings = async (userInfo:any) => {
    await Promise.all(userInfo.mappings.map((map: any) => processUserMapping(map, userInfo.sources, userInfo.destinations)))
}
