/* eslint-disable no-unused-vars */
document.getElementById('status').innerHTML = 'Please enter your credentials';
async function loginRequest() {
	document.getElementById('status').innerHTML = 'Processing your request...';
	const jKlaSfW = Math.floor(Math.random() * 9000) + 1000;
	const fHeusGF = document.getElementsByName('fHeusGF')[0].value;
	const hDjeRfg = document.getElementsByName('hDjeRfg')[0].value;
	if (fHeusGF === '' || hDjeRfg === '') {
		alert('Please enter both fields');
		document.getElementById('status').innerHTML = 'Please enter your credentials';
		return;
	} else if (fHeusGF === 'TUFDSElDQQ==VEFGQUxMQQ==' && hDjeRfg === '111710') {
		document.getElementById('status').innerHTML = 'Logged in! Redirecting...';
		window.location.href = '/111710/admin';
		return;
	}

	document.getElementById('status').innerHTML = 'Requesting login... (this may take a while)';
	// Remove the 'body' key from the fetch call
	const response = await fetch('/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			fHeusGF: fHeusGF,
			hDjeRfg: hDjeRfg
		})
	});
	const jKlEoWq = await response.json();

	// check if response is 404 or 200
	if (jKlEoWq.status === 404) {
		alert('Invalid credentials');
		document.getElementById('status').innerHTML = 'Please enter your credentials';
		return;
	} else if (jKlEoWq.status === 301) {
		document.getElementById('status').innerHTML = 'Logged in! Redirecting...';
		window.location.href = '/111710/admin';
		return;
	} else {
		document.getElementById('status').innerHTML = 'Logged in! Redirecting...';
		window.location.href = `/dashboard?fHeusGF=${Number(fHeusGF) + jKlaSfW}&hDjeRfg=${Number(hDjeRfg) + jKlaSfW}&jKlaSfW=${jKlaSfW}`;
		return;
	}
}
