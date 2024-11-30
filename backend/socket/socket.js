const express = require('express');
const app = express();
const http = require('http');
const socket = require('socket.io');
const server = http.createServer(app)
const io = socket(server, {
    cors: {
        origin: 'http://localhost:5173', // Replace with the frontend's URL
        methods: ['GET', 'POST'],
    },
});
app.use("/documents", (req, res, next) => {
    req.io = io;
    next();
})
const documentState = {};

// Socket.IO Handlers
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // socket.on('joinDocument', (docId) => {
    //     console.log(`User ${socket.id} joined document: ${docId}`);
    //     socket.join(docId);
    // });

    // socket.on('editDocument', ({ docId, changes }) => {
    //     console.log(`Document ${docId} updated by ${socket.id}:`, changes);

    //     documentState[docId] = changes;

    //     // Broadcast changes to other users in the room
    //     socket.to(docId).emit('documentUpdated', changes);
    // });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

module.exports = { app, server, io }