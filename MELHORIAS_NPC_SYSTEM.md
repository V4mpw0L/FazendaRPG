# 🎮 Melhorias do Sistema de NPCs - FazendaRPG

## 📋 Resumo das Alterações

Este documento detalha todas as melhorias implementadas no sistema de NPCs do FazendaRPG.

---

## ✨ Funcionalidades Implementadas

### 1. 💔 Sistema de Decay de Amizade

**Descrição:** A amizade com NPCs agora diminui com o tempo se você não interagir com eles.

**Mecânica:**
- A amizade decai **1% a cada 24 horas** sem interação
- O sistema verifica o tempo desde a última interação
- Decay é calculado automaticamente ao carregar o jogo
- Timer verifica o decay a cada 60 segundos

**Implementação:**
- Novo campo: `player.data.npcLastInteraction[npcId]` (timestamp)
- Função: `decayFriendship()` - calcula e aplica o decay
- Função: `startFriendshipDecay()` - inicia o timer de verificação

**Exemplo:**
```
Última interação: 3 dias atrás
Decay aplicado: -3% de amizade
```

---

### 2. 📈 Sistema de Ganho Progressivo de Amizade

**Descrição:** Quanto maior a amizade, mais % você ganha por conversa!

**Níveis de Ganho:**
- **0-25% de amizade:** +1% por conversa
- **25-50% de amizade:** +2% por conversa
- **50-75% de amizade:** +3% por conversa
- **75-100% de amizade:** +5% por conversa

**Benefícios:**
- Sistema mais dinâmico e recompensador
- Incentiva continuar interagindo após alcançar níveis médios
- Feedback visual mostra quanto foi ganho

**Implementação:**
- Função atualizada: `increaseFriendship(npcId)` 
- Retorna o valor ganho para exibição
- Calcula dinamicamente baseado no % atual

---

### 3. 🛒 Sistema de Estoque Robusto e Persistente

**Descrição:** O estoque agora é salvo corretamente e regenera com o tempo de forma realista.

**Características:**
- **Persistência:** Estoque é salvo no `localStorage` com timestamps
- **Regeneração Temporal:** +1 item por minuto até o máximo
- **Cálculo Offline:** Ao voltar ao jogo, calcula quanto regenerou
- **Fallbacks:** Sistema robusto com verificações de segurança

**Mecânica:**
```
Exemplo:
- Você compra 50 sementes (estoque: 50/100)
- Sai do jogo por 30 minutos
- Ao voltar: estoque restaurado para 80/100
- Sistema continuará regenerando até 100
```

**Implementação:**
- Novo campo: `player.data.npcStockTimestamp[npcId][itemId]`
- Novo campo: `player.data.npcStock[npcId][itemId]`
- Função: `restoreStock()` - restaura baseado no tempo
- Função: `loadNPCStock()` - carrega e calcula regeneração offline
- Timer: verifica e restaura a cada 10 segundos

---

### 4. 💰 Sistema de Desconto Ajustado (0% a 50%)

**Descrição:** Desconto por amizade aumentado de 20% para 50% no máximo!

**Escala Linear:**
- **0% amizade:** 0% desconto
- **25% amizade:** 12.5% desconto
- **50% amizade:** 25% desconto
- **75% amizade:** 37.5% desconto
- **100% amizade:** 50% desconto

**Fórmula:**
```javascript
desconto = (amizade / maxAmizade) * 0.5
```

**Benefícios:**
- Recompensa muito maior por amizade máxima
- Incentiva players a investirem em relacionamentos
- Torna NPCs mais valiosos estrategicamente

---

### 5. 🎨 Interface Visual Melhorada

**Estoque com Banner:**
- Banner colorido destacando o estoque
- Verde quando há estoque disponível
- Vermelho quando esgotado
- Número em **negrito** e maior
- Ícone de caixa (📦)

**Exemplo Visual:**
```
┌─────────────────────┐
│ 📦 Estoque: 87     │ <- Banner verde com gradiente
└─────────────────────┘
```

**Feedback de Amizade:**
- Notificação mostra quanto de amizade foi ganho
- Mensagem especial ao atingir 100%
- Visual atualizado com porcentagens corretas

---

## 🔧 Detalhes Técnicos

### Novos Campos de Dados do Player

```javascript
{
  npcs: {
    "npc_id": 50  // Nível de amizade (0-100)
  },
  npcLastInteraction: {
    "npc_id": 1234567890123  // Timestamp da última interação
  },
  npcStock: {
    "npc_id": {
      "item_id": 87  // Estoque atual
    }
  },
  npcStockTimestamp: {
    "npc_id": {
      "item_id": 1234567890123  // Timestamp da última atualização
    }
  }
}
```

### Timers Implementados

1. **Stock Restoration Timer:** 
   - Intervalo: 10 segundos
   - Função: `restoreStock()`
   - Propósito: Regenerar estoque baseado no tempo

2. **Friendship Decay Timer:**
   - Intervalo: 60 segundos
   - Função: `decayFriendship()`
   - Propósito: Aplicar decay de amizade

### Funções Principais Modificadas

- `getFriendshipDiscount()` - Agora retorna até 50%
- `increaseFriendship()` - Sistema progressivo implementado
- `restoreStock()` - Regeneração temporal
- `loadNPCStock()` - Carrega e calcula offline regeneration
- `saveNPCStock()` - Salva com timestamps

### Funções Novas

- `startFriendshipDecay()` - Inicia timer de decay
- `decayFriendship()` - Aplica decay baseado no tempo

---

## 📊 Comparação Antes/Depois

| Característica | Antes | Depois |
|---------------|-------|--------|
| Ganho de Amizade | Fixo: +1% | Progressivo: +1% a +5% |
| Decay de Amizade | ❌ Não existia | ✅ -1% por dia sem interação |
| Desconto Máximo | 20% | 50% |
| Persistência de Estoque | ❌ Resetava ao recarregar | ✅ Persiste e regenera |
| Regeneração Offline | ❌ Não calculava | ✅ Calcula tempo offline |
| Visual do Estoque | Texto simples | Banner colorido + bold |
| Feedback Visual | Básico | Detalhado com % ganho |

---

## 🎯 Estratégias para Players

### Maximizando Amizade:
1. Converse diariamente com NPCs importantes
2. Compre itens para ganhar amizade extra
3. Foque em NPCs de 75%+ para ganhos rápidos
4. Não deixe passar mais de 3 dias sem interagir

### Gerenciamento de Estoque:
1. Planeje compras grandes com antecedência
2. Estoque regenera 1 item/minuto (60 itens/hora)
3. Máximo de 100 itens por produto
4. Monitore o estoque antes de compras em massa

### Descontos Estratégicos:
1. 50% amizade = 25% desconto (já vale a pena!)
2. 75% amizade = 37.5% desconto (ótimo retorno)
3. 100% amizade = 50% desconto (metade do preço!)

---

## 🐛 Testes e Validações

### Checklist de Testes:

- [x] Amizade persiste após recarregar página
- [x] Decay aplica corretamente após tempo offline
- [x] Ganho progressivo funciona em todos os níveis
- [x] Estoque salva e carrega corretamente
- [x] Regeneração offline calcula tempo correto
- [x] Desconto de 50% aplica corretamente
- [x] Banner de estoque exibe cores corretas
- [x] Timers não causam memory leaks
- [x] Fallbacks funcionam se dados não existem
- [x] Performance otimizada (sem lag)

---

## 📝 Notas de Implementação

### Otimizações:
- Timers usam `setInterval` controlado
- Cleanup adequado no método `destroy()`
- Cálculos em lote para performance
- Timestamps em milissegundos para precisão

### Segurança:
- Validações de dados existentes
- Fallbacks para dados ausentes
- Inicialização segura de objetos
- Prevenção de valores negativos

### Escalabilidade:
- Sistema suporta número ilimitado de NPCs
- Fácil ajuste de taxas (decay, regeneração, ganho)
- Configurável via dados do NPC
- Extensível para futuros recursos

---

## 🚀 Versão

**Versão:** 0.0.14
**Data:** 2024
**Autor:** v1k3rn + AI Assistant

---

## 📚 Referências

- Arquivo modificado: `/js/ui/NPCSUI.js`
- Dados dos NPCs: `/data/npcs.json`
- Sistema de Player: `/js/core/Player.js`

---

## 🎉 Conclusão

O sistema de NPCs agora está muito mais robusto, dinâmico e recompensador! 

**Principais Benefícios:**
- ✅ Mais imersivo (decay cria senso de manutenção)
- ✅ Mais recompensador (50% de desconto!)
- ✅ Mais confiável (estoque persiste corretamente)
- ✅ Mais visual (interface melhorada)
- ✅ Mais estratégico (decisões sobre quem priorizar)

**Próximos Passos Possíveis:**
- Eventos especiais de NPCs
- Presentes para aumentar amizade
- Diálogos especiais em níveis altos
- Quests desbloqueadas por amizade
- NPCs com personalidades únicas

---

🌾 **FazendaRPG - Cultivando Amizades!** 🌾