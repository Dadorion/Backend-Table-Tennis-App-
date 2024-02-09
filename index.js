import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mainRouter from "./src/routers/mainRouter.js";
import authRouter from "./src/routers/authRouter.js";
import getPort from "get-port";
import cors from "cors";

const isTest = false;

let PORT;
if (isTest) {
  PORT = await getPort();
} else {
  PORT = process.env.PORT || 5000;
}

const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json("Welcome to Server v2. Use api and enjoy <(O_^)>");
});
app.use("/auth", authRouter);
app.use("/api", mainRouter);

export default app;

async function startApp() {
  try {
    app.listen(PORT, () => {
      console.log("SERVER WORK ON PORT " + PORT);
    });
  } catch (e) {
    console.error(e.message);
  }
}

startApp();
