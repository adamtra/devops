const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require("mariadb");

const app = express();
app.use(bodyParser.json());

const dbClient = mariadb.createPool({
  user: keys.mariaUser,
  host: keys.mariaHost,
  database: keys.mariaDatabase,
  password: keys.mariaPassword,
});

dbClient.on('error', () => {
    console.log('Error');
});

const connect = () => {
  dbClient
    .getConnection()
    .then((conn) => {
      conn
        .query("CREATE TABLE IF NOT EXISTS requests (a varchar(255))")
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(() => {
      setTimeout(() => {
        connect();
      }, 1000);
    });
}

connect();


const addResult = (a) => {
  return new Promise(async (resolve, reject) => {
    const conn = await dbClient.getConnection();
    conn
      .query("INSERT INTO requests (a) VALUES (?)", [a])
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const appPort = 5000;

app.get("/", (req, res) => {
  return res.send('Hello');
});

app.get("/results", async (req, res) => {
  const conn = await dbClient.getConnection();
    conn
      .query("SELECT * FROM requests")
      .then((rows) => {
        return res.json(rows);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500);
      });
});

app.post("/", async (req, res) => {
  const { key } = req.body;
  await addResult(key);
  return res.json('Added');
});

app.listen(appPort, () => {
  console.log(`Backend listenig on port ${appPort}`);
});