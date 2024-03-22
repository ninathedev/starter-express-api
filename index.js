
const express = require('express');
const app = express();
const mysql = require('mysql');

app.get('/', (req, res) => {
    res.sendFile('./public/mainPage/index.html', { root: __dirname });
});

app.get('/scripts/mindex.js', (req, res) => {
    res.sendFile('./scripts/mindex.js', { root: __dirname });
});
app.get('/scripts/aindex.js', (req, res) => {
    res.sendFile('./scripts/aindex.js', { root: __dirname });
});

app.get('/dashboard', (req, res) => {
    // If person is in admin mode
    if (req.body.fHeusGF === 'TUFDSElDQQ==VEFGQUxMQQ==' && req.body.hDjeRfg === '111710') {
        res.sendFile('./public/admin/index.html', { root: __dirname });
    } else {
        const con = mysql.createConnection({
            host: 'emerald-free.falixserver.net:3306',
            user: 'u1332246_4Ign2Pc0qA',
            password: '4fcSn+h8ZL71lLSdHT8d^5H+',
            database: 's1332246_27f8817bffaf'
        });
        con.connect(function(err) {
            if (err) throw err;
            // For secrurity purposes, we use randomized variable names.
            // id = ${fHeusGF}
            // pin = ${hDjeRfg}
            var sql = `SELECT * FROM accounts WHERE id = ${req.body.fHeusGF} AND pin = ${req.body.hDjeRfg}`;
    
            con.query(sql, function (err, result) {
                if (result === undefined) {
                    app.send("Invalid ID or PIN")
                }
                if (err) app.send(err);
                app.send("done")
            });
        });
    }
})

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

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});


