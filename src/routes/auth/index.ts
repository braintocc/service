import { Router } from "express";
import { auth as notionAuth } from "./notion";
import { auth as linkedinAuth } from "./linkedin";
import { auth as googleAuth } from "./google";
import { auth as twitterAuth } from "./twitter";
import { auth as mastodonAuth } from "./mastodon";
import { auth as substackAuth } from "./substack";
import { auth as blueskyAuth } from "./bluesky";

const router = Router();

router.use("/notion", notionAuth)
router.use("/linkedin", linkedinAuth)
router.use("/google", googleAuth)
router.use("/twitter", twitterAuth)
router.use("/mastodon", mastodonAuth)
router.use("/substack", substackAuth)
router.use("/bluesky", blueskyAuth)

export const auth = router