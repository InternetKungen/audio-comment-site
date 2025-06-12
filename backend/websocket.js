import { WebSocketServer } from "ws";

export const createWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Ny WebSocket-anslutning");

    ws.on("message", (message) => {
      console.log("Meddelande:", message.toString());
    });

    ws.on("close", () => {
      console.log("WebSocket-anslutning stängd");
    });
  });

  return wss;
};
