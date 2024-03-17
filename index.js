// accid: TUFDSElDQQ==
// pin:   VEFGQUxMQQ==

const express = require('express');
const app = express();
const mysql = require('mysql');

app.get('/', (req, res) => {
    res.sendFile('./public/mainPage/index.html', { root: __dirname });
});

app.get('/login', (req, res) => {
    if (req.body.fHeusGF === 'TUFDSElDQQ==') {

    }
    const con = mysql.createConnection({
        host: 'emerald-free.falixserver.net:3306',
        user: 'u1332246_4Ign2Pc0qA',
        password: '4fcSn+h8ZL71lLSdHT8d^5H+',
        database: 's1332246_27f8817bffaf'
    });
    con.connect(function(err) {
        if (err) throw err;
        // id = ${fHeusGF}
        // pin = ${hDjeRfg}
        var sql = ``;

        con.query(sql, function (err, result) {
            if (err) app.send(err);
            app.send("done")
        });
    });


})

app.post('/surequest', (req, res) => {
    const con = mysql.createConnection({
        host: 'emerald-free.falixserver.net:3306',
        user: 'u1332246_4Ign2Pc0qA',
        password: '4fcSn+h8ZL71lLSdHT8d^5H+',
        database: 's1332246_27f8817bffaf'
    });
    con.connect(function(err) {
        if (err) throw err;
        var sql = `INSERT INTO signupRequest (name, age, code) VALUES (${req.body.LkaPrehH}, ${req.body.DHrEjfF}, ${req.body.code})`;

        con.query(sql, function (err, result) {
            if (err) app.send(err);
            app.send("done")
        });
    });
});

app.get('/secrets/secret/accounts' , (req, res) => {
    const con = mysql.createConnection({
        host: 'emerald-free.falixserver.net:3306',
        user: 'u1332246_4Ign2Pc0qA',
        password: '4fcSn+h8ZL71lLSdHT8d^5H+',
        database: 's1332246_27f8817bffaf'
    });
    con.connect(function(err) {
        if (err) throw err;
        var sql = `SELECT * FROM signupRequest`;

        con.query(sql, function (err, result) {
            if (err) app.send(err);
            app.send(result)
        });
    });
})

app.post('/mysql', (req, res) => {
    const con = mysql.createConnection({
        host: 'emerald-free.falixserver.net:3306',
        user: 'u1332246_4Ign2Pc0qA',
        password: '4fcSn+h8ZL71lLSdHT8d^5H+',
        database: 's1332246_27f8817bffaf'
    });
    con.connect(function(err) {
        if (err) throw err;
        var sql = req.body.sql;
        con.query(sql, function (err, result) {
            if (err) app.send(err);
            app.send(result);
        });
    });
})

app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", 'http://127.0.0.1:8080', 'ws://localhost:42877/']
      }
    }
}));

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});


