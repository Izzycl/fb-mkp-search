import express, { Request, Response } from "express";
import { getLocations } from "../repositories/location.repository";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  res.send(await getLocations(req.body.query));
});

export default router;
