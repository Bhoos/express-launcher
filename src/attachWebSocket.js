const http = require('http');
const { createProxyServer } = require('http-proxy');

const proxy = createProxyServer({ ws: true });

/**
 * Handle the websocket upgrade request.
 */
module.exports = function attachWebSocket(server, app) {
  server.on('upgrade', (req, socket, head) => {
    req.wsProxy = (target) => {
      proxy.ws(req, socket, head, { target }, (e) => {
        // Looks like the remote proxy is not working properly
        socket.end(`HTTP/1.1 503 Remote Proxy Error\r\n\r\n${e.message}`);
      });
    };

    // Create a response object required for express
    const res = new http.ServerResponse(req);

    // handle the request via express,
    app(req, res, () => {
      // No handler found
      socket.end(`HTTP/1.1 503 No Websocket Proxy\r\n\r\nNo websocket proxy handler defined for ${req.url}`);
    });
  });
};
