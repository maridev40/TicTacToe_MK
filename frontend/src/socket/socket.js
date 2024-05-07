import React from "react";
import socketio from "socket.io-client";
import package_json from '../../package.json';
const SOCKET_URL = package_json.proxy;

export const socket = socketio.connect(SOCKET_URL);
export const SocketContext = React.createContext();