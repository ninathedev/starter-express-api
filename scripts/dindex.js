const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

const jKlaSfW = params.get('jKlaSfW');
const fHeusGF = params.get('fHeusGF')-jKlaSfW;
const hDjeRfg = params.get('hDjeRfg')-jKlaSfW;

// check if the variables are not null
if (jKlaSfW === null || fHeusGF === null || hDjeRfg === null) {
	window.location.href = '/404';
}

async function POSTRequest1(url = '', data = {}) {
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

POSTRequest1('/mysql',{sql:`SELECT * FROM accounts WHERE id = ${fHeusGF} AND pin = ${hDjeRfg}`,login:true}).then((data) => {
	if (data[0] === undefined) {
		window.location.href = '/404';
	} else {
		POSTRequest1('/mysql', {sql: `SELECT * FROM money WHERE id = ${fHeusGF}`,login:true}).then((data) => {
			if (data[0] === undefined) {
				window.location.href = '/500';
			} else {
				document.getElementById('balanceAmount').innerHTML = `${data[0].money} Terrabucks`;
			}
		});
	}
});
async function PUTRequest1(url = '', data = {}) {
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

// eslint-disable-next-line no-unused-vars
function giveMoney() {
	const amountSend = document.getElementById('amountSend').value;
	const textSend = document.getElementById('textSend').value;
	PUTRequest1('/transact', { from: fHeusGF, to: textSend, amount: amountSend }).then((data) => {
		if (textSend == fHeusGF) {
			document.getElementById('statusSend').innerHTML = 'You cannot send money to yourself!';
			return;
		}
		document.getElementById('statusSend').innerHTML = 'Sending...';
		if (data[0] === undefined) {
			window.location.href = '/500';
		} else {
			document.getElementById('statusSend').innerHTML = 'Successfully sent! Please refresh the page to see the changes.';
		}
	});
}