# 🎉 Sistema de Eventos - IMPLEMENTADO

Sistema modular de eventos sazonais para FazendaRPG está 100% funcional!

## ✅ O que foi implementado

### 🏗️ Arquitetura Modular

Criada estrutura completa em `js/systems/events/`:

```
js/systems/events/
├── EventManager.js      ✅ Gerenciador central de eventos
└── HalloweenEvent.js    ✅ Evento de Halloween completo
```

### 🎃 Evento de Halloween

**Características implementadas:**

- ✅ Abóboras aparecem aleatoriamente na tela
- ✅ Movimento aleatório a cada 2 segundos
- ✅ Cliques ilimitados enquanto estiver na tela
- ✅ **+1 Energia** por clique
- ✅ **+1 Ouro** por clique
- ✅ Alterna entre 2 sprites (`pumpkin2.png` e `pumpkin3.png`)
- ✅ Decorações de teias de aranha SVG nos 4 cantos
- ✅ Animações suaves (bounce, float)
- ✅ Efeito visual ao clicar mostrando recompensas
- ✅ Integração completa com Player e TopBar
- ✅ Notificações ao iniciar/parar evento

### 🎮 Integração com GameEngine

- ✅ EventManager inicializado no GameEngine
- ✅ HalloweenEvent registrado automaticamente
- ✅ Métodos de atalho: `startHalloween()`, `stopHalloween()`
- ✅ Comandos de debug disponíveis
- ✅ Cleanup automático ao destruir engine

### 💾 Persistência

- ✅ Estado dos eventos salvos no localStorage
- ✅ Eventos ativos são restaurados ao recarregar
- ✅ Chave: `fazenda_active_events`

## 🚀 Como Usar

### Iniciar Evento de Halloween

```javascript
// Via GameEngine
window.FazendaRPG.engine.startHalloween();

// Ou via debug
FazendaRPG.debug.startHalloween();

// Ou via EventManager
const em = FazendaRPG.engine.getEventManager();
em.startEvent('halloween');
```

### Parar Evento de Halloween

```javascript
// Via GameEngine
window.FazendaRPG.engine.stopHalloween();

// Ou via debug
FazendaRPG.debug.stopHalloween();

// Ou via EventManager
em.stopEvent('halloween');
```

### Listar Eventos

```javascript
FazendaRPG.debug.listEvents();
// Retorna: [{ name: 'halloween', active: true/false, description: '...', type: 'Halloween' }]
```

## 🎨 Recursos Visuais

### Assets Utilizados

- `./assets/sprites/events/pumpkin2.png` - Abóbora 1
- `./assets/sprites/events/pumpkin3.png` - Abóbora 2

### Decorações

- Teias de aranha SVG nos 4 cantos da tela
- Opacidade 0.6 para não interferir na jogabilidade
- Removidas automaticamente ao parar o evento

### Animações CSS

```css
@keyframes pumpkinBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

@keyframes floatUp {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-50px); }
}
```

## ⚙️ Configurações do Halloween

```javascript
config = {
  pumpkinSpawnInterval: 5000,    // 5 segundos entre spawns
  pumpkinMinDuration: 8000,      // Mínimo 8 segundos na tela
  pumpkinMaxDuration: 15000,     // Máximo 15 segundos na tela
  pumpkinMoveInterval: 2000,     // Move a cada 2 segundos
  pumpkinSize: 80,               // 80px de tamanho
  energyReward: 1,               // +1 energia por clique
  goldReward: 1,                 // +1 ouro por clique
  clicksPerPumpkin: Infinity     // Cliques ilimitados
}
```

## 🔧 Comandos de Debug Disponíveis

```javascript
// EVENTOS
FazendaRPG.debug.startHalloween()      // Inicia Halloween
FazendaRPG.debug.stopHalloween()       // Para Halloween
FazendaRPG.debug.listEvents()          // Lista todos os eventos
FazendaRPG.debug.getEventManager()     // Retorna EventManager

// PLAYER (testar recompensas)
FazendaRPG.debug.addGold(amount)       // Adiciona ouro
FazendaRPG.debug.addEnergy(amount)     // Adiciona energia (via setEnergy)
FazendaRPG.debug.addXP(amount)         // Adiciona XP
FazendaRPG.debug.getPlayer()           // Retorna dados do player
```

## 📦 Como Adicionar Novos Eventos

### 1. Criar arquivo do evento

```javascript
// js/systems/events/ChristmasEvent.js
export default class ChristmasEvent {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.player = gameEngine.player;
    this.active = false;
    this.initialized = false;
    
    this.description = 'Evento de Natal';
    this.type = 'Christmas';
  }

  init() { /* inicialização */ }
  start() { /* iniciar evento */ }
  stop() { /* parar evento */ }
  update(deltaTime) { /* atualização opcional */ }
  destroy() { /* cleanup */ }
}
```

### 2. Registrar no GameEngine

```javascript
// Em GameEngine.js, no método init():
import ChristmasEvent from "../systems/events/ChristmasEvent.js";

const christmasEvent = new ChristmasEvent(this);
this.eventManager.registerEvent("christmas", christmasEvent);
```

### 3. Adicionar métodos de atalho (opcional)

```javascript
// Em GameEngine.js:
startChristmas() {
  return this.eventManager.startEvent("christmas");
}

stopChristmas() {
  return this.eventManager.stopEvent("christmas");
}
```

### 4. Adicionar comandos de debug (opcional)

```javascript
// Em app.js:
window.FazendaRPG.debug = {
  // ...
  startChristmas: () => window.FazendaRPG.engine?.startChristmas(),
  stopChristmas: () => window.FazendaRPG.engine?.stopChristmas(),
};
```

## 🎯 Recursos do EventManager

### Métodos Principais

- `registerEvent(name, instance)` - Registra novo evento
- `unregisterEvent(name)` - Remove evento
- `startEvent(name)` - Inicia evento
- `stopEvent(name)` - Para evento
- `isEventActive(name)` - Verifica se está ativo
- `listEvents()` - Lista todos os eventos
- `getEvent(name)` - Retorna instância do evento
- `stopAllEvents()` - Para todos os eventos
- `update(deltaTime)` - Atualiza eventos ativos
- `destroy()` - Cleanup completo

### Métodos de Persistência

- `saveActiveEvents()` - Salva no localStorage
- `loadActiveEvents()` - Carrega do localStorage
- `clearEventData()` - Limpa dados salvos

## 🧪 Testando o Sistema

### Teste Básico

```javascript
// 1. Iniciar Halloween
FazendaRPG.debug.startHalloween();

// 2. Verificar se está ativo
FazendaRPG.debug.listEvents();
// Deve mostrar: active: true

// 3. Clicar nas abóboras que aparecem
// Deve ganhar +1 energia e +1 ouro a cada clique

// 4. Verificar energia/ouro
FazendaRPG.debug.getPlayer();

// 5. Parar Halloween
FazendaRPG.debug.stopHalloween();
```

### Teste de Persistência

```javascript
// 1. Iniciar evento
FazendaRPG.debug.startHalloween();

// 2. Recarregar página (F5)

// 3. Verificar se evento continua ativo
FazendaRPG.debug.listEvents();
// Deve mostrar: active: true (restaurado do localStorage)
```

## 📊 Integração com Sistemas Existentes

### Player

- Usa `addEnergy()` e `addGold()` do Player
- Integra com TopBar para atualização

### NotificationManager

- Mostra notificações ao iniciar/parar eventos
- Usa sistema existente de notificações

### LocalStorage

- Salva automaticamente eventos ativos
- Restaura ao recarregar o jogo
- Chave: `fazenda_active_events`

## 🎨 Boas Práticas Implementadas

- ✅ **Modularidade**: Cada evento é independente
- ✅ **Cleanup**: Recursos são limpos ao parar
- ✅ **Performance**: Timers otimizados
- ✅ **UX**: Notificações e feedback visual
- ✅ **Configurável**: Fácil ajustar parâmetros
- ✅ **Responsivo**: Funciona em qualquer resolução
- ✅ **Não intrusivo**: Decorações nos cantos
- ✅ **Balanceado**: Recompensas ajustadas

## 📝 Próximos Passos (Sugestões)

### Eventos Futuros

- 🎄 **Natal**: Presentes que aparecem, decorações natalinas
- 🐰 **Páscoa**: Ovos escondidos pela fazenda
- 🎆 **Ano Novo**: Fogos de artifício, bônus temporários
- 🌸 **Primavera**: Flores especiais, bônus de crescimento
- 🍂 **Outono**: Colheita em dobro, decorações outonais

### Melhorias Possíveis

- [ ] Sistema de achievements por evento
- [ ] Itens exclusivos de eventos
- [ ] Loja temporária de eventos
- [ ] Ranking/leaderboard de eventos
- [ ] Eventos com duração programada (início/fim automático)
- [ ] Sons e música temática por evento
- [ ] Partículas e efeitos visuais avançados
- [ ] Quests exclusivas de eventos

## 📚 Documentação

Documentação completa disponível em:
- `docs/EVENTOS.md` - Guia completo do sistema de eventos

## 🐛 Troubleshooting

### Abóbora não aparece

```javascript
// Verificar se evento está ativo
FazendaRPG.debug.listEvents();

// Verificar console para erros
// Abrir DevTools > Console
```

### Recompensas não funcionam

```javascript
// Verificar TopBar
console.log(FazendaRPG.engine.topBar);

// Verificar Player
console.log(FazendaRPG.debug.getPlayer());
```

### Decorações não aparecem

- Verificar z-index (deve ser 9998+)
- Verificar position: fixed
- Verificar se evento está ativo

## ✨ Conclusão

Sistema de eventos totalmente funcional e pronto para uso! Basta executar:

```javascript
FazendaRPG.debug.startHalloween();
```

E aproveitar o evento de Halloween! 🎃

---

**Status**: ✅ 100% Implementado e Funcional  
**Versão**: 1.0.0  
**Data**: 2024  
**Próximas Atualizações**: Novos eventos sazonais