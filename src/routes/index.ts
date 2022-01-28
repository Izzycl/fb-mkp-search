import express from "express";
import SearchRouter from "./search";
import LocationRouter from "./locations";
const router = express.Router();

router.use("/search", SearchRouter);
router.use("/location", LocationRouter);

export default router;
