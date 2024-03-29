/* eslint-disable no-unused-vars */
require('dotenv').config();

const axios = require('axios');

const express = require('express');
const app = express();
const mysql = require('mysql');

const geoip = require('geoip-lite');

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

app.put('/indsal', (req, res) => {
	if (!req.body.id || !req.body.salary) {
		res.status(400).send('No ID provided');
		return;
	}
	if (req.body.salary === 0 || !req.body.salary) {
		res.status(400).send('No amount given');
		return;
	}
	const con = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});
	con.connect(function(err) {
		if (err) throw err;
		const sql = `UPDATE money SET money = money + ${req.body.salary} WHERE id = ${req.body.id}`;
		con.query(sql, function(err, result) {
			if (err) {
				res.status(500).send(err);
				return;
			}
			res.status(206).send(result);
			if (req.body.salary < 0) {
				axios.post(process.env.WHSAL, {
					embeds: [{
						title: `Salary given to ${req.body.id}`,
						description: `Salary: ${Math.abs(req.body.salary)}`,
						color: 0x00FF00
					}]
				});
			} else {
				axios.post(process.env.WHSAL, {
					embeds: [{
						title: `Tax paid by ${req.body.id}`,
						description: `Tax: ${req.body.salary*-1}`,
						color: 0xFF0000
					}]
				});
			}
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

app.get('/111710/admin', (req, res) => {
	axios.post(process.env.WHADMIN, {
		embeds: [{
			title: 'Admin accessed',
			description: `Admin has been accessed by a user. IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress} Location: 
\`\`\`json
${JSON.stringify(geoip.lookup(req.headers['x-forwarded-for'] || req.socket.remoteAddress), null, 2)}
\`\`\``,
			color: 0x00FF00
		}]
	});
	res.sendFile('./public/admin/index.html', {root: __dirname});
});

app.get('/dashboard', (req, res) => {
	res.sendFile('./public/dashboard/index.html', {root: __dirname});
});

app.put('/tax', (req, res) => {
	if (req.body.tax === 0 || !req.body.tax) {
		res.status(400).send('No amount given');
		return;
	} 
	const con = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});

	con.connect(function(err) {
		if (err) throw err;
		const sql = `UPDATE money SET money = money - ${req.body.tax}`;
		con.query(sql, function(err, result) {
			if (err) res.status(500).send(err);
			res.status(206).send(result);
			if (req.body.tax < 0) {
				axios.post(process.env.WHSAL, {
					embeds: [{
						title: 'Salary given',
						description: `Salary: ${Math.abs(req.body.tax)}`,
						color: 0x00FF00
					}]
				});
			} else {
				axios.post(process.env.WHSAL, {
					embeds: [{
						title: 'Tax paid',
						description: `Tax: ${req.body.tax}`,
						color: 0xFF0000
					}]
				});
			}
		});
	});
});

app.post('/login', (req, res) => {
	if (!req.body.fHeusGF && !req.body.hDjeRfg) res.status(404).send('No credientials provided');
	if (req.body.fHeusGF === 'TUFDSElDQQ==VEFGQUxMQQ==' && req.body.hDjeRfg === '111710') {
		res.status(301);
		return;
	}
	const con = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});
	con.connect(function(err) {
		if (err) throw err;
		const sql = `SELECT * FROM accounts WHERE id = ${req.body.fHeusGF} AND pin = ${req.body.hDjeRfg};`;

		con.query(sql, (err, result) => {
			if (result.length === 0) {
				res.status(404);
				axios.post(process.env.WHLOGIN, {
					embeds: [{
						title: 'Failed login',
						description: `ID: ${req.body.fHeusGF}
PIN: ${req.body.hDjeRfg}`,
						color: 0xFF0000
					}]
				});
				return;
			}
			if (err) {
				res.status(500).send(err);
				console.log(err);
				return;
			}
			res.status(200);
			axios.post(process.env.WHLOGIN, {
				embeds: [{
					title: 'User logged in',
					description: `User: ${req.body.fHeusGF} logged in. IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress} Location: 
\`\`\`json
${JSON.stringify(geoip.lookup(req.headers['x-forwarded-for'] || req.socket.remoteAddress), null, 2)}
\`\`\``,
					color: 0x00FF00
				}]
			});
		});
	});

	
});

app.get('/404', (req, res) => {
	res.sendFile('./public/404/index.html', {root: __dirname});
});

app.get('/500', (req, res) => {
	res.sendFile('./public/500/index.html', {root: __dirname});
});

app.post('/mysql', (req, res) => {
	let loginMode = false;
	if (!req.body.sql) {
		res.status(400).send('No SQL query provided');
		return;
	} else if (req.body.login) {
		loginMode = true;
	}
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
			if (err) {
				if (!loginMode) {
					axios.post(process.env.WHMYSQL, {
						embeds: [{
							title: 'Failed MySQL query',
							description: `Query: \`${req.body.sql}\`
		Result: \`${err||JSON.stringify(result)}\``,
							color: 0xFFFF00
						}]
					});
					res.status(500).send(err);
					return;
				} else {
					axios.post(process.env.WHLOGIN, {
						embeds: [{
							title: 'Failed login',
							description: `Query: \`${req.body.sql}\`
		Result: \`${err||JSON.stringify(result)}\``,
							color: 0xFFFF00
						}]
					});
					res.status(500).send(err);
					return;
				}
			}

			if (!loginMode) {
				axios.post(process.env.WHMYSQL, {
					embeds: [{
						title: 'MySQL query executed',
						description: `Query: \`${req.body.sql}\`
	Result: \`${JSON.stringify(result)}\``,
						color: 0x0000FF
					}]
				});
			} else {
				axios.post(process.env.WHLOGIN, {
					embeds: [{
						title: 'Login query executed',
						description: `Query: \`${req.body.sql}\`
	Result: \`${JSON.stringify(result)}\``,
						color: 0x0000FF
					}]
				});
			}
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
	res.status(500).send({message: error.message});
});

app.listen(8080, () => {
	console.log('Server is running on port 8080');
});