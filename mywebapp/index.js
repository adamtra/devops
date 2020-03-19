const express = require('express');

const app = express();


app.get('/', (req, res) => {
    console.log('New request');
    res.send('Hello world from Docker node app');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});