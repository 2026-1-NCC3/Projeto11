const fs = require('fs');

async function fixDB() {
  const loginRes = await fetch('https://maya-rpg-api.onrender.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@maya.com', senha: '123456' })
  });
  const loginData = await loginRes.json();
  const token = loginData.access_token;

  console.log('Logged in. Token:', token.substring(0, 10) + '...');

  const exRes = await fetch('https://maya-rpg-api.onrender.com/exercicios', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const exercicios = await exRes.json();

  const fixes = {
    'AbdÃ´men': 'Abdômen',
    'EXERCÃ CIOS': 'EXERCÍCIOS',
    'USUÃ RIOS': 'USUÁRIOS',
    'crÃ´nica': 'crônica',
    'hÃ¡': 'há',
    'perÃ­odos': 'períodos',
    'ReeducaÃ§Ã£o': 'Reeducação',
    'mÃ£os': 'mãos',
    'atrÃ¡s': 'atrás',
    'posiÃ§Ã£o': 'posição',
    'RespiraÃ§Ã£o': 'Respiração',
    'DiafragmÃ¡tica': 'Diafragmática',
    'mÃ£o': 'mão',
    'pÃ©': 'pé',
    'cabeÃ§a': 'cabeça',
    'glÃºteos': 'glúteos',
    'estabilizaÃ§Ã£o': 'estabilização',
    'lombopÃ©lvica': 'lombopélvica',
    'RotaÃ§Ã£o': 'Rotação',
    'TorÃ¡cica': 'Torácica',
    'DecÃºbito': 'Decúbito',
    'RÃ£': 'Rã',
    'ChÃ£o': 'Chão',
    'pÃ©s': 'pés',
    'caÃ­rem': 'caírem',
    'correÃ§Ã£o': 'correção',
    'protraÃ§Ã£o': 'protração',
    'elÃ¡stica': 'elástica',
    'Ã ': 'à',
    'trÃ¡s': 'trás',
    'escÃ¡pulas': 'escápulas',
    'contraÃ§Ã£o': 'contração',
    'glÃºtea': 'glútea',
    'trapÃ©zio': 'trapézio',
    'SupervisÃ£o': 'Supervisão',
    'clÃ­nica': 'clínica',
    'DiÃ¡rio': 'Diário',
    'manhÃ£': 'manhã',
    'Ã¢': 'â',
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã£': 'ã',
    'Ãµ': 'õ',
    'Ã§': 'ç',
    'Ã': 'í'
  };

  const fixText = (text) => {
    if (!text) return text;
    let newText = text;
    for (const [bad, good] of Object.entries(fixes)) {
      newText = newText.split(bad).join(good);
    }
    return newText;
  };

  for (const ex of exercicios) {
    let changed = false;
    const newEx = { ...ex };
    
    if (newEx.nome !== fixText(newEx.nome)) { newEx.nome = fixText(newEx.nome); changed = true; }
    if (newEx.descricao !== fixText(newEx.descricao)) { newEx.descricao = fixText(newEx.descricao); changed = true; }
    if (newEx.instrucoes !== fixText(newEx.instrucoes)) { newEx.instrucoes = fixText(newEx.instrucoes); changed = true; }
    if (newEx.musculo_alvo !== fixText(newEx.musculo_alvo)) { newEx.musculo_alvo = fixText(newEx.musculo_alvo); changed = true; }
    if (newEx.tags) {
      newEx.tags = newEx.tags.map(t => {
        const fixed = fixText(t);
        if (t !== fixed) changed = true;
        return fixed;
      });
    }

    if (changed) {
      console.log(`Fixing ${ex.id} - ${newEx.nome}...`);
      const putRes = await fetch(`https://maya-rpg-api.onrender.com/exercicios/${ex.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newEx)
      });
      if (!putRes.ok) console.error(await putRes.text());
    }
  }

  console.log('Done.');
}

fixDB().catch(console.error);
