/* eslint-disable no-unused-vars */
async function getMysql(url = '', data = {}) {
	const response = await fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(data),
	});
	return response.json(); // Parses JSON response into native JavaScript objects
}

function sendMySQL() {
	const sql = document.getElementsByName('cmd')[0].value;
	getMysql('/mysql', {sql: sql}).then((data) => {
		document.getElementById('mysqlResponse').innerHTML = JSON.stringify(data);
	});
}

async function getAccounts() {
	const response = await fetch('/accounts', {
		method: 'GET',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer'
	});

	return response.json();
}

async function getMoney() {
	const response = await fetch('/money', {
		method: 'GET',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer'
	});

	return response.json();
}