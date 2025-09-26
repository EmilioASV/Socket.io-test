import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

let UsuariosConectados = 0;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  UsuariosConectados++;
  io.emit("usuarioConectado", UsuariosConectados);
  console.log(UsuariosConectados);
  socket.on("mensaje", (msg) => {
    socket.broadcast.emit(
      "notificacionMensaje",
      `Un usuario ha iniciado ${msg}`
    );
    console.log("Mensaje recibido: " + msg);
  });
  socket.on("disconnect", () => {
    UsuariosConectados--;
    io.emit("usuarioDesconectado", UsuariosConectados);
    console.log(UsuariosConectados);
  });
});

server.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
