import { Request, Response, Router } from "express";
import { createRestAPIClient } from "masto";
import { User } from "../../../models/user";

const router = Router();

router.get("/callback", async (req: Request, res: Response)=>{
    const masto = createRestAPIClient({
        accessToken: res.locals.grant.response.access_token,
        url: 'https://mastodon.social'
    });
    const user= await masto.v1.accounts.verifyCredentials()
    const name: string = user.acct
    const integrations: string[] = ["social"]
    const site: string = "mastodon"
    const accessToken = res.locals.grant.response.access_token
    const userDB = await User.findOne({email: req.session.grant.dynamic.user}).exec()
    userDB.destinations = {...userDB?.destinations, [name]: {
        name,
        integrations,
        site,
        accessToken,
    }}
    await userDB?.save()
    res.redirect(req.session.grant.dynamic.origin);
})

export const auth = router