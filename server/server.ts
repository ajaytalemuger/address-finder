import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.get("/", (req: Request, res: Response) => {
  res.send("Address Finder Server");
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
