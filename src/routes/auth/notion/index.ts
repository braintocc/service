import { Request, Response, Router } from "express";
import { User } from "../../../models/user";

const router = Router();
router.get("/callback", async (req: Request, res: Response)=>{
    const integrations: string[] = ["social"]
    const site: string = "notion"
    const userDB = await User.findOne({email: req.session.grant.dynamic.user}).exec()
    userDB.sources = {...userDB?.sources, [res.locals.grant.response.raw.workspace_id]: {
        name: res.locals.grant.response.raw.workspace_name,
        integrations,
        site,
        accessToken: res.locals.grant.response.access_token
    }}
    await userDB?.save()
    res.redirect(req.session.grant.dynamic.origin);
})

export const auth = router