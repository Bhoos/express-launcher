const http = require('http');
const proxy = require('http-proxy');
const app = require('express')();

const myApp = (req, res) => {
  console.log('Request url', req.url);
  app(req, res);
};

const server = http.createServer(app);
const proxyServer = proxy.createProxyServer();
server.on('upgrade', (req, socket, head) => {
  // proxyServer.ws(req, socket, head, { target: 'ws://localhost:8088' });
  req.ws = { socket, head };
  const res = new http.ServerResponse(req);
  console.log('Res is', res);
  app(req, res);
});

server.listen(8090, () => {
  console.log('Server listening at port', 8090);
});

app.use('/normal', (req, res) => {
  res.send('Normal');
});

app.use('/ws', (req, res) => {
  console.log('Reached here');
  proxyServer.ws(req, req.ws.socket, req.ws.head, { target: 'ws://localhost:8088' });
});
