import { setupRouter } from '@bhoos/express-api-router';
import { registerSite, startServer } from '../';

const api = {
  hello: (session, name) => name,
  world: (session, name) => name,
  pass: (session, port) => {
    if (port) {
      return port;
    }

    throw new Error('Websocket port not provided to pass');
  },
};

const configureRouter = (router) => {
  // Setup a simple get page, a post page and websocket proxy
  setupRouter(router, api, (r) => {
    r.route('hello', r.param('name'));
    r.route('world', r.form('name'));
    r.wsProxy(port => `ws://localhost:${port}`, 'pass', r.param('port'));
  });
};

registerSite('/r', configureRouter);
startServer();
