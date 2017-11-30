import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8088 });
wss.on('connection', (ws) => {
  console.log('New Connection Request');
  ws.on('message', (message) => {
    console.log('received: %s', message);
  });
});
