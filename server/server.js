const express = require('express');
const multer = require('multer');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const upload = multer({ dest: './public/avatars/' });

// Prepare o Next.js antes de configurar o servidor Express
app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  server.use(express.json());

  // Rota para upload de avatar
  server.post('/api/upload', upload.single('avatar'), (req, res) => {
    const avatarUrl = `/avatars/${req.file.filename}`;
    res.json({ avatarUrl });
  });

  io.on('connection', (socket) => {
    socket.on('roll', (data) => {
      // Ajustar os resultados para incluir o tipo de dado
      const results = Object.entries(data.diceCounts).flatMap(([die, count]) =>
        Array.from({ length: count }, () => ({
          die: die.slice(1), // Extrai o número do tipo de dado, como 4 para d4
          value: Math.ceil(Math.random() * parseInt(die.slice(1))),
        }))
      );
  
      // Emitir a rolagem com nome, avatar, nome da rolagem e resultados ajustados
      io.emit('new-roll', {
        name: data.name,
        avatar: data.avatar,
        rollName: data.rollName,
        results,
      });
    });
  });
  

  // Gerencie todas as outras rotas com o Next.js
  server.all('*', (req, res) => handle(req, res));

  // Inicie o servidor HTTP
  const PORT = 3000;
  httpServer.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Erro ao preparar o Next.js:', err);
});
