const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function omegaFix() {
  console.log('--- Iniciando Faxina Profunda de Encoding ---');
  
  // 1. Login
  const loginRes = await fetch('https://maya-rpg-api.onrender.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@maya.com', senha: '123456' })
  });
  const loginData = await loginRes.json();
  const token = loginData.access_token;
  console.log('Login realizado com sucesso.');

  const fixes = {
    'Ã´': 'ô', 'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
    'Ã£': 'ã', 'Ãµ': 'õ', 'Ã§': 'ç', 'Ãª': 'ê', 'Ã¢': 'â', 'Ã€': 'À',
    'Ã ': 'à', 'Ã‰': 'É', 'Ã ': 'Í', 'Ã“': 'Ó', 'Ãš': 'Ú'
  };

  const fixText = (text) => {
    if (!text || typeof text !== 'string') return text;
    let newText = text;
    for (const [bad, good] of Object.entries(fixes)) {
      newText = newText.split(bad).join(good);
    }
    return newText;
  };

  const headers = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` 
  };

  // 2. Fix Exercicios
  console.log('Corrigindo Exercícios...');
  const exRes = await fetch('https://maya-rpg-api.onrender.com/exercicios', { headers });
  const exercicios = await exRes.json();
  for (const ex of exercicios) {
    const fixed = {
      ...ex,
      nome: fixText(ex.nome),
      descricao: fixText(ex.descricao),
      instrucoes: fixText(ex.instrucoes),
      musculo_alvo: fixText(ex.musculo_alvo),
      tags: ex.tags ? ex.tags.map(fixText) : []
    };
    if (JSON.stringify(ex) !== JSON.stringify(fixed)) {
      console.log(`Corrigindo Exercício: ${fixed.nome}`);
      await fetch(`https://maya-rpg-api.onrender.com/exercicios/${ex.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(fixed)
      });
    }
  }

  // 3. Fix Pacientes
  console.log('Corrigindo Pacientes...');
  const pacRes = await fetch('https://maya-rpg-api.onrender.com/pacientes', { headers });
  const pacientes = await pacRes.json();
  for (const p of pacientes) {
    const fixed = {
      ...p,
      nome: fixText(p.nome),
      queixa_principal: fixText(p.queixa_principal),
      historico_medico: fixText(p.historico_medico),
      medicamentos: fixText(p.medicamentos),
      objetivos: fixText(p.objetivos),
      observacoes: fixText(p.observacoes)
    };
    if (JSON.stringify(p) !== JSON.stringify(fixed)) {
      console.log(`Corrigindo Paciente: ${fixed.nome}`);
      await fetch(`https://maya-rpg-api.onrender.com/pacientes/${p.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(fixed)
      });
    }

    // 4. Fix Prontuários do Paciente
    console.log(`Buscando Prontuários de: ${fixed.nome}...`);
    const pronRes = await fetch(`https://maya-rpg-api.onrender.com/prontuario/paciente/${p.id}/sessoes`, { headers });
    const sessoes = await pronRes.json();
    if (Array.isArray(sessoes)) {
        for (const s of sessoes) {
            // Nota: O backend pode não ter uma rota de PUT para sessões individuais, 
            // mas o queixa/evolucao costuma estar lá.
            // No momento o backend só tem POST, então o que está lá está lá.
            // Mas as queixas principais estão na tabela pacientes.
        }
    }
  }

  console.log('--- Faxina Profunda Concluída ---');
}

omegaFix().catch(console.error);
