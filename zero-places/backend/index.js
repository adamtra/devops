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

const connect = () => {
  pgClient.connect().then(() => {
    pgClient.query('CREATE TABLE IF NOT EXISTS places (a INT, b INT, c INT, p1 NUMERIC (8, 2) NULL, p2 NUMERIC (8, 2) NULL)')
        .catch((err) => {
            console.log(err);
        });
  }).catch(() => {
    setTimeout(() => {
      connect();
    }, 1000);
  });
}

connect();


const zeroPlaces = (a, b, c) => {
    const delta = Math.pow(b, 2) - 4 * a * c;
    if (delta >= 0) {
        const p1 = (-b - Math.sqrt(delta)) / (2 * a);
        const p2 = (-b + Math.sqrt(delta)) / (2 * a);
        return [p1, p2];
    } else {
        return [null, null];
    }
}

const addResult = (a, b, c, p1, p2) => {
    return new Promise((resolve, reject) => {
        pgClient
          .query(
            "INSERT INTO places (a, b, c, p1, p2) VALUES ($1, $2, $3, $4, $5)",
            [a, b, c, p1, p2]
          )
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
    })
}

app.get("/results", (req, res) => {
    pgClient
      .query("SELECT DISTINCT * FROM places")
      .then((data) => {
        return res.json(data.rows);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500);
      });
});

app.post("/results", (req, res) => {
    const a = parseInt(req.body.a) || 0;
    const b = parseInt(req.body.b) || 0;
    const c = parseInt(req.body.c) || 0;
    const key = `${a},${b},${c}`;
    client.get(key, async (err, value) => {
        try {
          if (value !== null) {
            const places = value.split(",");
            return res.json(places);
          }
          const places = zeroPlaces(a, b, c);
          const newValue = places.join(",");
          client.set(key, newValue);
          await addResult(a, b, c, places[0], places[1]);
          return res.json(places);
        } catch (err) {
          console.log(err);
          return res.status(500);
        }
    });
});

app.listen(4000, () => {
    console.log('Server listenig on port 4000');
});