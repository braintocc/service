import { Request, Response, Router } from "express";
import { User } from "../../../models/user";

const router = Router();
router.post("/callback", async (req: Request, res: Response)=>{
    const name: string = "mybluesky"
    const integrations: string[] = ["social"]
    const site: string = "bluesky"
    const {email, origin, identifier, password }: {email:string, origin: string, identifier: string, password: string} = req.body
    const userDB = await User.findOne({email}).exec()
    userDB.destinations = {...userDB?.destinations, [name]: {
        name,
        integrations,
        site,
        identifier, 
        password
    }}
    await userDB?.save()
    res.redirect(origin);
})

export const auth = router