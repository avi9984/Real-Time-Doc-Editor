const express = require('express');
const { app, server } = require('../backend/socket/socket');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const userRoutes = require('./routes/user');
const documentRoutes = require('./routes/document');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(cors(["*", "http://localhost:5173/"]));


// app.use("/documents", (req, res, next) => {
//     req.io = io;
//     next();
// })

mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDB is connected")).catch((err) => console.log(err));




app.use('/users', userRoutes);
app.use('/documents', documentRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})


