import { BskyAgent, ComAtprotoRepoStrongRef, RichText } from '@atproto/api'
import Logger from "../../../helpers/logger";
import { splitStringBySize } from '../../../helpers/splitStringBySize';


export async function mediaShare(post: any, destination: any) : Promise<boolean> {
    try {
        const agent = new BskyAgent({ service: 'https://bsky.social/' })
        await agent.login({ identifier: destination.identifier, password: destination.password })
        const contentArray = splitStringBySize(post.content, 300).map(text => new RichText({
          text,
        }))
        let firstResult: ComAtprotoRepoStrongRef.Main | undefined
        let lastResult: ComAtprotoRepoStrongRef.Main | undefined
        const fileRequest = await fetch(post.media.file.url)
        const buffer = await fileRequest.arrayBuffer()
        const encoding = await fileRequest.headers.get("Content-Type") as string;
        const uploaded = await agent.uploadBlob(new Uint8Array(buffer), { encoding })
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
              $type: 'app.bsky.embed.images',
              images: [
              {
                image: uploaded.data.blob,
                alt: post.media.name
              },
            ],
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

