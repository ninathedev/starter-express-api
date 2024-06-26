/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import express from 'express';
import mysql from 'mysql';
import geoip from 'geoip-lite';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import rateLimit from 'express-rate-limit';
import requestIp from 'request-ip';
const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(requestIp.mw());
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({extended: true}));
app.set('trust proxy', true)
let clients = [];
let updates = [];

app.get('/', (req, res) => {
	res.sendFile('./public/mainPage/index.html', {root: __dirname});
});

app.get('/favicon.ico', (req, res) => {
	res.sendFile('./favicon.ico', {root: __dirname});
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
app.get('/scripts/pindex.js', (req, res) => {
	res.sendFile('./scripts/pindex.js', {root: __dirname});
});
app.get('/scripts/pmindex.js', (req, res) => {
	res.sendFile('./scripts/pmindex.js', {root: __dirname});
});
app.get('/scripts/ptindex.js', (req, res) => {
	res.sendFile('./scripts/ptindex.js', {root: __dirname});
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
			con.end();
		});
	});
});

app.put('/transact', (req, res) => {
	if (!req.body.from || !req.body.to || !req.body.amount) {
		res.status(400).send('No ID provided');
		return;
	}
	if (req.body.amount === 0 || !req.body.amount) {
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
		con.query(`UPDATE money SET money = money + ${req.body.amount} WHERE id = ${req.body.to};`, function(err, result) {
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
			con.end();
		});
	});
	axios.post(process.env.WHTRANS, {
		embeds: [{
			title: `Transaction from ${req.body.from} to ${req.body.to}`,
			description: `Amount: ${req.body.amount}`,
			color: 0xFF0000
		}]
	});
});

app.get('/FAQ', (req, res) => {
	res.sendFile('./public/FAQ/index.html', {root: __dirname});
});

app.put('/insal', (req, res) => {
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
				console.log(err);
				res.status(500).send(err);
				return;
			}
			res.status(206).send(result);
			con.end();
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
			con.end();
		});
	});
});

app.get(`/${process.env.ADMIN_PIN}/admin`, (req, res) => {
	axios.post(process.env.WHADMIN, {
		embeds: [{
			title: 'Admin accessed',
			// @ts-ignore
			description: `Admin has been accessed by a user. IP: ${req.clientIp} Location: 
\`\`\`json
${// @ts-ignore
	JSON.stringify(geoip.lookup(req.clientIp), null, 2)}
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
		con.query(sql, async function(err, result) {
			if (err) res.status(500).send(err);
			res.status(206).send(result);
			con.end();
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
	if (req.body.fHeusGF === process.env.ADMIN_ID && req.body.hDjeRfg === process.env.ADMIN_PIN) {
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

		con.query(sql, async (err, result) => {
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
					// @ts-ignore
					description: `User: ${req.body.fHeusGF} logged in. IP: ${req.clientIp} Location: 
\`\`\`json
${// @ts-ignore
	JSON.stringify(geoip.lookup(req.clientIp), null, 2)}
\`\`\``,
					color: 0x00FF00
				}]
			});
			con.end();
		});
	});

	
});

app.get('/404', (req, res) => {
	res.sendFile('./public/404/index.html', {root: __dirname});
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
			con.end();
		});
	});
});

const list = [{
	// 2017/2022 initial
	fKdjsleW: ['#FFFFFF', '#E4E4E4', '#888888', '#222222', '#FFA7D1', '#E50000', '#E59500', '#A06A42', '#E5D900', '#94E044', '#02BE01', '#00D3DD', '#0083C7', '#0000EA', '#CF6EE4', '#820080']
}, {
	// 2022 day 2
	fKdjsleW: ['#BE0039', '#FF4500', '#FFA800', '#FFD635', '#00A368', '#00CC78', '#7EED56', '#00756F', '#009EAA', '#2450A4', '#3690EA', '#51E9F4', '#493AC1', '#6A5CFF', '#811E9F', '#B44AC0', '#FF3881', '#FF99AA', '#6D482F', '#9C6926', '#000000', '#898D90', '#D4D7D9', '#FFFFFF']
}, {
	// 2022 day 3
	fKdjsleW: ['#6D001A', '#BE0039', '#FF4500', '#FFA800', '#FFD635', '#FFF8B8', '#00A368', '#00CC78', '#7EED56', '#00756F', '#009EAA', '#00CCC0', '#2450A4', '#3690EA', '#51E9F4', '#493AC1', '#6A5CFF', '#94B3FF', '#811E9F', '#B44AC0', '#E4ABFF', '#DE107F', '#FF3881', '#FF99AA', '#6D482F', '#9C6926', '#FFB470', '#000000', '#515252', '#898D90', '#D4D7D9', '#FFFFFF']
}, {
	// 2023 Greyout
	fKdjsleW: ['#000000', '#515252', '#898D90', '#D4D7D9', '#FFFFFF']
}, {
	// 2022/2023 Whiteout
	fKdjsleW: ['#FFFFFF']
}];

const currentPalette = 0;

function rgbToHex(r, g, b) {
	const hex = ((r << 16) | (g << 8) | b).toString(16).toUpperCase();
	return '#' + hex.padStart(6, '0');
}

app.get('/111710/place', (req, res) => {
	res.sendFile('./public/placeMod/index.html', {root: __dirname});
});

import { isVpn } from './mod.js';

app.get('/place', (req, res) => {
	// @ts-ignore
	if (isVpn(req.clientIp)) {
		res.status(403).send('VPN detected');
		return;
	}
	res.sendFile('./public/place/index.html', {root: __dirname});
});

const limiter = rateLimit({
	windowMs: (60 * 1000) - 1, // 1 minute window
	max: 10, // limit each IP to 10 requests per windowMs
	message: 'Too many requests from this IP, please try again later',
	// stops the error about trust proxy and stuff
	validate: {trustProxy: false},
	// if there is no IP, use the remote address.
	// but if there is an IP, remove the port number
	keyGenerator(request, _response): string {
		if (!request.ip) {
			console.error('Warning: request.ip is missing!')
			return request.socket.remoteAddress
		}
		return request.ip.replace(/:\d+[^:]*$/, '')
	}
});

// Apply rate limiter to all requests
app.use('/place/jsKeLwo', limiter);

app.get('/place/dLepaWoe', (req, res) => {
	res.send(list[currentPalette]);
});

app.get('/place/lsOwtDS', (req, res) => {
	const headers = {
		'Content-Type': 'text/event-stream',
		'Connection': 'keep-alive',
		'Cache-Control': 'no-cache'
	};
	res.writeHead(200, headers);

	const clientId = Date.now();

	const newClient = {
		id: clientId,
		res
	};

	clients.push(newClient);

	res.write(`data: ${JSON.stringify(updates)}\n\n`);

	res.on('close', () => {
		clients = clients.filter(client => client.id !== clientId);
	});
});

app.get('/place/starting', (req, res) => {
	const con = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});

	const sql = 'SELECT * FROM place_starting;';

	con.query(sql, (err, result) => {
		if (err) {
			res.status(500);
		} else {
			res.send(result);
		}
		con.end();
	});
});

app.get('/place/vid', (req, res) => {
	res.sendFile('./public/placeTimelapse/index.html', {root: __dirname});
});

app.get('/place/timelapse', (req, res) => {
	const con = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});

	const sql = 'SELECT * FROM place_timelapse;';

	con.query(sql, (err, result) => {
		if (err) {
			res.status(500);
		} else {
			console.log(result);
			res.send(result);
		}
		con.end();
	});
});

function sendEventsToAll(newPixel) {
	clients.forEach(client => client.res.write(`data: ${JSON.stringify(newPixel)}\n\n`));
}

let timers = {};

app.patch('/place/jsKeLwo', (req, res) => {
	// @ts-ignore
	let clientIP = req.clientIp;
	if (timers[clientIP]) {
		// Check if timer is still running
		if (timers[clientIP] > Date.now()) {
			res.status(401);
			return;
		} else {
			// If timer has expired, delete the timer entry
			delete timers[clientIP];
		}
	}

	if (!list[currentPalette].fKdjsleW.includes(rgbToHex(req.body.r, req.body.g, req.body.b))) {
		res.status(403).send('Invalid color');
		return;
	}

	const con = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});

	const sql = `UPDATE place SET r = ${req.body.r}, g = ${req.body.g}, b = ${req.body.b} WHERE x = ${req.body.x} AND y = ${req.body.y};`;

	con.query(sql, (err, result) => {
		if (err) {
			res.status(500);
			return;
		}
		updates.push(req.body);
		sendEventsToAll(req.body);
		res.status(204);
		con.end();
	});

	
	// Store the end time of the client-side timer
	timers[`${clientIP}`] = Date.now() + 60000; // End time in milliseconds

	// make another request to the mysql server to log the action
	const con2 = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});

	con2.connect(function(err) {
		if (err) throw err;
		const sql = `INSERT INTO place_logs (x, y, r, g, b, time) VALUES (${req.body.x}, ${req.body.y}, ${req.body.r}, ${req.body.g}, ${req.body.b}, '${Date.now()}');`;
		con2.query(sql, function(err, result) {
			if (err) {
				console.log(err);
				return;
			}
			con2.end();
		});
	});
});

app.patch('/place/111710/jsKeLwo', (req, res) => {
	if (req.headers['x-forwarded-to'] !== process.env.PLACE_TOKEN) {
		res.status(403);
		return;
	}

	const pixelDataArray = req.body;

	const con = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});

	con.connect();

	// Use Promise.all to asynchronously execute all SQL queries for each pixel data
	Promise.all(pixelDataArray.map(pixelData => {
		const { x, y, r, g, b } = pixelData;
		const sql = `UPDATE place SET r = ${r}, g = ${g}, b = ${b} WHERE x = ${x} AND y = ${y}`;
		return new Promise((resolve, reject) => {
			con.query(sql, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	})).then(results => {
		con.end(); // Close database connection
		updates.push(...pixelDataArray); // Push all pixel data to the updates array
		sendEventsToAll(pixelDataArray); // Send events to all clients
		res.status(204).end(); // Send 204 status code indicating success
		// make another request to the mysql server to log the action
		const con2 = mysql.createConnection({
			host: process.env.MYSQLIP,
			user: process.env.MYSQLUSER,
			password: process.env.MYSQLPW,
			database: process.env.MYSQLDB
		});

		con2.connect(function(err) {
			if (err) throw err;
			const sql = `INSERT INTO place_logs (x, y, r, g, b, time) VALUES (${req.body.x}, ${req.body.y}, ${req.body.r}, ${req.body.g}, ${req.body.b}, '${Date.now()}');`;
			con2.query(sql, function(err, result) {
				if (err) {
					console.log(err);
					return;
				}
				con2.end();
			});
		});
	}).catch(error => {
		console.error('Error updating pixels:', error);
		con.end(); // Close database connection
		res.status(500).send('Internal Server Error');
	});
});


app.get('/place/ldOWirDFk', (req, res) => {
	// @ts-ignore
	const clientIP = req.clientIp;
	const endTime = timers[`${clientIP}`];
	const remainingTime = Math.floor((endTime - Date.now()) / 1000); // Calculate remaining time
	remainingTime <= 0 ? 0 : remainingTime;
	res.send({ dKAlwoD: remainingTime });
});



app.get('/place/dWkdsSoa', (req, res) => {
	const con = mysql.createConnection({
		host: process.env.MYSQLIP,
		user: process.env.MYSQLUSER,
		password: process.env.MYSQLPW,
		database: process.env.MYSQLDB
	});

	const sql = 'SELECT * FROM place;';

	con.query(sql, (err, result) => {
		if (err) {
			res.status(500);
		} else {
			res.send(result);
		}
		con.end();
	});
});

// Handle 404
app.use(function(req, res) {
	res.status(404).sendFile('./public/404/index.html', {root: __dirname});
});

app.listen(8080, () => {
	console.log('Server is running on port 8080');
});