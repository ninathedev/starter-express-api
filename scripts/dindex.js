const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);


const jKlaSfW = params.get('jKlaSfW');
const fHeusGF = params.get('fHeusGF')-jKlaSfW;
const hDjeRfg = params.get('hDjeRfg')-jKlaSfW;

// check if the variables are not null
if (jKlaSfW === null || fHeusGF === null || hDjeRfg === null) {
	window.location.href = '/404';
}

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

getMysql('/mysql',{sql:`SELECT * FROM accounts WHERE id = ${fHeusGF} AND pin = ${hDjeRfg}`,login:true}).then((data) => {
	if (data[0] === undefined) {
		window.location.href = '/404';
	} else {
		getMysql('/mysql', {sql: `SELECT * FROM money WHERE id = ${fHeusGF}`,login:true}).then((data) => {
			if (data[0] === undefined) {
				window.location.href = '/500';
			} else {
				document.getElementById('balanceAmount').innerHTML = `${data[0].money} Terrabucks`;
			}
		});
	}
});