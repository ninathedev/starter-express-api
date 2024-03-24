const express = require('express');
const app = express();
const mysql = require('mysql');

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile('./public/mainPage/index.html', {root: __dirname});
});

app.get('/scripts/mindex.js', (req, res) => {
  res.sendFile('./scripts/mindex.js', {root: __dirname});
});
app.get('/scripts/aindex.js', (req, res) => {
  res.sendFile('./scripts/aindex.js', {root: __dirname});
});

app.get('/dashboard', (req, res) => {
  // If person is in admin mode
  if (req.body.fHeusGF === 'TUFDSElDQQ==VEFGQUxMQQ==' && req.body.hDjeRfg === '111710') {
    res.sendFile('./public/admin/index.html', {root: __dirname});
  } else {
    const con = mysql.createConnection({
      host: '104.234.220.50',
      user: 'u1332246_4Ign2Pc0qA',
      password: '4fcSn+h8ZL71lLSdHT8d^5H+',
      database: 's1332246_27f8817bffaf'
    });
    con.connect(function(err) {
      if (err) throw err;
      // For secrurity purposes, we use randomized variable names.
      // id = ${fHeusGF}
      // pin = ${hDjeRfg}
      const sql = `SELECT * FROM accounts WHERE id = ${req.body.fHeusGF} AND pin = ${req.body.hDjeRfg}`;

      con.query(sql, function(err, result) {
        if (result[0] === undefined) {
          res.send("Invalid ID or PIN")
        }
        if (err) app.send(err);
        res.send("done")
      });
    });
  }
})

app.get('/secrets/secret/accounts', (req, res) => {
  const con = mysql.createConnection({
    host: '104.234.220.50',
    user: 'u1332246_4Ign2Pc0qA',
    password: '4fcSn+h8ZL71lLSdHT8d^5H+',
    database: 's1332246_27f8817bffaf'
  });
  con.connect(function(err) {
    if (err) throw err;
    const sql = `SELECT * FROM accounts`;

    con.query(sql, function(err, result) {
      if (err) app.send(err);
      res.send(result)
    });
  });
})

app.post('/mysql', (req, res) => {
  const con = mysql.createConnection({
    host: '104.234.220.50',
    user: 'u1332246_4Ign2Pc0qA',
    password: '4fcSn+h8ZL71lLSdHT8d^5H+',
    database: 's1332246_27f8817bffaf'
  });
  con.connect(function(err) {
    if (err) console.log(err);
    const sql = req.body.sql;
    con.query(sql, function(err, result) {
      if (err) res.status(500).send(err);
      res.send(result);
    });
  });
})
// Handle 404
app.use(function(req, res) {
  res.status(404).sendFile('./public/404/index.html', {root: __dirname});
});

// Handle 500
app.use(function(error, req, res, next) {
  res.status(500).sendFile('./public/500/index.html', {root: __dirname});
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});