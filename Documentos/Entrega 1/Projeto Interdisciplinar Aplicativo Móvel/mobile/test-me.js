process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');

async function testMe() {
  try {
    const login = await axios.post('https://maya-rpg-api.onrender.com/auth/login', {
      email: 'testemobile@maya.com',
      senha: '123'
    });
    const token = login.data.access_token;
    console.log('Login efetuado, token gerado.');

    const meRes = await axios.get('https://maya-rpg-api.onrender.com/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Resposta de /auth/me:', meRes.data);
  } catch(e) {
    console.error(e.message);
  }
}
testMe();
