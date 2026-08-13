const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const skillRoutes = require('./routes/skills.routes');
const matchRoutes = require('./routes/match.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const chatRoutes = require('./routes/chat.routes');
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('OK');
});

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', chatRoutes);

socketHandler(io);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});