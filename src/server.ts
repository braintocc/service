import express, { json, Application } from "express";
import { auth as authRoute } from "./routes/auth";
import { user as userRoute } from "./routes/user";
import { socials as socialsRoute } from "./routes/socials";
import { podcasts as podcastsRoute } from "./routes/podcasts";
import session from 'express-session';
import grant from 'grant';
import { env } from "bun";
import cors from "cors";
import MongoStore from 'connect-mongo'
import { logErrors } from "./middleware/logErrors";
import { requestLogger } from "./middleware/requestLogger";

export const server :  () => Application = () => {
    const app = express()

    app.use(cors())
        .set('trust proxy', 1)
        .use(session({
            secret: '58a9be38-7e31-496f-8923-efffe11744a8',
            store: MongoStore.create({
                mongoUrl: env.MONGODB_URL!,
                ttl: 10 * 60,
                autoRemove: 'native',
                crypto: {
                    secret: '0c4b6a66-b573-4614-97d8-12e511c5c3ef'
                }
            }),
            saveUninitialized: false, 
            resave: false
        }))
        .use(require('body-parser').urlencoded({extended: true}))
        .use(json())
        .use(requestLogger)
        .use(grant.express({
            "defaults": {
                "origin": env.BASE_URL,
                "transport": "state",
            },
            "notion": {
                "key": env.NOTION_KEY,
                "secret": env.NOTION_SECRET
            },
            "linkedin": {
                "key": env.LINKEDIN_KEY,
                "secret": env.LINKEDIN_SECRET,
                "callback": "/auth/linkedin/callback",
                "scope":["w_member_social","openid","profile"]
            },
            "twitter2": {
                "dynamic": ["key", "secret"],
                "callback": "/auth/twitter/callback",
                "state": true,
                "pkce": true,
                "scope": [
                "tweet.read",
                "tweet.write",
                "users.read",
                "offline.access"
                ]
            },
            "mastodon": {
                "subdomain": env.MASTODON_SUBDSOMAIN,
                "key": env.MASTODON_KEY,
                "secret": env.MASTODON_SECRET,
                "callback": "/auth/mastodon/callback",
                scope: [
                    "write:media",
                    "write:statuses",
                    "profile"
                ]
            }
        }))
        .use("/auth", authRoute)
        .use("/connect", authRoute)
        .use("/user", userRoute)
        .use("/socials", socialsRoute)
        .use("/podcasts", podcastsRoute)
        .use(logErrors)
    return app
}

