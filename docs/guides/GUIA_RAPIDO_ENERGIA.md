# ⚡ Guia Rápido - Sistema de Energia

## 🎯 O Que Mudou?

### Antes
- Energia máxima: **100** (fixo)
- Aumentava apenas a cada 10 níveis (+10)

### Agora ✨
- Energia máxima: **100 + 5 por cada nível/skill**
- **CADA level up:** +5 maxEnergy
- **CADA skill level up:** +5 maxEnergy
- **Energia restaura 100%** ao subir de nível!

---

## 📊 Exemplos Práticos

### Jogador Iniciante (Level 1, Skills 1)
```
Energia: 100/100
```

### Após 5 Níveis (Level 6, Skills 1)
```
Energia: 125/125
(100 base + 5×5 levels = 125)
```

### Level 6 + Farming 10 (uma skill upada)
```
Energia: 170/170
(100 + 25 levels + 45 farming = 170)
```

### Jogador Avançado (Level 20, Todas Skills 10)
```
Energia: 555/555
(100 + 95 player + 360 skills = 555)
```

---

## 🧮 Fórmula Simples

```
MaxEnergy = 100 + (Level-1)×5 + Soma[(SkillLevel-1)×5]
```

**Resumindo:** Cada nível (normal ou skill) = **+5 energia máxima**

---

## ✅ Compatibilidade com Saves Antigos

### Não precisa fazer nada! 🎉

O sistema **automaticamente calcula** a energia correta quando você:
- Carrega o jogo
- Importa um save antigo
- Continua jogando

**Sua energia atual é preservada!** Não perde nada.

---

## 🧪 Como Testar?

### Teste Rápido no Console
```javascript
// Cole isso no console do navegador (F12)
energiaSystemTest.quickTest()
```

### Teste Completo
```javascript
energiaSystemTest.runAll()
```

### Ver Estatísticas Atuais
```javascript
energiaSystemTest.displayStats()
```

---

## 🎮 Como Usar no Jogo

### 1. Suba de Nível
- Ganhe XP fazendo atividades
- Ao subir de nível: **+5 maxEnergy + energia restaurada!**

### 2. Suba Skills
- Plante culturas (Farming XP)
- Minere recursos (Mining XP)
- Pesque (Fishing XP)
- Etc...
- Cada skill level: **+5 maxEnergy + energia restaurada!**

### 3. Aproveite!
- Mais energia = mais ações por dia
- Menos descanso necessário
- Gameplay mais eficiente

---

## 📱 Debug Commands

### Ver Energia Atual
```javascript
const p = game.player.data;
console.log(`${p.energy}/${p.maxEnergy}`);
```

### Adicionar XP (Testar Level Up)
```javascript
game.player.addXP(1000);
```

### Adicionar Skill XP (Testar Skill Level)
```javascript
game.player.addSkillXP('farming', 500);
```

### Forçar Recálculo (Se necessário)
```javascript
game.player.data.maxEnergy = game.player.calculateMaxEnergy(
  game.player.data.level,
  game.player.data.skills
);
game.saveGame();
```

---

## 🐛 Problemas?

### Energia não aumentou ao subir de nível
1. Verifique se realmente subiu de nível
2. Olhe no console: deve aparecer "🎉 Level up!"
3. Execute: `energiaSystemTest.quickTest()`

### Energia máxima parece errada
1. Execute: `energiaSystemTest.displayStats()`
2. Compare "Expected" vs "Actual"
3. Se diferente, execute o comando de recálculo acima

### Save antigo com energia estranha
1. Apenas carregue o save normalmente
2. O sistema recalcula automaticamente
3. Se ainda estiver errado, use o comando de recálculo

---

## ✨ Benefícios

1. **Progressão Recompensadora**
   - Cada nível importa
   - Incentivo para upar skills

2. **Balanceamento Justo**
   - +5 é equilibrado
   - Não fica OP muito rápido

3. **QoL (Quality of Life)**
   - Mais energia = menos paradas
   - Gameplay mais fluido

4. **Compatibilidade Total**
   - Saves antigos funcionam
   - Sem reset necessário

---

## 📞 Suporte

Se encontrar bugs ou problemas:
1. Execute `energiaSystemTest.runAll()`
2. Copie os resultados
3. Reporte com os detalhes

---

**Versão:** 0.0.5  
**Status:** ✅ Implementado  
**Última Atualização:** 2024