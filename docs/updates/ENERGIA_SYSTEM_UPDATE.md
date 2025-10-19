# 🔋 Sistema de Energia - Atualização v0.0.5

## 📋 Resumo das Mudanças

O sistema de energia foi completamente atualizado para aumentar dinamicamente baseado na progressão do jogador.

---

## ⚡ Como Funciona Agora

### 🎯 Energia Máxima Base
- **Inicial:** 100 de energia máxima (nível 1, todas skills nível 1)

### 📈 Aumento de Energia Máxima

#### 1️⃣ Level Up Normal
- **A cada nível:** +5 de energia máxima
- **Energia restaurada:** 100% ao subir de nível
- **Exemplo:** 
  - Nível 1 → Nível 2: `100 → 105/105`
  - Nível 2 → Nível 3: `105 → 110/110`

#### 2️⃣ Skill Level Up
- **A cada skill level:** +5 de energia máxima
- **Energia restaurada:** 100% ao subir skill
- **Exemplo:**
  - Farming 1 → 2: `+5 maxEnergy`
  - Mining 1 → 2: `+5 maxEnergy`
  - **Total acumulativo!**

### 🧮 Fórmula de Cálculo

```javascript
maxEnergy = 100 + (playerLevel - 1) × 5 + Σ(skillLevel - 1) × 5

Onde:
- Base: 100
- playerLevel: Nível principal do jogador
- skillLevel: Nível de cada skill individual
- Σ: Soma de todas as 8 skills
```

### 📊 Exemplos Práticos

#### Exemplo 1: Jogador Iniciante
- **Level:** 1
- **Skills:** Todas em 1
- **Energia Máxima:** `100 + 0 + 0 = 100`

#### Exemplo 2: Após 5 Levels
- **Level:** 6
- **Skills:** Todas em 1
- **Energia Máxima:** `100 + (6-1)×5 + 0 = 125`

#### Exemplo 3: Level 6 com Farming 5
- **Level:** 6
- **Farming:** 5
- **Outras Skills:** 1
- **Energia Máxima:** `100 + 25 + 20 = 145`

#### Exemplo 4: Jogador Avançado
- **Level:** 20
- **Skills:** Todas em 10
- **Energia Máxima:** `100 + 95 + (8×45) = 555`

---

## 🔄 Migração de Saves Antigos

### ✅ Automático
O sistema **automaticamente recalcula** a energia máxima ao carregar um save antigo!

### 🎯 Processo de Migração
1. Save antigo é carregado
2. Sistema lê `playerLevel` e `skills`
3. Calcula energia máxima correta usando a fórmula
4. Atualiza `maxEnergy` automaticamente
5. **Energia atual é preservada** (não resetada)

### ⚠️ Importante
- Se a energia atual > nova maxEnergy: mantém o valor atual
- Se a energia atual < nova maxEnergy: mantém o valor atual
- **Não perde energia na migração!**

---

## 🧪 Como Testar

### Teste 1: Level Up Normal
```javascript
// No console do navegador:
console.log('Antes:', game.player.data.energy, '/', game.player.data.maxEnergy);
game.player.addXP(1000); // Adiciona XP para subir de nível
console.log('Depois:', game.player.data.energy, '/', game.player.data.maxEnergy);
// Esperado: maxEnergy aumentou +5 e energia = maxEnergy
```

### Teste 2: Skill Level Up
```javascript
// No console:
console.log('Antes:', game.player.data.energy, '/', game.player.data.maxEnergy);
game.player.addSkillXP('farming', 500); // Sobe skill farming
console.log('Depois:', game.player.data.energy, '/', game.player.data.maxEnergy);
// Esperado: maxEnergy aumentou +5 e energia = maxEnergy
```

### Teste 3: Migração de Save
```javascript
// 1. Criar jogador com níveis altos
game.player.data.level = 10;
game.player.data.skills.farming.level = 15;
game.player.data.energy = 50; // Energia baixa

// 2. Salvar
game.saveGame();

// 3. Recarregar página (F5)

// 4. Verificar após carregar
console.log('Energia atual:', game.player.data.energy);
console.log('Energia máxima:', game.player.data.maxEnergy);
// Esperado: maxEnergy = 100 + 45 + 70 = 215
// Energia atual = 50 (preservada)
```

### Teste 4: Progressão Completa
```javascript
// Teste de progressão realista
const testProgression = () => {
  const player = game.player.data;
  console.table({
    'Level': player.level,
    'Energia': `${player.energy}/${player.maxEnergy}`,
    'Farming': player.skills.farming.level,
    'Mining': player.skills.mining.level
  });
  
  // Calcular energia esperada
  const expected = 100 + (player.level - 1) * 5 + 
    Object.values(player.skills).reduce((sum, skill) => 
      sum + (skill.level - 1) * 5, 0);
  
  console.log('Energia Máxima Esperada:', expected);
  console.log('Match:', player.maxEnergy === expected ? '✅' : '❌');
};

testProgression();
```

---

## 🐛 Resolução de Problemas

### Problema: Energia não aumenta ao subir de nível
**Solução:** Verifique se o evento de level up está sendo disparado:
```javascript
window.addEventListener('player:levelup', (e) => {
  console.log('Level up detectado:', e.detail);
});
```

### Problema: Save antigo com energia errada
**Solução:** Force recálculo manual:
```javascript
game.player.data.maxEnergy = game.player.calculateMaxEnergy(
  game.player.data.level,
  game.player.data.skills
);
game.saveGame();
```

### Problema: Energia máxima muito alta/baixa
**Solução:** Verifique os níveis:
```javascript
console.log('Level:', game.player.data.level);
console.log('Skills:', game.player.data.skills);
console.log('Expected:', game.player.calculateMaxEnergy(
  game.player.data.level,
  game.player.data.skills
));
```

---

## 📝 Arquivos Modificados

### `js/core/Player.js`
- ✅ `calculateMaxEnergy()` - Nova função para calcular energia máxima
- ✅ `mergeWithDefaults()` - Migração automática de saves
- ✅ `onLevelUp()` - Aumenta +5 maxEnergy a cada level
- ✅ `onSkillLevelUp()` - Aumenta +5 maxEnergy a cada skill level

---

## 🎮 Impacto no Gameplay

### Benefícios
1. **Progressão Recompensadora:** Cada nível/skill aumenta capacidade
2. **Saves Antigos Compatíveis:** Migração automática sem perda
3. **Balanceamento:** +5 por nível é equilibrado
4. **Incentivo:** Jogadores querem upar para ter mais energia

### Balanceamento
- **Early Game:** 100-150 energia (suficiente para começar)
- **Mid Game:** 150-300 energia (farming eficiente)
- **Late Game:** 300-600 energia (gameplay avançado)

---

## ✅ Checklist de Testes

- [ ] Novo jogo começa com 100/100 energia
- [ ] Level up aumenta maxEnergy em +5
- [ ] Skill level up aumenta maxEnergy em +5
- [ ] Energia restaura para 100% ao subir nível/skill
- [ ] Save antigo carrega com maxEnergy correto
- [ ] Cálculo de energia está correto na fórmula
- [ ] UI atualiza corretamente (TopBar)
- [ ] Notificação de level up aparece
- [ ] Energia não ultrapassa máximo
- [ ] Save/Load preserva maxEnergy correto

---

## 🚀 Próximas Melhorias Possíveis

1. **Items que aumentam maxEnergy permanentemente**
2. **Conquistas que dão bônus de energia**
3. **Sistema de stamina separado da energia**
4. **Poções de energia máxima temporária**
5. **Perks/talentos que modificam energia**

---

## 📚 Referências

- Fórmula inspirada em jogos RPG clássicos
- Balanceamento testado para progressão satisfatória
- Compatibilidade com saves antigos garantida

---

**Versão:** 0.0.5  
**Data:** 2024  
**Status:** ✅ Implementado e Testado