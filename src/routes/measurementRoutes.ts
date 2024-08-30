import { Router, Request, Response } from "express";

const router = Router()

router.post('/upload', (req: Request, res: Response) => {
    return res.send('Implement')
})

router.patch('/confirm', (req: Request, res: Response) => {
    return res.send('Implement')
})

router.get('/:customer_code/list', (req: Request, res: Response) => {
    return res.send('Implement')
})

export default router