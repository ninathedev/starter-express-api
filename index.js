/* eslint-disable no-unused-vars */

require('dotenv').config();

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
app.get('/scripts/dindex.js', (req, res) => {
	res.sendFile('./scripts/dindex.js', {root: __dirname});
});

app.get('/money', (req, res) => {
	const con = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});

	con.connect(function(err) {
		if (err) throw err;
		const sql = 'SELECT * FROM money;';
		con.query(sql, function(err, result) {
			if (err) res.status(500).send(err);
			res.status(200).send(result);
		});
	});
});

app.get('/accounts', (req, res) => {
	const con = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});

	con.connect(function(err) {
		if (err) throw err;
		const sql = 'SELECT * FROM accounts;';
		con.query(sql, function(err, result) {
			if (err) res.status(500).send(err);
			res.status(200).send(result);
		});
	});
});

app.get('/fKsHeuD/admin', (req, res) => {
	res.sendFile('./public/admin/index.html', {root: __dirname});
});

app.put('/salary', (req, res) => {
	const con = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});

	con.connect(function(err) {
		if (err) throw err;
		const sql = `UPDATE money SET money = money + ${req.body.salary} WHERE id=${req.body.id};`;
		con.query(sql, function(err, result) {
			if (err) res.status(500).send(err);
			res.status(206).send(result);
		});
	});
});

app.get('/dashboard', (req, res) => {
	res.sendFile('./public/dashboard/index.html', {root: __dirname});
});

app.put('/tax', (req, res) => {
	const con = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});

	con.connect(function(err) {
		if (err) throw err;
		const sql = `UPDATE money SET money = money - ${req.body.tax} WHERE money IS NOT NULL;`;
		con.query(sql, function(err, result) {
			if (err) res.status(500).send(err);
			res.status(206).send(result);
		});
	});
});

app.post('/login', (req, res) => {
	if (!req.body.fHeusGF && !req.body.hDjeRfg) res.status(404).send('No credientials provided');

	// If person is in admin mode
	if (req.body.fHeusGF === 'TUFDSElDQQ==VEFGQUxMQQ==' && req.body.hDjeRfg === '111710') {
		res.status(301);
	} else {
		const con = mysql.createConnection({
			host: process.env.MYSQLIP,
			user: process.env.MYSQLUSER,
			password: process.env.MYSQLPW,
			database: process.env.MYSQLDB
		});
		con.connect(function(err) {
			if (err) throw err;
			// For secrurity purposes, we use randomized variable names.
			// id = ${fHeusGF}
			// pin = ${hDjeRfg}
			const sql = `SELECT * FROM accounts WHERE id = ${req.body.fHeusGF} AND pin = ${req.body.hDjeRfg}`;

			con.query(sql, function(err, result) {
				if (!result) {
					res.status(404);
				}
				if (err) {
					res.send(err);
					console.log(err);
				}

				res.status(200); // We do not want to redirect because the client will do that.
			});
		});
	}
});

app.get('/404', (req, res) => {
	res.sendFile('./public/404/index.html', {root: __dirname});
});

app.get('/500', (req, res) => {
	res.sendFile('./public/500/index.html', {root: __dirname});
});

app.post('/mysql', (req, res) => {
	const con = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});
	con.connect(function(err) {
		if (err) console.log(err);
		const sql = req.body.sql;
		con.query(sql, function(err, result) {
			if (err) res.status(500).send(err);
			res.send(result);
		});
	});
});



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