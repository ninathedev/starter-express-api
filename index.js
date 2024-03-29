const axios = require('axios');
const express = require('express');
const mysql = require('mysql');
const geoip = require('geoip-lite');

require('dotenv').config();

const app = express();

app.use(express.json());

const con = mysql.createConnection({
	host: process.env.MYSQLIP,
	user: process.env.MYSQLUSER,
	password: process.env.MYSQLPW,
	database: process.env.MYSQLDB
});

con.connect(function(err) {
	if (err) throw err;
	console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
	res.sendFile('public/mainPage/index.html', { root: __dirname });
});

app.get('/scripts/:scriptName', (req, res) => {
	const scriptName = req.params.scriptName;
	res.sendFile(`scripts/${scriptName}`, { root: __dirname });
});

app.get('/money', (req, res) => {
	const sql = 'SELECT * FROM money;';
	con.query(sql, function(err, result) {
		if (err) res.status(500).send(err);
		res.status(200).send(result);
	});
});

app.get('/accounts', (req, res) => {
	const sql = 'SELECT * FROM accounts;';
	con.query(sql, function(err, result) {
		if (err) res.status(500).send(err);
		res.status(200).send(result);
	});
});

app.get('/111710/admin', (req, res) => {
	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	const location = JSON.stringify(geoip.lookup(ip), null, 2);
	axios.post(process.env.WHADMIN, {
		embeds: [{
			title: 'Admin accessed',
			description: `Admin has been accessed by a user. IP: ${ip} Location: \n\`\`\`json\n${location}\n\`\`\``,
			color: 0x00FF00
		}]
	});
	res.sendFile('public/admin/index.html', { root: __dirname });
});

app.get('/dashboard', (req, res) => {
	res.sendFile('public/dashboard/index.html', { root: __dirname });
});

app.put('/tax', (req, res) => {
	const tax = req.body.tax;
	if (tax < 0) {
		axios.post(process.env.WHSAL, {
			embeds: [{
				title: 'Salary given',
				description: `Salary: ${Math.abs(tax)}`,
				color: 0x00FF00
			}]
		});
	} else if (tax === 0 || !tax) {
		res.status(400).send('No amount given');
		return;
	} else {
		axios.post(process.env.WHSAL, {
			embeds: [{
				title: 'Tax paid',
				description: `Tax: ${tax}`,
				color: 0xFF0000
			}]
		});
	}
	const sql = `UPDATE money SET money = money - ${tax}`;
	con.query(sql, function(err, result) {
		if (err) res.status(500).send(err);
		res.status(206).send(result);
	});
});

app.post('/login', (req, res) => {
	const fHeusGF = req.body.fHeusGF;
	const hDjeRfg = req.body.hDjeRfg;
	if (!fHeusGF && !hDjeRfg) {
		res.status(404).send('No credentials provided');
		return;
	}
	if (fHeusGF === 'TUFDSElDQQ==VEFGQUxMQQ==' && hDjeRfg === '111710') {
		res.status(301);
		return;
	}
	const sql = `SELECT * FROM accounts WHERE id = ${fHeusGF} AND pin = ${hDjeRfg};`;
	con.query(sql, (err, result) => {
		if (result.length === 0) {
			res.status(404);
			axios.post(process.env.WHLOGIN, {
				embeds: [{
					title: 'Failed login',
					description: `ID: ${fHeusGF}\nPIN: ${hDjeRfg}`,
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
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		const location = JSON.stringify(geoip.lookup(ip), null, 2);
		axios.post(process.env.WHLOGIN, {
			embeds: [{
				title: 'User logged in',
				description: `User: ${fHeusGF} logged in. IP: ${ip} Location: \n\`\`\`json\n${location}\n\`\`\``,
				color: 0x00FF00
			}]
		});
	});
});

app.get('/404', (req, res) => {
	res.sendFile('public/404/index.html', { root: __dirname });
});

app.get('/500', (req, res) => {
	res.sendFile('public/500/index.html', { root: __dirname });
});

app.post('/mysql', (req, res) => {
	const sql = req.body.sql;
	const loginMode = req.body.login || false;
	if (!sql) {
		res.status(400).send('No SQL query provided');
		return;
	}
	con.query(sql, function(err, result) {
		if (err) {
			const webhook = loginMode ? process.env.WHLOGIN : process.env.WHMYSQL;
			axios.post(webhook, {
				embeds: [{
					title: 'Failed MySQL query',
					description: `Query: \`${sql}\`\nResult: \`${err || JSON.stringify(result)}\``,
					color: 0xFFFF00
				}]
			});
			res.status(500).send(err);
			return;
		}
		const webhook = loginMode ? process.env.WHLOGIN : process.env.WHMYSQL;
		axios.post(webhook, {
			embeds: [{
				title: 'MySQL query executed',
				description: `Query: \`${sql}\`\nResult: \`${JSON.stringify(result)}\``,
				color: 0x0000FF
			}]
		});
		res.send(result);
	});
});

// Handle 404
app.use(function(req, res) {
	res.status(404).sendFile('public/404/index.html', { root: __dirname });
});

// Handle 500
// eslint-disable-next-line no-unused-vars
app.use(function(error, req, res, next) {
	res.status(500).send({ message: error.message });
});

const port = 8080;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
