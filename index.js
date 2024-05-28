require("dotenv").config();
const { createServer } = require("node:http");
const registerRouter = require("./routes/register");
const chatRouter = require("./routes/chat");
const express = require("express");
const mongoose = require("mongoose");
const db = mongoose.connection;
const port = 9997;
const app = express();
const { Server } = require("socket.io");
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
mongoose.connect(process.env.DATABASE_URL);
mongoose.set("strictQuery", true);
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

server.listen(port, () => console.log(`Server Started on port ${port}`));

app.use("/api", registerRouter);
app.use("/api", chatRouter);
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
