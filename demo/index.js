module.exports = (router) => {
  router.get('/demo', (req, res) => {
    res.send('Hello World from Demo');
  });
};
