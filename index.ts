/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import express, { Application } from 'express';
const app: Application = express();
import mysql from 'mysql';
import geoip from 'geoip-lite';
import path from 'path';
import { Request, Response } from 'express';

const __dirname: string = path.resolve();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.sendFile('./public/mainPage/index.html', {root: __dirname});
});

app.get('/scripts/mindex.js', (req: Request, res: Response) => {
	res.sendFile('./scripts/mindex.js', {root: __dirname});
});
app.get('/scripts/aindex.js', (req: Request, res: Response) => {
	res.sendFile('./scripts/aindex.js', {root: __dirname});
});
app.get('/scripts/dindex.js', (req: Request, res: Response) => {
	res.sendFile('./scripts/dindex.js', {root: __dirname});
});

app.get('/money', (req: Request, res: Response) => {
	const con: mysql.Connection = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});

	con.connect((err: Error) => {
		if (err) throw err;
		const sql: String = 'SELECT * FROM money;';
		con.query(sql, (err: Error, result: Array<JSON>) => {
			if (err) res.status(500).send(err);
			res.status(200).send(result);
		});
	});
});

app.put('/transact', (req: Request, res: Response) => {
	if (!req.body.from || !req.body.to || !req.body.amount) {
		res.status(400).send('No ID provided');
		return;
	}
	if (req.body.amount === 0 || !req.body.amount) {
		res.status(400).send('No amount given');
		return;
	}
	const con: mysql.Connection = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});
	con.connect(function(err: Error) {
		if (err) throw err;
		con.query(`UPDATE money SET money = money + ${req.body.amount} WHERE id = ${req.body.to};`, (err: Error, result: Array<JSON>) => {
			if (err) {
				console.log(err);
				res.status(500).send(err);
				return;
			}
			res.status(204);
		});
		con.query(`UPDATE money SET money = money - ${req.body.amount} WHERE id = ${req.body.from};`, function(err, result) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
				return;
			}
			res.status(204);
		});
	});
	axios.post('https://discord.com/api/webhooks/1223843361627181136/qAuiq7tLEaIjeoCJIXQ3WRImZw-A-w1AQ2eVpDBEAkQXd0O-8bi5VtEd1gcybdGebiGB', {
		embeds: [{
			title: `Transaction from ${req.body.from} to ${req.body.to}`,
			description: `Amount: ${req.body.amount}`,
			color: 0xFF0000
		}]
	});
});

app.get('/FAQ', (req: Request, res: Response) => {
	res.sendFile('./public/FAQ/index.html', {root: __dirname});
});

app.put('/insal', (req: Request, res: Response) => {
	if (!req.body.id || !req.body.salary) {
		res.status(400).send('No ID provided');
		return;
	}
	if (req.body.salary === 0 || !req.body.salary) {
		res.status(400).send('No amount given');
		return;
	}
	const con: mysql.Connection = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});
	con.connect((err: Error) => {
		if (err) throw err;
		const sql: String = `UPDATE money SET money = money + ${req.body.salary} WHERE id = ${req.body.id}`;
		con.query(sql, (err: Error, result: Array<JSON>) => {
			if (err) {
				console.log(err);
				res.status(500).send(err);
				return;
			}
			res.status(206).send(result);
			if (req.body.salary > 0) {
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
						description: `Tax: ${Math.abs(req.body.salary)}`,
						color: 0xFF0000
					}]
				});
			}
		});
	});
});

app.get('/accounts', (req: Request, res: Response) => {
	const con: mysql.Connection = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});

	con.connect((err: Error) => {
		if (err) throw err;
		const sql: String = 'SELECT * FROM accounts;';
		con.query(sql, (err: Error, result: Array<JSON>) => {
			if (err) res.status(500).send(err);
			res.status(200).send(result);
		});
	});
});

app.get(`/${process.env.ADMIN_PIN}/admin`, (req: Request, res: Response) => {
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

app.get('/dashboard', (req: Request, res: Response) => {
	res.sendFile('./public/dashboard/index.html', {root: __dirname});
});

app.put('/tax', (req: Request, res: Response) => {
	if (req.body.tax === 0 || !req.body.tax) {
		res.status(400).send('No amount given');
		return;
	} 
	const con: mysql.Connection = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});

	con.connect((err: Error) => {
		if (err) throw err;
		const sql: String = `UPDATE money SET money = money - ${req.body.tax}`;
		con.query(sql, (err: Error, result: Array<JSON>) => {
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

app.post('/login', (req: Request, res: Response) => {
	if (!req.body.fHeusGF && !req.body.hDjeRfg) res.status(404).send('No credientials provided');
	if (req.body.fHeusGF === process.env.ADMIN_ID && req.body.hDjeRfg === process.env.ADMIN_PIN) {
		res.status(301);
		return;
	}
	const con: mysql.Connection = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});
	con.connect((err: Error) => {
		if (err) throw err;
		const sql: String = `SELECT * FROM accounts WHERE id = ${req.body.fHeusGF} AND pin = ${req.body.hDjeRfg};`;

		con.query(sql, (err: Error, result: Array<JSON>) => {
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

app.get('/404', (req: Request, res: Response) => {
	res.sendFile('./public/404/index.html', {root: __dirname});
});

app.post('/mysql', (req: Request, res: Response) => {
	let loginMode: Boolean = false;
	if (!req.body.sql) {
		res.status(400).send('No SQL query provided');
		return;
	} else if (req.body.login) {
		loginMode = true;
	}
	const con: mysql.Connection = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});
	con.connect((err: Error) => {
		if (err) console.log(err);
		const sql: String = req.body.sql;
		con.query(sql, (err: Error, result: Array<JSON>) => {
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
app.use(function(req: Request, res: Response) {
	res.status(404).sendFile('./public/404/index.html', {root: __dirname});
});

app.listen(8080, () => {
	console.log('Server is running on port 8080');
});