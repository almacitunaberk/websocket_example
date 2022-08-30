const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const http = require('http');
const server = http.createServer(app);
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost',
  },
});

const path = require('path');
const publicPath = path.join(__dirname, '..', 'client', 'build');

app.use(express.static(publicPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});

io.on('connection', (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);
  console.log(`New Connection: ${id}`);
  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient);
      newRecipients.push(id);
      socket.broadcast.to(recipient).emit('recieve-message', {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });
});
