const express = require('express');

const redis = require('redis');

const app = express();

const client = redis.createClient({
  host: "redist-server",
  port: 6379
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

app.get('/:n1/:n2', (req, res) => {
  const n1 = parseInt(req.params.n1);
  const n2 = parseInt(req.params.n2);
  let input1, input2;
  if (n1 > n2) {
    input1 = n1;
    input2 = n2;
  } else {
    input1 = n2;
    input2 = n1;
  }
  const key = `${input1},${input2}`;
  client.get(key, (err, value) => {
    if (value !== null) {
      return res.send(`${value}`);
    }
    const result = nwd(input1, input2);
    client.set(key, result);
    return res.send(`${result}`);
  });
});

app.listen(3000, () => {
    console.log('Server listenig on port 3000');
});