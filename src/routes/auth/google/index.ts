import { Request, Response, Router } from "express";
import { User } from "../../../models/user";

const router = Router();

function parseJwt (token: string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

router.get("/callback", async (req: Request, res: Response)=>{
    const name: string = parseJwt(res.locals.grant.response.id_token).name
    const integrations: string[] = ["social"]
    const site: string = "youtube"
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