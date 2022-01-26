import express, { Request, Response } from "express";
import { searchItems } from "../repositories/search.repository.ts";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  res.send(await searchItems(req.body));
});

export default router;
