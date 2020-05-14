const express = require('express');
const bodyParser = require('body-parser');

const redis = require('redis');

const app = express();
app.use(bodyParser.json());

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retry_strategy: () => 1000
});

const appPort = 5000;

app.get('/', (req, res) => {
    return res.json(`Działa`);
});

app.listen(appPort, () => {
    console.log(`Backend listenig on port ${appPort}`);
});