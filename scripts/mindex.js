/* eslint-disable no-unused-vars */
async function loginRequest() {
	const jKlaSfW = Math.floor(Math.random() * 9000) + 1000;
	const fHeusGF = document.getElementsByName('fHeusGF')[0].value;
	const hDjeRfg = document.getElementsByName('hDjeRfg')[0].value;
	const body = JSON.stringify({
		fHeusGF: fHeusGF,
		hDjeRfg: hDjeRfg
	});
	// Remove the 'body' key from the fetch call
	const response = await fetch('/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: body
	});
	const jKlEoWq = await response.json();

	// check if response is 404 or 200
	if (jKlEoWq.status === 404) {
		alert('Invalid credentials');
	} else if (jKlEoWq.status === 301) {
		window.location.href = '/fKsHeuD/admin';
	} else {
		window.location.href = `/dashboard?fHeusGF=${Number(fHeusGF) + jKlaSfW}&hDjeRfg=${Number(hDjeRfg) + jKlaSfW}&jKlaSfW=${jKlaSfW}`;
	}
}
