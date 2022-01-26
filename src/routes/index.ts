import express from "express";
import SearchRouter from "./search";
const router = express.Router();

router.use("/search", SearchRouter);

export default router;
