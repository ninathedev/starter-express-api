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

function how() {
	window.location.href = 'https://www.w3schools.com/mysql/mysql_sql.asp';
}

function sendMySQL() {
	const sql = document.getElementsByName('cmd')[0].value;
	getMysql('/mysql', {sql: sql}).then((data) => {
		const datajson = {response: data};
		document.getElementById('mysqlResponse').innerHTML = JSON.stringify(datajson, null, 2);
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

document.addEventListener('DOMContentLoaded', () => {
	const accElement = document.getElementById('acc');
	const statElement = document.getElementById('stat');

	if (accElement && statElement) {
		getAccounts().then((accounts) => {
			const accTable = createTable(accounts);
			accElement.appendChild(accTable);
		});

		getMoney().then((money) => {
			const statTable = createTable(money);
			statElement.appendChild(statTable);
		});
	}

	function createTable(data) {
		const table = document.createElement('table');
		table.style.borderCollapse = 'collapse'; // Add this line to collapse the borders
		table.style.width = '100%'; // Add this line to make the table take up the full width

		const thead = document.createElement('thead');
		const tbody = document.createElement('tbody');

		// Create table header
		const headers = Object.keys(data[0]);
		const headerRow = document.createElement('tr');
		headers.forEach((header) => {
			const th = document.createElement('th');
			th.textContent = header;
			th.style.border = '1px solid black'; // Add this line to add borders to the header cells
			th.style.textAlign = 'center'; // Add this line to center the text in the header cells
			headerRow.appendChild(th);
		});
		thead.appendChild(headerRow);
		table.appendChild(thead);

		// Create table rows
		data.forEach((item) => {
			const row = document.createElement('tr');
			headers.forEach((header) => {
				const td = document.createElement('td');
				td.textContent = item[header];
				td.style.border = '1px solid black'; // Add this line to add borders to the data cells
				td.style.textAlign = 'center'; // Add this line to center the text in the data cells
				row.appendChild(td);
			});
			tbody.appendChild(row);
		});
		table.appendChild(tbody);

		return table;
	}
});
