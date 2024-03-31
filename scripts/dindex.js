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

// eslint-disable-next-line no-unused-vars
async function giveMoney() {
	const amountSend = document.getElementById('amountSend').value;
	const textSend = document.getElementById('textSend').value;
	document.getElementById('statusSend').innerHTML = 'Sending...';
	// eslint-disable-next-line no-unused-vars
	const response = await fetch('/transact', {
		method: 'PUT',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify({amount: amountSend, to: textSend, from: fHeusGF}),
	});

	if (response.status !== 204) {
		document.getElementById('statusSend').innerHTML = 'Failed to send money!';
		console.log(response);
	}
	if (textSend == fHeusGF) {
		document.getElementById('statusSend').innerHTML = 'You cannot send money to yourself!';
		return;
	}
	if (amountSend < 1) {
		document.getElementById('statusSend').innerHTML = 'You cannot send negative/no amount!';
		return;
	}
	document.getElementById('statusSend').innerHTML = 'Successfully sent! Please refresh the page to see the changes.';
}