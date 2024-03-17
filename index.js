const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.sendFile('./public/mainPage/index.js');
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});