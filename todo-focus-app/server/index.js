const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const todoRoutes = require('./routes/todoRoutes');
app.use('/api/todos', todoRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('newTodo', (todo) => {
    socket.broadcast.emit('newTodo', todo);
  });

  socket.on('deleteTodo', (id) => {
    socket.broadcast.emit('deleteTodo', id);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});