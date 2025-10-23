# Sistema de Eventos - FazendaRPG

Sistema modular para gerenciar eventos sazonais no jogo (Halloween, Natal, Páscoa, etc).

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [EventManager](#eventmanager)
- [HalloweenEvent](#halloweenevent)
- [Como Usar](#como-usar)
- [Criar Novo Evento](#criar-novo-evento)
- [Comandos de Debug](#comandos-de-debug)

## 🎯 Visão Geral

O sistema de eventos permite criar e gerenciar eventos sazonais de forma modular e independente. Cada evento pode ter suas próprias mecânicas, decorações e recompensas.

### Características

- ✅ Sistema totalmente modular
- ✅ Fácil adicionar novos eventos
- ✅ Eventos podem ser ativados/desativados dinamicamente
- ✅ Persistência de eventos ativos no localStorage
- ✅ Integração com sistema de recompensas (energia, ouro, itens)
- ✅ Decorações visuais independentes por evento

## 🏗️ Arquitetura

```
js/systems/events/
├── EventManager.js      # Gerenciador principal de eventos
├── HalloweenEvent.js    # Evento de Halloween
└── [outros eventos...]  # Natal, Páscoa, etc (futuros)
```

### Fluxo de Funcionamento

1. **Inicialização**: `EventManager` é inicializado no `GameEngine`
2. **Registro**: Eventos são registrados no `EventManager`
3. **Ativação**: Eventos podem ser ativados/desativados dinamicamente
4. **Atualização**: Eventos ativos são atualizados no game loop
5. **Persistência**: Estado dos eventos é salvo no localStorage

## 📦 EventManager

Gerenciador central de todos os eventos do jogo.

### Métodos Principais

#### `registerEvent(eventName, eventInstance)`
Registra um novo evento no sistema.

```javascript
const halloweenEvent = new HalloweenEvent(gameEngine);
eventManager.registerEvent('halloween', halloweenEvent);
```

#### `startEvent(eventName)`
Inicia um evento registrado.

```javascript
eventManager.startEvent('halloween');
```

#### `stopEvent(eventName)`
Para um evento ativo.

```javascript
eventManager.stopEvent('halloween');
```

#### `isEventActive(eventName)`
Verifica se um evento está ativo.

```javascript
if (eventManager.isEventActive('halloween')) {
  console.log('Halloween está ativo!');
}
```

#### `listEvents()`
Lista todos os eventos registrados e seus estados.

```javascript
const events = eventManager.listEvents();
// Retorna: [{ name: 'halloween', active: true, description: '...', type: 'Halloween' }]
```

#### `stopAllEvents()`
Para todos os eventos ativos.

```javascript
eventManager.stopAllEvents();
```

### Persistência

O EventManager salva automaticamente quais eventos estão ativos no `localStorage`:

- **Chave**: `fazenda_active_events`
- **Formato**: Array de strings com nomes dos eventos ativos
- **Auto-load**: Eventos ativos são restaurados ao recarregar o jogo

## 🎃 HalloweenEvent

Evento temático de Halloween com mecânica de abóboras clicáveis.

### Características

- 🎃 Abóboras aparecem aleatoriamente na tela
- 🎯 Cliques ilimitados enquanto a abóbora estiver visível
- ⚡ +1 Energia por clique
- 💰 +1 Ouro por clique
- 🕸️ Decorações de teias de aranha nos cantos
- 🎨 Alterna entre 2 sprites de abóbora diferentes
- 🎭 Animações suaves e efeitos visuais

### Configurações

```javascript
config = {
  pumpkinSpawnInterval: 5000,    // 5s entre spawns
  pumpkinMinDuration: 8000,      // Mín 8s na tela
  pumpkinMaxDuration: 15000,     // Máx 15s na tela
  pumpkinMoveInterval: 2000,     // Move a cada 2s
  pumpkinSize: 80,               // Tamanho em pixels
  energyReward: 1,               // Energia por clique
  goldReward: 1,                 // Ouro por clique
  clicksPerPumpkin: Infinity     // Cliques ilimitados
}
```

### Assets Utilizados

- `assets/sprites/events/pumpkin2.png` - Sprite de abóbora 1
- `assets/sprites/events/pumpkin3.png` - Sprite de abóbora 2

### Decorações

Teias de aranha SVG nos 4 cantos da tela:
- Superior esquerdo
- Superior direito
- Inferior esquerdo
- Inferior direito

## 🚀 Como Usar

### No Código

```javascript
// Iniciar evento de Halloween
window.FazendaRPG.engine.startHalloween();

// Parar evento de Halloween
window.FazendaRPG.engine.stopHalloween();

// Listar todos os eventos
const events = window.FazendaRPG.engine.listEvents();
console.log(events);

// Acessar EventManager diretamente
const eventManager = window.FazendaRPG.engine.getEventManager();
```

### Via Console (Debug)

```javascript
// Iniciar Halloween
FazendaRPG.debug.startHalloween();

// Parar Halloween
FazendaRPG.debug.stopHalloween();

// Listar eventos
FazendaRPG.debug.listEvents();

// EventManager
const em = FazendaRPG.debug.getEventManager();
```

## 🔨 Criar Novo Evento

Para criar um novo evento (exemplo: Natal), siga este template:

### 1. Criar arquivo do evento

```javascript
// js/systems/events/ChristmasEvent.js
export default class ChristmasEvent {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.player = gameEngine.player;
    this.active = false;
    this.initialized = false;
    
    // Configurações
    this.config = {
      // ... suas configurações
    };
    
    // Metadados
    this.description = 'Evento de Natal - Descrição';
    this.type = 'Christmas';
  }

  /**
   * Inicializa o evento (chamado no registro)
   */
  init() {
    if (this.initialized) return;
    console.log('🎄 Inicializando ChristmasEvent...');
    // ... sua inicialização
    this.initialized = true;
  }

  /**
   * Inicia o evento
   */
  start() {
    if (this.active) return;
    console.log('🎄 Iniciando evento de Natal!');
    this.active = true;
    
    // Adicionar decorações
    this.addDecorations();
    
    // Iniciar mecânicas
    // ...
    
    // Notificação
    if (this.gameEngine.notificationManager) {
      this.gameEngine.notificationManager.show(
        '🎄 Evento de Natal Iniciado!',
        'Ho ho ho!',
        'success'
      );
    }
  }

  /**
   * Para o evento
   */
  stop() {
    if (!this.active) return;
    console.log('🎄 Parando evento de Natal...');
    this.active = false;
    
    // Remover decorações
    this.removeDecorations();
    
    // Parar mecânicas
    // ...
  }

  /**
   * Adiciona decorações
   */
  addDecorations() {
    // ... criar elementos visuais
  }

  /**
   * Remove decorações
   */
  removeDecorations() {
    // ... remover elementos visuais
  }

  /**
   * Update (opcional - chamado no game loop)
   */
  update(deltaTime) {
    // ... lógica de atualização
  }

  /**
   * Destroy - limpa recursos
   */
  destroy() {
    this.stop();
    this.initialized = false;
  }
}
```

### 2. Registrar no GameEngine

Edite `js/core/GameEngine.js`:

```javascript
// Import
import ChristmasEvent from "../systems/events/ChristmasEvent.js";

// No método init(), após registrar HalloweenEvent:
const christmasEvent = new ChristmasEvent(this);
this.eventManager.registerEvent("christmas", christmasEvent);
```

### 3. Adicionar métodos de atalho (opcional)

```javascript
// Em GameEngine.js
startChristmas() {
  return this.eventManager.startEvent("christmas");
}

stopChristmas() {
  return this.eventManager.stopEvent("christmas");
}
```

### 4. Adicionar comandos de debug (opcional)

```javascript
// Em app.js
window.FazendaRPG.debug = {
  // ...
  startChristmas: () => window.FazendaRPG.engine?.startChristmas(),
  stopChristmas: () => window.FazendaRPG.engine?.stopChristmas(),
};
```

## 🎮 Comandos de Debug

Comandos disponíveis no console para testar eventos:

```javascript
// GAMEENGINE (atalhos)
window.FazendaRPG.engine.startHalloween()     // Inicia Halloween
window.FazendaRPG.engine.stopHalloween()      // Para Halloween
window.FazendaRPG.engine.listEvents()         // Lista eventos
window.FazendaRPG.engine.getEventManager()    // Retorna EventManager

// DEBUG (versão curta)
FazendaRPG.debug.startHalloween()
FazendaRPG.debug.stopHalloween()
FazendaRPG.debug.listEvents()
FazendaRPG.debug.getEventManager()

// EVENTMANAGER (acesso direto)
const em = FazendaRPG.engine.getEventManager();
em.startEvent('halloween')
em.stopEvent('halloween')
em.isEventActive('halloween')
em.listEvents()
em.stopAllEvents()

// PLAYER (testar recompensas)
FazendaRPG.debug.addGold(100)
FazendaRPG.debug.setEnergy(50)
FazendaRPG.debug.getPlayer()
```

## 📊 Exemplos de Uso

### Ativar Halloween automaticamente em outubro

```javascript
// No GameEngine.init() ou start()
const currentMonth = new Date().getMonth();
if (currentMonth === 9) { // Outubro (0-indexed)
  this.startHalloween();
}
```

### Evento temporário com timer

```javascript
// Ativar por 1 hora
engine.startHalloween();
setTimeout(() => {
  engine.stopHalloween();
}, 60 * 60 * 1000);
```

### Verificar eventos ativos ao salvar

```javascript
// No SaveManager
const activeEvents = this.gameEngine.listEvents()
  .filter(e => e.active)
  .map(e => e.name);

console.log('Eventos ativos:', activeEvents);
```

## 🔧 Integração com Sistemas

### Recompensas

Eventos podem usar os métodos do Player:

```javascript
// Adicionar energia
this.player.addEnergy(amount);

// Adicionar ouro
this.player.addGold(amount);

// Adicionar XP
this.player.addXP(amount);

// Adicionar item
this.gameEngine.inventorySystem.addItem(itemId, amount);

// Atualizar UI
this.gameEngine.topBar.update();
```

### Notificações

```javascript
this.gameEngine.notificationManager.show(
  'Título',
  'Mensagem',
  'success' // ou 'info', 'warning', 'error'
);
```

### Quests

```javascript
// Verificar se quest está ativa
const quest = this.gameEngine.questSystem.getQuest(questId);

// Atualizar progresso
this.gameEngine.questSystem.updateQuestProgress(questId, amount);
```

## 📝 Boas Práticas

1. **Modularidade**: Cada evento deve ser independente
2. **Cleanup**: Sempre limpar recursos no `stop()` e `destroy()`
3. **Performance**: Evitar timers excessivos ou operações pesadas
4. **UX**: Notificar o jogador quando eventos iniciam/terminam
5. **Configurável**: Use objeto `config` para facilitar ajustes
6. **Visual**: Adicione decorações temáticas mas não intrusivas
7. **Recompensas**: Mantenha balanceamento do jogo
8. **Testes**: Use comandos de debug para testar antes de lançar

## 🐛 Troubleshooting

### Evento não inicia

```javascript
// Verificar se está registrado
const events = FazendaRPG.engine.listEvents();
console.log(events);

// Verificar erros
const em = FazendaRPG.engine.getEventManager();
console.log(em);
```

### Decorações não aparecem

```javascript
// Verificar z-index e position
// Decorações devem ter position: fixed e z-index alto
```

### Recompensas não funcionam

```javascript
// Verificar se TopBar está sendo atualizado
this.gameEngine.topBar.update();

// Verificar se Player existe
console.log(this.player);
```

## 📚 Referências

- `js/systems/events/EventManager.js` - Código do gerenciador
- `js/systems/events/HalloweenEvent.js` - Exemplo de evento completo
- `js/core/GameEngine.js` - Integração com engine
- `js/app.js` - Comandos de debug

---

**Versão**: 1.0.0  
**Última atualização**: 2024  
**Autor**: FazendaRPG Team