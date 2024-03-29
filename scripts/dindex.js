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
	if (response.status === 404) {
		window.location.href = '/404';
	} else {
		// another get request to /getMoney
		const response2 = await fetch('/getMoney', {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({fHeusGF:fHeusGF}),
		});

		if (response2.status === 404) {
			window.location.href = '/404';
		} else {
			const data = await response2.json();
			document.getElementById('money').innerHTML = `${data[0].money} Terrabucks`;
		}
	}
}

getMysql('/login',{fHeusGF:fHeusGF,hDjeRfg:hDjeRfg});