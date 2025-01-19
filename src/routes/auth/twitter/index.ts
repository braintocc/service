import { Request, Response, Router } from "express";
import { getConfiguration } from "../../../helpers/config";

const router = Router();

router.get("/callback", async (req: Request, res: Response)=>{
    const config = getConfiguration()
    res.redirect(`${config.AUTH0_REDIRECT_URI}/auth/twitter/callback?${new URLSearchParams(req.query).toString()}`);
})

export const auth = router