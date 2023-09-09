import { WebSocketServer } from "ws";
import http from "http";
import connectDB from "./db.js";
connectDB();
import { Source, Note, Quiz, User, Group } from "./models/index.js";
import { canRead, canEdit } from "./lib/auth.js";

const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end("Web Socket running");
});

const sourceChange = Source.watch();
const noteChange = Note.watch();
const quizChange = Quiz.watch();

const clients = [];

const server = new WebSocketServer({ server: httpServer });

server.on("connection", async (ws, req) => {
  clients.push(ws);
  console.log("connected", clients);
  const cookies = req.headers.cookie;
  let token = cookies
    ?.split("; ")
    .find((cookie) => /token=/.test(cookie))
    ?.split("=")[1];
  if (token) {
    const user = await User.findOne({ refreshTokens: token });
    console.log(user.username);
    ws.user = user;
    ws.send(JSON.stringify({ message: `Welcome, ${user.username}!` }));
  } else {
    ws.send(JSON.stringify({ message: "Welcome!" }));
  }

  ws.on("message", (data) => {
    console.log(data);
  });

  ws.on("close", () => {
    const index = clients.indexOf(ws);
    if (index > -1) {
      clients.splice(index, 1);
    }

    console.log("Connection closed");
    console.log(clients);
  });
});

sourceChange.on("change", (change) => {
  console.log(change);
  const source = change.fullDocument;
  clients.forEach((client) => {
    if (canRead(source, client.user)) {
      client.send(JSON.stringify(change));
    } else {
      console.log(
        `User ${client.user?.username} is not authorized to view source title "${source.title}"`
      );
    }
  });
});

noteChange.on("change", (change) => {
  console.log(change);
  const note = change.fullDocument;
  clients.forEach((client) => {
    if (canRead(note, client.user)) {
      client.send(JSON.stringify(change));
    } else {
      console.log(
        `User ${client.user?.username} is not authorized to view note "${note.text}"`
      );
    }
  });
});

quizChange.on("change", (change) => {
  console.log(change);
  const quiz = change.fullDocument;
  clients.forEach((client) => {
    if (canRead(quiz, client.user)) {
      client.send(JSON.stringify(change));
    } else {
      console.log(
        `User ${client.user?.username} is not authorized to view quiz "${quiz.prompt}"`
      );
    }
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
