import { BskyAgent, ComAtprotoRepoStrongRef, RichText } from '@atproto/api'
import Logger from "../../../helpers/logger";
import urlMetadata from "url-metadata";
import { splitStringBySize } from '../../../helpers/splitStringBySize';

export async function linkShare(post: any, destination: any) : Promise<boolean> {
    try {
        const agent = new BskyAgent({ service: 'https://bsky.social/' })
        await agent.login({ identifier: destination.identifier, password: destination.password })
        const contentArray = splitStringBySize(post.content, 300).map(text => new RichText({
          text,
        }))
        let firstResult: ComAtprotoRepoStrongRef.Main | undefined
        let lastResult: ComAtprotoRepoStrongRef.Main | undefined
        const metadata = await urlMetadata(post.media.external.url)
        for (const content of contentArray) {
          await content.detectFacets(agent) // automatically detects mentions and links
          const postRecord = {
            $type: 'app.bsky.feed.post',
            text: content.text,
            facets: content.facets,
            createdAt: new Date().toISOString(),
            reply: (firstResult && lastResult) 
              ? {
                root: firstResult,
                parent: lastResult
              }
              : undefined,
            embed: (!firstResult)
            ? {
                $type: 'app.bsky.embed.external',
                external: {
                  uri: post.media.external.url,
                  title: metadata.title,
                  description: metadata.description
                },
            }
            : undefined
          }
          lastResult = await agent.post(postRecord)
          if(!firstResult)
            firstResult = lastResult
        }
        return true
    }
    catch (error: any) {
        Logger.error(JSON.stringify(error, null, 2));
        return false
    }
}

