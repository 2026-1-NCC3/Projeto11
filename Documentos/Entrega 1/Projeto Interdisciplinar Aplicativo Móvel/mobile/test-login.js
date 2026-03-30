process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');

async function testLogin(email) {
  try {
    const res = await axios.post('https://maya-rpg-api.onrender.com/auth/login', { email, senha: 'password' });
    console.log(`[SUCESSO] ${email}:`, res.data.user);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      // Trying the actual seed password, which is '123456' hashed
      try {
        const res2 = await axios.post('https://maya-rpg-api.onrender.com/auth/login', { email, senha: '123456' });
        console.log(`[SUCESSO com 123456] ${email}:`, res2.data.user);
      } catch (err2) {
        console.log(`[ERRO 123456] ${email}:`, err2.response?.data || err2.message);
      }
    } else {
      console.log(`[ERRO] ${email}:`, err.response?.data || err.message);
    }
  }
}

async function run() {
  await testLogin('carlos@email.com');
  await testLogin('paciente@maya.com');
}

run();
