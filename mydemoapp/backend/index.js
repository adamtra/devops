const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');

const redis = require('redis');

const app = express();
app.use(bodyParser.json());

const client = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
});

const { Pool } = require('pg');

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => {
    console.log('Error');
});

pgClient.query('CREATE TABLE IF NOT EXISTS results (number INT)')
    .catch((err) => {
        console.log(err);
    });

const nwd = (input1, input2) => {
  let tmp;
  while (input2) {
    tmp = input1 % input2;
    input1 = input2;
    input2 = tmp;
  }
  return input1;
};

const addResult = (value) => {
    return new Promise((resolve, reject) => {
        pgClient
          .query("INSERT INTO results (number) VALUES ($1)", [value])
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
    })
}

app.get("/", (req, res) => {
    pgClient.query('SELECT DISTINCT number FROM results')
        .then((data) => {
            return res.json(data.rows);
        }).catch((err) => {
            console.log(err);
            return res.status(500);
        });
});

app.post("/", (req, res) => {
    const n1 = parseInt(req.body.n1) || 0;
    const n2 = parseInt(req.body.n2) || 0;
    let input1, input2;
    if (n1 > n2) {
      input1 = n1;
      input2 = n2;
    } else {
      input1 = n2;
      input2 = n1;
    }
    const key = `${input1},${input2}`;
    client.get(key, async (err, value) => {
      try {
        if (value !== null) {
          await addResult(value);
          return res.send(`${value}`);
        }
        const result = nwd(input1, input2);
        client.set(key, result);
        await addResult(result);
        return res.send(`${result}`);
      } catch (err) {
        console.log(err);
        return res.status(500);
      }
    });
});

app.listen(3000, () => {
    console.log('Server listenig on port 3000');
});