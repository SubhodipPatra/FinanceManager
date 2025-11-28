// api/index.js
require('dotenv').config(); // load .env first

const serverless = require("serverless-http");
const app = require("../app.js");

module.exports = serverless(app);
