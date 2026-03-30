process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');

async function createPatient() {
  try {
    // 1. Logar como profissional para pegar o token
    console.log('Tentando logar como profissional (maya@maya.com)...');
    const loginRes = await axios.post('https://maya-rpg-api.onrender.com/auth/login', {
      email: 'maya@maya.com',
      senha: 'password' // will try 123456 if it fails
    }).catch(async (e) => {
      if (e.response && e.response.status === 401) {
        return await axios.post('https://maya-rpg-api.onrender.com/auth/login', {
          email: 'maya@maya.com',
          senha: '123456'
        });
      }
      throw e;
    });

    const token = loginRes.data.access_token;
    console.log('Login profissional efetuado. Criando paciente testemobile@maya.com...');

    // 2. Criar novo paciente
    const patientData = {
      nome: 'Teste Mobile Definitivo',
      email: 'testemobile@maya.com',
      senha: '123',
      telefone: '(11) 99999-9999',
      cpf: '000.000.000-00',
      data_nascimento: '1990-01-01',
      queixa_principal: 'Dor lombar',
      historico_medico: 'Nenhum',
      objetivos: 'Melhorar postura'
    };

    const createRes = await axios.post('https://maya-rpg-api.onrender.com/pacientes', patientData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('[SUCESSO] Paciente criado:', createRes.data);

    // 3. Logar com o novo paciente para ver se tem paciente_id
    const newLogin = await axios.post('https://maya-rpg-api.onrender.com/auth/login', {
      email: 'testemobile@maya.com',
      senha: '123'
    });
    console.log('[VERIFICACAO] Login do novo paciente retornou (deve ter paciente_id):', newLogin.data.user);

  } catch (err) {
    if (err.response && err.response.status === 409) {
      console.log('O email testemobile@maya.com já existe. Vamos tentar logar com ele.');
      try {
        const check = await axios.post('https://maya-rpg-api.onrender.com/auth/login', { email: 'testemobile@maya.com', senha: '123' });
        console.log('[VERIFICACAO] Login do testemobile retornou:', check.data.user);
      } catch (e) {
        console.error('Falha ao logar com o paciente que já existia', e.message);
      }
    } else {
      console.error('[ERRO FATAL]:', err.response?.data || err.message);
    }
  }
}

createPatient();
