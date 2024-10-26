require('dotenv').config();

const express = require('express');
const app = express();
const port=3000

app.get('/', (req, res) => {
    res.send("HOLA AMIGO!")
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
