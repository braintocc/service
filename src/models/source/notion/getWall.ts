import { Client } from "@notionhq/client";

export const getWall = async (token: string) => {
    const notion = new Client({
        auth: token,
    });
    const shared: any = await notion.search({
        filter: {
            value: 'database',
            property: 'object'
        },
    });
    return shared.results.map((res: any) => ({ id: res.id, title: res.title[0].plain_text, url: res.url, icon: res.icon }));

};
