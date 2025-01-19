import { Request, Response, Router } from "express";
import { User } from "../../models/user";
import { Client } from "@notionhq/client";
import { Podcast } from "podcast";
import { env } from "bun";
import { checkJwt } from "../../middleware/auth";
import { getWall } from "../../models/source/notion/getWall";
import { getConfiguration } from "../../helpers/config";

const router = Router();

router.get("/:id/rss/:accountId/:databaseId", async (req: Request, res: Response) => {
    const config = getConfiguration()
    const user = await User.findById(req.params.id).exec()
    if (!user)
        return res.status(404).send()
    const notion = new Client({
        auth: user.sources[req.params.accountId].accessToken as string
    });
    const { databaseId } = req.params;
    const podcastDBInfo: any = await notion.databases.retrieve({
      database_id: databaseId,
    });
    const podcastDB: any = await notion.databases.query({
      database_id: databaseId,
    });
    const info = Object.fromEntries(podcastDBInfo.description[0].text.content.split('\n').map((text: string) => text.split(':').map((text: string) => text.trim())));
    const feedOption = {
      title: info.title,
      feedUrl: `${config.BASE_URL}/rss/${databaseId}`,
      siteUrl: info.siteUrl,
      author: info.author,
      imageUrl: podcastDBInfo.icon.file.url,
      itunesOwner: { name: info.author, email: info.email },
    };
    const feed = new Podcast(feedOption);
    podcastDB.results
      .map((episode: any) => ({
        title: episode.properties.title.title[0].text.content,
        description: episode.properties.description.rich_text[0].text.content,
        url: episode.properties.episode.files[0].file.url,
        guid: episode.id,
        date: episode.properties.release.date.start,
        enclosure: {
          url: episode.properties.episode.files[0].file.url,
        },
        itunesImage: podcastDBInfo.icon.file.url
    }))
      .forEach((episode: any) => feed.addItem(episode));
    res.header("Content-Type", "application/rss+xml").send(feed.buildXml());
    res.send(user);
})

router.use((...params) => {
    checkJwt(...params)
})

router.get("/", async (req: Request, res: Response) => {
    const notionToken : string = req.headers["authorization-notion"] as string
    if(!notionToken)
        return res.send([])
    res.send(await getWall(notionToken))
})

export const podcasts = router