const WebSocket = require("ws");
const http = require("http");
const { Source, Note, Quiz, User, Group } = require("@mneme_app/database-models")

const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end("Web Socket running");
});

const server = new WebSocket.Server({ server: httpServer });

server.on("connection", (ws, req) => {
  console.log("A client connected", req.socket.remoteAddress);
  ws.send("Welcome!");

  ws.on("message", (data) => {
    console.log(data);
  });

  ws.on("close", () => {
    console.log("Connection closed");
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
