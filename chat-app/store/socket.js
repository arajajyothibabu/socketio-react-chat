import io from 'socket.io-client';
import {WS_HOST} from "../conf";
const socket = io(WS_HOST);
socket.connect();
export default socket;