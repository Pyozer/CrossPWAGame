import io from 'socket.io';
import express from 'express';
import dotenv from 'dotenv';
import { isNull } from './utils/FuncUtils';
import { AppGame } from './AppGame';

dotenv.config();
if (isNull(process.env.PORT)) {
    throw 'Missing PORT ENV !';
}
const PORT = parseInt(process.env.PORT);

const app = express();
const server = app.listen(PORT, () => {
    console.log('==========================================');
    console.log(`=== CrossPWA API is started on PORT ${PORT} ===`);
    console.log('==========================================');
});

const socketio = io(server);
new AppGame(socketio);
