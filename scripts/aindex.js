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

function how2() {
	document.write('NOTE: pls reload page to get back to admin controls.<br><br>Admin controls show all accounts and money in the bank.<br>To give salary, under the statistics tab, type the salary per account and click on the "Give salary" button.<br>(Pro tip: If you want taxes, just type in a NEGATIVE amount of money. It\'ll deduct that amount from the bank.)<br><br>Under the MySQL tab, you can execute MySQL commands. Be careful with this, as it can be dangerous.<br>For more information on MySQL, click <a href="https://www.w3schools.com/mysql/mysql_sql.asp">here</a>.<br><br>The total amount of money and the average amount of money can be seen in the statistics tab.<br><br>To give salary to a specific person or only to a selected amount of people, use the "Give salary to specific person" button.<br>Enter the ID of the person and the amount of money you want to give to them.<br>(Pro tip: If you want to take money from them, just type in a negative amount of money.)');
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

function sendSalary() {
	document.getElementById('resultf').innerHTML = 'Sending money...';
	const tax = Number(document.getElementsByName('sal')[0].value) - (Number(document.getElementsByName('sal')[0].value)+Number(document.getElementsByName('sal')[0].value));
	const taxData = { tax: tax };
	fetch('/tax', {
		method: 'PUT',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(taxData),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			document.getElementById('resultf').innerHTML = 'Money sent! (Reload page to see changes)';
			location.reload;
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

function sendInSalary() {
	document.getElementById('resultg').innerHTML = 'Sending money...';
	const insal = Number(document.getElementsByName('sala')[0].value);
	const id = Number(document.getElementsByName('salid')[0].value);
	const insalData = { salary: insal, id: id};
	fetch('/insal', {
		method: 'PUT',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(insalData),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			document.getElementById('resultg').innerHTML = 'Money sent! (Reload page to see changes)';
			location.reload;
		})
		.catch((error) => {
			console.error(`Error: ${error}`);
			document.getElementById('resultg').innerHTML = `Error: ${error}`;
		});
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
			const totalAmount = money.reduce((sum, account) => sum + account.money, 0);
			document.getElementById('total').innerHTML = `Total amount of money in bank: ${totalAmount}`;
			const averageAmount = totalAmount / money.length;
			document.getElementById('avg').innerHTML = `Average amount of money in bank: ${averageAmount}`;
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