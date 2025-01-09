import { Request, Response, Router } from "express";
import { checkJwt } from "../../middleware/auth";
import { getWall } from "../../models/source/notion/getWall";

const router = Router();

router.use((...params) => {
    checkJwt(...params)
})

router.get("/", async (req: Request, res: Response) => {
    const notionToken : string = req.headers["authorization-notion"] as string
    if(!notionToken)
        return res.send([])
    res.send(await getWall(notionToken))
})

export const socials = router