import { Router, Request, Response } from "express";
import { uploadMeasurement } from "../controllers/measurementController";

const router = Router()

router.post('/upload', uploadMeasurement)

router.patch('/confirm', (req: Request, res: Response) => {
    return res.send('Implement')
})

router.get('/:customer_code/list', (req: Request, res: Response) => {
    return res.send('Implement')
})

export default router