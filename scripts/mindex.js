
async function loginRequest() {
  const jKlaSfW = Math.floor(Math.random() * 9000) + 1000;
  const fHeusGF = document.getElementsByName('fHeusGF')[0].value;
  const hDjeRfg = document.getElementsByName('hDjeRfg')[0].value;
  const jKlEoWq = await fetch('/login', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fHeusGF, hDjeRfg })
  });
  // check if response is 404 or 200
  if (response.status === 404) {
    alert('Invalid credentials');
  } else {
    window.location.href = `/dashboard?fHeusGF=${fHeusGF+jKlaSfW}&hDjeRfg=${hDjeRfg+jKlaSfW}&jKlaSfW=${jKlaSfW}`;
  }
}