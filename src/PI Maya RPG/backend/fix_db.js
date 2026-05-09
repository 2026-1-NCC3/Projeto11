const url = 'https://maya-rpg-api.onrender.com';

const replacements = [
  [/Ã©/g, 'é'], [/Ã§/g, 'ç'], [/Ã£/g, 'ã'], [/Ã¡/g, 'á'], [/Ã³/g, 'ó'], [/Ãº/g, 'ú'],
  [/Ã\xad/g, 'í'], [/Ã­/g, 'í'], [/â€”/g, '—'], [/â€“/g, '–'], [/Ãª/g, 'ê'], [/Ã¢/g, 'â'],
  [/Ã‚/g, 'Â'], [/Ã”/g, 'Ô'], [/Ãµ/g, 'õ'], [/Ã‡/g, 'Ç'], [/Ã‰/g, 'É'], [/Ã /g, 'À'],
  [/Ã /g, 'Á'], [/Ã”/g, 'Ô'], [/Ã /g, 'Ã'], [/Ã•/g, 'Õ']
];

function fixText(text) {
  if (!text) return text;
  let fixed = text;
  for (const [bad, good] of replacements) {
    fixed = fixed.replace(bad, good);
  }
  return fixed;
}

function hasEncodingIssue(text) {
  return text !== fixText(text);
}

async function main() {
  console.log('Logging in...');
  const loginRes = await fetch(url + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'teste@maya.com', senha: '123456' })
  });
  const { access_token } = await loginRes.json();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token
  };

  // Fix Exercises
  console.log('Fetching exercises...');
  const exRes = await fetch(url + '/exercicios', { headers });
  const exercicios = await exRes.json();
  for (const ex of exercicios) {
    const fixedEx = {
      nome: fixText(ex.nome),
      descricao: fixText(ex.descricao),
      instrucoes: fixText(ex.instrucoes),
      musculo_alvo: fixText(ex.musculo_alvo)
    };
    if (fixedEx.nome !== ex.nome || fixedEx.descricao !== ex.descricao || fixedEx.instrucoes !== ex.instrucoes || fixedEx.musculo_alvo !== ex.musculo_alvo) {
      console.log('Fixing exercise: ' + fixedEx.nome);
      await fetch(url + '/exercicios/' + ex.id, {
        method: 'PUT',
        headers,
        body: JSON.stringify(fixedEx)
      });
    }
  }

  // Fix Patients
  console.log('Fetching patients...');
  const pacRes = await fetch(url + '/pacientes', { headers });
  const pacientes = await pacRes.json();
  for (const pac of pacientes) {
    const fixedPac = {
      nome: fixText(pac.nome),
      queixa_principal: fixText(pac.queixa_principal),
      historico_medico: fixText(pac.historico_medico),
      objetivos: fixText(pac.objetivos)
    };
    if (fixedPac.nome !== pac.nome || fixedPac.queixa_principal !== pac.queixa_principal || fixedPac.historico_medico !== pac.historico_medico || fixedPac.objetivos !== pac.objetivos) {
      console.log('Fixing patient: ' + fixedPac.nome);
      await fetch(url + '/pacientes/' + pac.id, {
        method: 'PUT',
        headers,
        body: JSON.stringify(fixedPac)
      });
    }

    // Fix Prescriptions for Patient
    const presRes = await fetch(url + '/prescricoes/paciente/' + pac.id, { headers });
    const prescricoes = await presRes.json();
    for (const pr of prescricoes) {
      const fixedPr = {
        frequencia: fixText(pr.frequencia),
        observacoes: fixText(pr.observacoes)
      };
      if (fixedPr.frequencia !== pr.frequencia || fixedPr.observacoes !== pr.observacoes) {
        console.log('Fixing prescription for: ' + fixedPac.nome);
        await fetch(url + '/prescricoes/' + pr.id, {
          method: 'PUT',
          headers,
          body: JSON.stringify(fixedPr)
        });
      }
    }
  }

  console.log('All fixed!');
}

main().catch(console.error);
