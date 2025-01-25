import { Request, Response, Router } from "express";
import { env } from "bun";

const router = Router();

router.get("/callback", async (req: Request, res: Response)=>{
    res.redirect(`${env.AUTH0_REDIRECT_URI}/auth/twitter/callback?${new URLSearchParams(req.query).toString()}`);
})

export const auth = router