import express, { Request, Response } from "express";
import morgan from "morgan";
import "dotenv/config";
import Router from "./routes";
import cors from "cors";
const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(process.env.API_VERSSION, Router);
app.get("/", (req: Request, res: Response) => {
  res.send("Hi there!");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Running on port http://localhost:${process.env.PORT || 5000}`);
});
