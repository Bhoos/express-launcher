const express = require('express');
const bodyParser = require('body-parser');

const http = require('http');

const attachWebSocket = require('./attachWebSocket');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

attachWebSocket(server, app);

app.use(bodyParser.urlencoded({ extended: false }));

exports.startServer = function startServer() {
  return new Promise((resolve, reject) => {
    server.listen(PORT, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve(PORT);
    });
  });
};

exports.registerSite = function registerSite(path, configureRouter, options) {
  const r = express.Router();
  configureRouter(r, options);
  app.use(path, r);
};
