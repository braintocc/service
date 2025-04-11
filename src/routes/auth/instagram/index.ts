import { Request, Response, Router } from "express";
import { User } from "../../../models/user";

const router = Router();

router.post("/callback", async (req: Request, res: Response) => {
    const name: string = "myinstagram"
    const integrations: string[] = ["social"]
    const site: string = "instagram"
    const { username, password, email, origin } = req.body;
    const userDB = await User.findOne({ email }).exec();
    
    if (!userDB) {
        return res.status(404).send();
    }

    userDB.destinations = {
        ...userDB?.destinations,
        [username]: {
            name,
            username,
            password,
            integrations,
            site
        }
    };
    
    await userDB?.save();
    res.redirect(origin);
});

export const auth = router;