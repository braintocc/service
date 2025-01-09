import { Client } from "@notionhq/client";
import { PostResult } from "../../../types/PostResult";

export const archivePosts = async (posts: PostResult[], source: any) => {
    const notion = new Client({
        auth: source.accessToken as string,
    });
    return Promise.all(posts.map(post => notion.pages.update({ 
        page_id: post.id, 
        properties: 
        { 
            Status: { 
                select: { "name": post.result.executed ? "Published" : "Errored" } 
            },
            Error: {
                rich_text: post.result.executed ? [] :  [{ text: { content: post.result.error } }]
            } 
        } 
    })));

};
