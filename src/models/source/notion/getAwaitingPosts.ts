import { Client } from "@notionhq/client";

export const getAwaitingPosts = async (databaseId: string, accessToken: string) => {
    const notion = new Client({
        auth: accessToken as string,
    });
    const posts: any = await notion.databases.query({
        filter: {
            "and": [
                {
                    "property": "Due Date",
                    "date": {
                        "on_or_before": new Date().toISOString()
                    }
                },
                {
                    "property": "Status",
                    "select": {
                        "equals": "Ready"
                    }
                }
            ]
        },
        database_id: databaseId
    });
    return posts.results.map((result: any) => (
        {
            id: result.id,
            title: result.properties.Text?.title[0]?.text.content,
            content: result.properties.Signature?.rich_text[0]?.text.content
                ? `${result.properties.Content.rich_text[0]?.text.content} 
${result.properties.Signature?.rich_text[0]?.text.content}`
                : result.properties.Content.rich_text[0]?.text.content,
            media: result.properties.Media.files[0],
            cover: result.properties.Cover.files[0],
            targets: result.properties.Target.multi_select.map((select: any) => select.name),
            version: result.properties.Version.rich_text[0]?.text.content.split("."),
        }));
};
