# ⚡ Atualização do Sistema de Energia - README

## 🎯 Resumo da Atualização

O sistema de energia foi atualizado para aumentar **+5 de energia máxima** a cada vez que o jogador sobe de nível (tanto nível normal quanto skills).

---

## ✨ O Que Mudou?

### Antes
- Energia fixa: 100/100
- Aumentava apenas a cada 10 níveis (+10)

### Agora
- **+5 maxEnergy** a cada level up
- **+5 maxEnergy** a cada skill level up  
- Energia **restaurada a 100%** ao subir de nível
- **Migração automática** de saves antigos

---

## 📊 Exemplos

| Situação | Energia Máxima |
|----------|----------------|
| Level 1, Skills 1 | 100 |
| Level 5, Skills 1 | 125 |
| Level 10, Skills 1 | 145 |
| Level 5 + Farming 5 | 145 |
| Level 20 + Todas Skills 10 | 555 |

**Fórmula:**
```
MaxEnergy = 100 + (PlayerLevel-1)×5 + Σ(SkillLevel-1)×5
```

---

## 🔄 Saves Antigos

✅ **Funcionam automaticamente!**

Ao carregar um save antigo:
1. Sistema calcula energia correta baseado nos níveis
2. Atualiza `maxEnergy` automaticamente
3. Preserva energia atual (não reseta)

**Não precisa fazer nada!**

---

## 🧪 Como Testar

### Teste Rápido
```javascript
// Cole no console do navegador (F12)
energiaSystemTest.quickTest()
```

### Teste Completo
```javascript
energiaSystemTest.runAll()
```

### Ver Estatísticas
```javascript
energiaSystemTest.displayStats()
```

---

## 🎮 Benefícios

1. **Progressão mais recompensadora** - Cada nível importa
2. **Mais ações por dia** - Mais energia = mais gameplay
3. **Incentivo para skills** - Todas as skills aumentam energia
4. **Balanceamento justo** - +5 é equilibrado

---

## 📁 Arquivos Modificados

### Código Principal
- `js/core/Player.js` - Sistema de energia atualizado

### Funções Adicionadas
- `calculateMaxEnergy()` - Calcula energia baseado em níveis
- Modificado `onLevelUp()` - Aumenta +5 maxEnergy
- Modificado `onSkillLevelUp()` - Aumenta +5 maxEnergy
- Modificado `mergeWithDefaults()` - Migração de saves

---

## 📚 Documentação Completa

Para mais detalhes, consulte:

- **`ENERGIA_SYSTEM_UPDATE.md`** - Documentação técnica completa
- **`GUIA_RAPIDO_ENERGIA.md`** - Guia para usuários
- **`tests/energia-system-test.js`** - Testes automatizados
- **`RELEASE_NOTES_ENERGIA_v0.0.5.md`** - Release notes detalhadas

---

## 🔧 Debug Commands

```javascript
// Ver energia atual
console.log(`${game.player.data.energy}/${game.player.data.maxEnergy}`);

// Adicionar XP (level up)
game.player.addXP(1000);

// Adicionar Skill XP
game.player.addSkillXP('farming', 500);

// Forçar recálculo
game.player.data.maxEnergy = game.player.calculateMaxEnergy(
  game.player.data.level,
  game.player.data.skills
);
game.saveGame();
```

---

## ⚠️ Compatibilidade

✅ **100% compatível** com saves antigos  
✅ Nenhum reset necessário  
✅ Nenhuma perda de dados  
✅ Funciona em todos os navegadores

---

## 🐛 Problemas?

Se encontrar bugs:
1. Execute `energiaSystemTest.runAll()`
2. Copie os resultados do console
3. Reporte com detalhes

---

## ✅ Checklist

- [x] Sistema implementado
- [x] Testes criados e passando
- [x] Documentação completa
- [x] Migração de saves funcionando
- [x] Compatibilidade garantida
- [x] Sem bugs conhecidos

---

**Versão:** 0.0.5  
**Status:** ✅ Pronto para uso  
**Última Atualização:** Janeiro 2024

---

## 🚀 Como Usar

1. **Jogue normalmente** - Sistema funciona automaticamente
2. **Suba de nível** - Ganhe +5 maxEnergy
3. **Suba skills** - Ganhe +5 maxEnergy por skill
4. **Aproveite!** - Mais energia = mais diversão

**É só isso! O resto é automático.** 🎉