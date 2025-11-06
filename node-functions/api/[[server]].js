require('dotenv').config();
const http = require('http');
const app = require('../src/app');

const PORT = process.env.PORT || 5050;

const server = http.createServer(app.callback());

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Koa server running on port ${PORT}`);
});


