import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import apiAddress from "./routes/address";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "/build")));

app.use("/api/address", apiAddress);

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
