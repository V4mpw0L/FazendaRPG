# 🧪 Guia de Testes - Melhorias do Sistema de NPCs

## 📋 Como Testar as Novas Funcionalidades

Este guia ajuda você a testar todas as melhorias implementadas no sistema de NPCs.

---

## 🎯 Testes Rápidos (5 minutos)

### 1. Teste de Ganho Progressivo de Amizade

**Passos:**
1. Abra o jogo e vá para a tela de NPCs
2. Escolha um NPC (ex: Fazendeiro José)
3. Clique em "Conversar" várias vezes
4. Observe as notificações

**Resultado Esperado:**
```
0-25%: "Você conversou com Fazendeiro José (+1% amizade)"
25-50%: "Você conversou com Fazendeiro José (+2% amizade)"
50-75%: "Você conversou com Fazendeiro José (+3% amizade)"
75-100%: "Você conversou com Fazendeiro José (+5% amizade)"
```

**✅ Passou se:** A porcentagem ganha aumenta conforme a amizade sobe.

---

### 2. Teste de Visual do Estoque

**Passos:**
1. Entre na loja de qualquer NPC
2. Observe os itens disponíveis

**Resultado Esperado:**
- Banner colorido verde com "📦 Estoque: XX"
- Número do estoque em **negrito** e maior que texto normal
- Se estoque = 0, banner fica vermelho

**✅ Passou se:** Visual está bonito e número destaca bem.

---

### 3. Teste de Desconto (50% no máximo)

**Passos:**
1. Use o console do navegador (F12)
2. Digite: `game.npcsUI.npcsData.old_farmer.friendship = 100`
3. Vá na loja do Fazendeiro José
4. Observe os preços

**Resultado Esperado:**
- Preço original riscado
- Novo preço com 50% de desconto
- Ícone 💝 ao lado do preço com desconto

**Exemplo:**
```
Semente de Trigo:
Antes: 10g (riscado)
Agora: 5g 💝 (em vermelho)
```

**✅ Passou se:** Desconto é exatamente 50% com amizade 100%.

---

## 🕐 Testes Médios (15 minutos)

### 4. Teste de Persistência do Estoque

**Passos:**
1. Entre na loja do Fazendeiro José
2. Compre 50 sementes de trigo (estoque vai para 50)
3. Feche o modal da loja
4. Pressione F5 para recarregar a página
5. Entre novamente na loja do Fazendeiro José

**Resultado Esperado:**
- Estoque ainda está em 50 (não volta para 100)
- Sistema lembra da sua compra

**✅ Passou se:** Estoque persiste após reload.

---

### 5. Teste de Regeneração em Tempo Real

**Passos:**
1. Compre 30 itens de qualquer NPC (estoque: 70/100)
2. Deixe a loja aberta
3. Aguarde 1 minuto
4. Observe o número do estoque

**Resultado Esperado:**
- Após 1 minuto: estoque = 71
- Após 2 minutos: estoque = 72
- E assim por diante até 100

**Console mostra:** `🔄 NPCs stock restored: +X items`

**✅ Passou se:** Estoque regenera 1 item por minuto automaticamente.

---

### 6. Teste de Regeneração Offline

**Passos:**
1. Compre 50 sementes (estoque: 50/100)
2. Salve o jogo
3. Feche completamente o navegador
4. Aguarde 5 minutos (tome um café ☕)
5. Abra o jogo novamente
6. Vá na loja

**Resultado Esperado:**
- Estoque deve estar em ~55 (5 minutos = 5 itens)
- Console mostra: `🔄 Restored X item_id for npc_id`

**✅ Passou se:** Sistema calcula tempo offline e regenera estoque.

---

## 🌙 Testes Longos (24h+)

### 7. Teste de Decay de Amizade

**Método 1 - Manipulação de Timestamp (Rápido):**
```javascript
// No console do navegador (F12):
const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
game.player.data.npcLastInteraction.old_farmer = oneDayAgo;
game.player.save();

// Aguarde 1 minuto ou force decay:
game.npcsUI.decayFriendship();
```

**Método 2 - Teste Real (24h):**
1. Interaja com um NPC hoje
2. Anote a amizade atual (ex: 50%)
3. Não interaja por 24 horas
4. Volte amanhã e verifique

**Resultado Esperado:**
- Amizade diminui 1% por dia
- Console mostra: `💔 npc_id friendship decayed by 1% (1 days passed)`

**✅ Passou se:** Amizade decai 1% a cada 24h sem interação.

---

## 🔧 Testes Técnicos (Desenvolvedores)

### 8. Teste de Memory Leaks

**Passos:**
1. Abra DevTools > Performance
2. Grave por 1 minuto
3. Navegue entre telas (Farm > NPCs > City)
4. Pare gravação

**Resultado Esperado:**
- Nenhum timer órfão
- Memória estável
- Timers limpam no `destroy()`

**✅ Passou se:** Sem vazamento de memória.

---

### 9. Teste de Fallbacks

**Teste dados corrompidos:**
```javascript
// Console:
delete game.player.data.npcStock;
delete game.player.data.npcStockTimestamp;
game.npcsUI.loadNPCStock();
```

**Resultado Esperado:**
- Sistema recria dados
- Não dá erro
- Estoque volta aos valores padrão

**✅ Passou se:** Sistema é robusto e lida com dados ausentes.

---

### 10. Teste de Cálculos

**Fórmula de Desconto:**
```javascript
// Deve ser linear de 0% a 50%
const testDiscount = (friendship, max) => {
  return (friendship / max) * 0.5 * 100;
};

console.log(testDiscount(0, 100));    // 0%
console.log(testDiscount(25, 100));   // 12.5%
console.log(testDiscount(50, 100));   // 25%
console.log(testDiscount(75, 100));   // 37.5%
console.log(testDiscount(100, 100));  // 50%
```

**✅ Passou se:** Todos os valores conferem.

---

## 📊 Checklist Completo

### Visual
- [ ] Banner de estoque aparece corretamente
- [ ] Número em negrito e destaque
- [ ] Cores mudam (verde/vermelho)
- [ ] Desconto mostra preço riscado
- [ ] Ícone 💝 aparece com desconto

### Funcionalidade
- [ ] Ganho progressivo de amizade funciona (1-2-3-5%)
- [ ] Decay de 1% por 24h funciona
- [ ] Estoque persiste após reload
- [ ] Regeneração em tempo real (1/min)
- [ ] Regeneração offline calcula corretamente
- [ ] Desconto escala de 0% a 50%

### Persistência
- [ ] Amizade salva no localStorage
- [ ] Estoque salva no localStorage
- [ ] Timestamps salvam corretamente
- [ ] Última interação rastreia timestamp

### Performance
- [ ] Sem lag ao abrir loja
- [ ] Timers não causam problemas
- [ ] Cleanup funciona ao sair
- [ ] Cálculos são rápidos

### Robustez
- [ ] Fallbacks funcionam
- [ ] Dados corrompidos não quebram
- [ ] Validações previnem erros
- [ ] Console sem erros

---

## 🎮 Comandos Úteis (Console)

```javascript
// Ver dados do player
console.log(game.player.data.npcs);
console.log(game.player.data.npcStock);
console.log(game.player.data.npcLastInteraction);

// Testar amizade máxima
game.npcsUI.npcsData.old_farmer.friendship = 100;
game.npcsUI.saveNPCFriendship();

// Testar estoque zerado
game.npcsUI.npcsData.old_farmer.shop.items[0].stock = 0;
game.npcsUI.saveNPCStock();

// Forçar regeneração
game.npcsUI.restoreStock();

// Forçar decay
game.npcsUI.decayFriendship();

// Ver desconto atual
const discount = game.npcsUI.getFriendshipDiscount('old_farmer');
console.log(`Desconto: ${discount * 100}%`);
```

---

## 🐛 Problemas Conhecidos

**Nenhum no momento!** 🎉

Se encontrar algum bug, reporte com:
1. Passos para reproduzir
2. Resultado esperado
3. Resultado obtido
4. Console logs (F12)

---

## ✅ Resultado Esperado Geral

Após todos os testes, você deve ter:
- ✅ Sistema de amizade dinâmico e progressivo
- ✅ Estoque persistente e regenerativo
- ✅ Descontos generosos (até 50%)
- ✅ Interface visual melhorada
- ✅ Sistema robusto sem bugs

---

## 🎯 Casos de Uso Reais

### Cenário 1: Fazendeiro Casual
```
Dia 1: Conversa com José (+1%), compra 20 sementes
Dia 2: Esquece de jogar
Dia 3: Volta, amizade decaiu -1%, estoque regenerou
```

### Cenário 2: Fazendeiro Dedicado
```
Semana 1: Conversa diário, atinge 75% amizade
Semana 2: Ganha +5% por conversa, atinge 100%
Resultado: Preços 50% mais baratos!
```

### Cenário 3: Compra em Massa
```
Compra 80 sementes de uma vez
Estoque: 20/100
Aguarda 1 hora = +60 estoque
Nova compra possível
```

---

🌾 **Boa sorte nos testes!** 🌾

Se tudo passar, o sistema está perfeito! 🎉