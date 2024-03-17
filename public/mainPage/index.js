function loginRequest() {
    event.preventDefault();
    const fHeusGF = document.getElementsByName('fHeusGF')[0].value;
    const hDjeRfg = document.getElementsByName('hDjeRfg')[0].value;
  
    
  }
  
  function signupRequest() {
    event.preventDefault();
    const LkaPrehH = document.getElementsByName('LkaPrehH')[0].value;
    const DHrEjfF = document.getElementsByName('DHrEjfF')[0].value;
    const code = Math.floor(10000 + Math.random() * 90000);

    
    
    document.write(`Thank you for signing up! On the next school day, please provide the following code to your Tafalla, Machica, or Cotas: ${code}`);
  }