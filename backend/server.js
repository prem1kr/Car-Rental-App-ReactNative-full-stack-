import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectMongoose from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import { createServer } from 'node:http';
import { Server } from "socket.io";
import { socketConnection } from "./config/socket.js";
import carRouter from "./routes/carRoute.js";
import profileRouter from "./routes/profileRoute.js";
import notificationRouter from "./routes/notificationRoute.js";
import sendEmail from "./utils/sendEmail.js";
import offerRouter from "./routes/offerRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import addressRouter from "./routes/addressRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import referalRouter from "./routes/referalRoute.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],

}));

app.use('/api/auth', authRouter);
app.use('/api/car', carRouter);
app.use('/api/profile', profileRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/offer', offerRouter);
app.use('/api/review', reviewRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/address', addressRouter);
app.use('/api/payment', paymentRoute);
app.use('/api/referal', referalRouter);

app.get('/test-mail', async (req, res) => {
    try {
        await sendEmail('prem78334@gmail.com', 'Prem');
        res.send('Mail Sent');
    } catch (error) {
        console.log("FULL ERROR:", error);
        res.status(500).send(error.message);
    }
});

// socket connection
socketConnection(io);
const Room = 'group';
let adminSockedId = null;

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (userName) => {
        socket.join(Room);
        socket.to(Room).emit('RoomNotice', `${userName} joined the group`);
    });

    socket.on('chatMessage', (msg) => {
        socket.to(Room).emit('chatMessage', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

});

const startServer = async () => {
    await ConnectMongoose();
    server.listen(process.env.PORT || 5000, () => {
        console.log(` Server running on port ${process.env.PORT || 5000}`);
    });
};

startServer();
