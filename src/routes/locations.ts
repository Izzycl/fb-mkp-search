import express, { Request, Response } from "express";
import { getLocations } from "../repositories/location.repository";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  res.send(await getLocations());
});

export default router;
