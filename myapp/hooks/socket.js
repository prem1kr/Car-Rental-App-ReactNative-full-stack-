import {io} from 'socket.io-client';

export function connectWs(){
    return io('https://car-rental-app-backend-wxdr.onrender.com');
}