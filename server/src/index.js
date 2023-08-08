import http from 'http';
//import cron from 'node-cron';
import os from 'os';
import { Server as SocketServer } from 'socket.io';

import app from './app.js';
import configs from './configs.js';
import socketHandler from './socket.io.js';
import LogUtils from './utils/LogUtils.js';

const serverIp = Object.entries((Object.entries(os.networkInterfaces())[0]))?.[1]?.[1]?.filter(x => x.family === 'IPv4')?.[0]?.address || '';
const serverPort = configs.port;
const serverApi = http.createServer(app);

const io = new SocketServer(serverApi, {
  cors: { origin: '*', }
});
io.on('connection', (socket) => socketHandler(io, socket));

serverApi.listen(serverPort, () => {
  LogUtils.info('SERVER', `Server running at ${serverIp}:${serverPort}`);
});
