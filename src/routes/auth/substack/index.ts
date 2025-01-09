import { Request, Response, Router } from "express";
import { User } from "../../../models/user";

const router = Router();
router.post("/callback", async (req: Request, res: Response)=>{
    const name: string = "mysubstack"
    const integrations: string[] = ["social"]
    const site: string = "substack"
    const {email, cookie, origin }: {email:string, cookie: string, origin: string} = req.body
    const userDB = await User.findOne({email}).exec()
    userDB.destinations = {...userDB?.destinations, [name]: {
        name,
        integrations,
        site,
        cookie
    }}
    await userDB?.save()
    res.redirect(origin);
})

export const auth = router