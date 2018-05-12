const path = require('path');

const Koa = require('koa');
const cors = require('@koa/cors');
const body = require('koa-body');
const logger = require('koa-logger');
const static = require('koa-static')(path.resolve(__dirname, '.', 'dist'));

const PORT = process.env.PORT || 5000;

const ROOT_DIR = process.env.NODE_ENV === 'production' ? '/' : __dirname;

const app = new Koa();

app.keys()
// Middleware
app.use(cors());
app.use(body());
app.use(logger());
app.use(static);

// Start server
app.listen(PORT);
console.log('* vue project in heroku %s', PORT);
console.log('* Output directory: %s', ROOT_DIR);
