const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;
const hostname = '0.0.0.0';

app.prepare().then(() => {
  require('http')
    .createServer((req, res) => handle(req, res))
    .listen(port, hostname, () => {
      console.log(`Server running on http://${hostname}:${port}`);
    });
});
