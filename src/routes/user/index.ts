import { Request, Response, Router } from "express";
import { User } from "../../models/user";
import { checkJwt } from "../../middleware/auth";

const router = Router();

router.use((...params) => {
    checkJwt(...params)
})

router.post("/", async (req: Request, res: Response) => {
    try{
    const worker = new User({...req.body, subscription: { level: "free" }});
    res.status(201).send(await worker.save());
    }
    catch(ex){
        res.status(400).send()
    }
})

router.put("/:email", async (req: Request, res: Response) => {
    const user = await User.findOneAndUpdate({email: req.params.email}, req.body).exec()
    if (!user)
        return res.status(404).send()
    res.status(200).send(user);
})

router.get("/:email", async (req: Request, res: Response)=>{
    const user = await User.findOne({email: req.params.email}).exec()
    if (!user)
        return res.status(404).send()
    res.status(200).send(user);
})

export const user = router