import { WebSocketServer } from "ws";
import http from "http";
import connectDB from "./db.js";
connectDB();
import { Source, Note, Quiz, User, Group } from "./models/index.js";

const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end("Web Socket running");
});

const sourceChange = Source.watch();
const noteChange = Note.watch();
const quizChange = Quiz.watch();

const server = new WebSocketServer({ server: httpServer });

server.on("connection", async (ws, req) => {
  console.log("A client connected", req.socket.remoteAddress);
  const cookies = req.headers.cookie;
  console.log(cookies);
  let token = cookies
    ?.split("; ")
    .find((cookie) => /token=/.test(cookie))
    ?.split("=")[1];
  console.log(token);
  if (token) {
    const user = await User.findOne({ refreshTokens: token });
    console.log(user.username);
    ws.send(JSON.stringify({ message: `Welcome, ${user.username}!` }));
  } else {
    ws.send(JSON.stringify({ message: "Welcome!"}))
  }

  ws.on("message", (data) => {
    console.log(data);
  });

  ws.on("close", () => {
    console.log("Connection closed");
  });

  sourceChange.on("change", (change) => {
    console.log(change);
    ws.send(JSON.stringify(change));
  });

  noteChange.on("change", (change) => {
    console.log(change);
    ws.send(JSON.stringify(change));
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
