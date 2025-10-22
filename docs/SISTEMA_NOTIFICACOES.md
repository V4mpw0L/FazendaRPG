# 🔔 Sistema de Notificações Push

> Sistema de notificações push para avisar sobre crops prontos no FazendaRPG PWA
> Versão: 0.0.9

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Como Funciona](#como-funciona)
3. [Como Usar](#como-usar)
4. [Instalação do PWA](#instalação-do-pwa)
5. [Testando](#testando)
6. [Troubleshooting](#troubleshooting)
7. [Limitações](#limitações)
8. [FAQ](#faq)

---

## 🎯 Visão Geral

O sistema de notificações push permite que você receba avisos **mesmo com o app fechado** quando seus crops estiverem prontos para colher!

### ✨ Características

- ✅ **Funciona em background**: Notifica mesmo com o app fechado
- ✅ **PWA**: Funciona como app instalado no celular
- ✅ **Inteligente**: Agenda automaticamente ao plantar
- ✅ **Personalizável**: Pode ativar/desativar quando quiser
- ✅ **Testável**: Botão de teste para verificar funcionamento
- ✅ **Multiplataforma**: Android, iOS (com limitações), Desktop

---

## 🔧 Como Funciona

### Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    FazendaRPG App                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Jogador planta crop                              │   │
│  │  ↓                                                 │   │
│  │  NotificationManager.scheduleCropNotification()   │   │
│  │  ↓                                                 │   │
│  │  Envia mensagem para Service Worker               │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  Service Worker (sw.js)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Recebe mensagem SCHEDULE_NOTIFICATION            │   │
│  │  ↓                                                 │   │
│  │  Agenda setTimeout() para hora certa              │   │
│  │  ↓                                                 │   │
│  │  Quando tempo acabar: showNotification()          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                Sistema Operacional                       │
│         Mostra notificação na tela/barra                 │
│         🔔 "🌾 Colheita Pronta!"                         │
│         "Seu trigo está pronto para ser colhido!"        │
└─────────────────────────────────────────────────────────┘
```

### Fluxo de Eventos

1. **Plantar**: Jogador planta um crop
2. **Agendar**: Sistema calcula tempo de crescimento e agenda notificação
3. **Esperar**: Service Worker aguarda em background
4. **Notificar**: No momento certo, mostra notificação
5. **Clicar**: Usuário clica e volta para o app

---

## 📱 Como Usar

### Passo 1: Instalar o PWA (Recomendado)

#### No Android (Chrome/Edge)

1. Abra o jogo no navegador
2. Toque no menu (⋮) → **"Adicionar à tela inicial"** ou **"Instalar app"**
3. Confirme a instalação
4. O ícone aparecerá na tela inicial
5. Abra pelo ícone (não pelo navegador)

#### No iOS (Safari)

1. Abra o jogo no Safari
2. Toque no botão **Compartilhar** (quadrado com seta)
3. Role e toque em **"Adicionar à Tela Início"**
4. Confirme
5. Abra pelo ícone

⚠️ **Nota iOS**: Notificações push têm limitações no iOS. Funciona melhor no Android.

#### No Desktop (Chrome/Edge)

1. Abra o jogo no navegador
2. Procure ícone de instalação na barra de endereço
3. Clique em **"Instalar"**
4. O app abrirá em janela própria

### Passo 2: Ativar Notificações

1. Abra o jogo (PWA instalado)
2. Vá em **⚙️ Configurações**
3. Na seção **"Notificações"**, clique em **"🔔 Ativar Notificações"**
4. O navegador pedirá permissão → Clique em **"Permitir"**
5. Você verá uma notificação de teste: *"Notificações ativadas!"*

### Passo 3: Testar (Opcional mas Recomendado)

1. Nas configurações, clique em **"🧪 Testar Notificação"**
2. Uma notificação aparecerá imediatamente
3. Se funcionou, está tudo certo! 🎉

### Passo 4: Usar Normalmente

1. Vá para a **🌾 Fazenda**
2. Plante seus crops normalmente
3. Feche o app
4. Quando o crop estiver pronto, receberá notificação!
5. Clique na notificação para voltar ao jogo

---

## 🧪 Testando

### Teste Rápido (5 segundos)

Para testar se está funcionando, use crops rápidos:

```javascript
// No console do navegador (F12):
// Agende notificação de teste para 5 segundos
game.notificationManager.scheduleNotification(
  'test-5s',
  '🌾 Teste Rápido',
  'Esta notificação aparecerá em 5 segundos!',
  Date.now() + 5000
);
```

Depois feche o app e aguarde 5 segundos!

### Teste com Crop Real

1. Ative as notificações
2. Plante um **Trigo** (cresce em 30 segundos)
3. Feche o app completamente
4. Aguarde 30 segundos
5. Receberá: *"🌾 Colheita Pronta! Seu Trigo está pronto para ser colhido!"*

---

## 🐛 Troubleshooting

### Não recebi nenhuma notificação

**Causa 1: Permissão não concedida**
- Solução: Vá em Configurações → Ativar Notificações
- Se já tentou, pode ter negado antes. Veja "Permissão Bloqueada" abaixo

**Causa 2: App não está instalado como PWA**
- Solução: Instale o app (ver Passo 1)
- Notificações funcionam melhor com PWA instalado

**Causa 3: Service Worker não está ativo**
- Solução: Feche e reabra o app
- Ou abra o Console (F12) e veja se há erros

**Causa 4: Modo economizador de bateria (Android)**
- Solução: Nas configurações do Android, desative economia de bateria para o app
- Ou adicione o app à lista de "Não otimizar"

### Permissão Bloqueada

Se você clicou em "Bloquear" por acidente:

**No Chrome/Edge (Android/Desktop):**
1. Toque no cadeado (🔒) ao lado da URL
2. Vá em **"Permissões"** → **"Notificações"**
3. Altere para **"Permitir"**
4. Recarregue a página
5. Tente ativar novamente

**No Safari (iOS):**
1. Vá em **Ajustes** do iPhone
2. Role até encontrar o Safari
3. Toque em **"Notificações"**
4. Ative para o site

### Notificação não aparece quando o app está aberto

Isso é **normal**! Notificações só aparecem quando o app está:
- Fechado completamente
- Minimizado
- Em background

Quando o app está aberto, você já está vendo os crops, então não precisa de notificação! 😊

### iOS: Funciona diferente

O iOS tem **limitações** no suporte a PWA:
- Service Workers têm menos recursos
- Notificações podem não funcionar em background
- Melhor usar no Android para esta funcionalidade

**Alternativa iOS**: Use o app aberto e confie no timer visual dos crops.

### Service Worker não está registrado

1. Abra o Console (F12)
2. Vá na aba **"Application"** (Chrome) ou **"Storage"** (Firefox)
3. Clique em **"Service Workers"**
4. Veja se `sw.js` está ativo
5. Se não, clique em **"Update"** ou recarregue a página

---

## 📊 Status de Notificações

Na tela de configurações, você verá um dos seguintes status:

| Status | Significado | Ação |
|--------|-------------|------|
| ✅ Notificações ativas (X agendadas) | Tudo funcionando! | Nada a fazer 🎉 |
| 🔕 Desativadas | Você desativou | Clique para ativar |
| ⚠️ Clique para permitir notificações | Ainda não autorizou | Clique no botão |
| ❌ Bloqueadas pelo navegador | Você bloqueou antes | Veja "Permissão Bloqueada" |

---

## ⚙️ Limitações Técnicas

### O que funciona ✅

- ✅ Notificações quando app está **fechado**
- ✅ Notificações quando app está **minimizado**
- ✅ Notificações quando tela está **bloqueada** (Android)
- ✅ Múltiplas notificações (uma por plot)
- ✅ Cancelamento automático ao colher
- ✅ Reagendar ao carregar save

### O que NÃO funciona ❌

- ❌ Notificações quando celular está **desligado**
- ❌ Notificações após **reiniciar o celular** (precisa reabrir o app uma vez)
- ❌ Notificações se o navegador/app for **forçado a fechar** pelo sistema
- ❌ Suporte completo no **iOS** (limitações do Safari)
- ❌ Notificações em **modo anônimo/privado**

### Observações Importantes

⚠️ **Service Worker Lifecycle**: 
- Se o sistema matar o Service Worker para economizar recursos, notificações agendadas podem ser perdidas
- Recomenda-se abrir o app periodicamente para reagendar

⚠️ **Precisão**:
- Notificações podem atrasar alguns segundos dependendo do sistema
- Geralmente a diferença é menor que 10 segundos

⚠️ **Bateria**:
- O sistema é otimizado para não consumir bateria
- Service Worker usa `setTimeout` que é muito eficiente

---

## 🎓 FAQ

### P: Preciso deixar o app aberto?
**R:** Não! Pode fechar completamente. As notificações funcionarão em background.

### P: E se eu reiniciar o celular?
**R:** Terá que abrir o app uma vez após reiniciar. Então as notificações voltarão a funcionar.

### P: Quantas notificações posso ter?
**R:** Uma para cada plot (até 9). Você verá quantas estão agendadas no status.

### P: A notificação faz barulho?
**R:** Sim, usa o som padrão de notificação do seu celular.

### P: Posso desativar temporariamente?
**R:** Sim! Vá em Configurações e clique em "🔕 Desativar Notificações". Pode reativar a qualquer momento.

### P: Funciona offline?
**R:** Sim! Como usa Service Worker, funciona mesmo sem internet após o primeiro carregamento.

### P: Consume muita bateria?
**R:** Não! O sistema usa apenas `setTimeout`, que é muito eficiente. O impacto na bateria é mínimo.

### P: Funciona no navegador ou só no PWA?
**R:** Funciona em ambos, mas é **mais confiável no PWA instalado**.

### P: E se eu desinstalar o app?
**R:** Todas as notificações agendadas serão canceladas automaticamente.

---

## 🔬 Para Desenvolvedores

### API do NotificationManager

```javascript
// Obter instância
const nm = game.notificationManager;

// Verificar se está ativo
nm.isEnabled(); // true/false

// Ativar
await nm.enable();

// Desativar
nm.disable();

// Agendar notificação customizada
nm.scheduleNotification(
  'my-notification',           // ID único
  '🎉 Título',                  // Título
  'Corpo da mensagem',         // Corpo
  Date.now() + 60000,          // Timestamp (1 minuto)
  { custom: 'data' }           // Dados extras (opcional)
);

// Cancelar notificação específica
nm.cancelNotification('my-notification');

// Cancelar todas
nm.cancelAllNotifications();

// Agendar notificação de crop
nm.scheduleCropNotification(
  0,              // Plot index
  'Trigo',        // Nome do crop
  Date.now() + 30000  // Quando estará pronto
);

// Cancelar notificação de crop
nm.cancelCropNotification(0);

// Ver quantas estão agendadas
nm.getScheduledCount(); // number

// Listar todas agendadas
nm.getScheduledNotifications(); // Array

// Testar notificação imediata
await nm.testNotification();
```

### Service Worker Messages

O sistema usa mensagens entre app e Service Worker:

```javascript
// Agendar
navigator.serviceWorker.controller.postMessage({
  type: 'SCHEDULE_NOTIFICATION',
  id: 'unique-id',
  title: 'Título',
  body: 'Corpo',
  timestamp: Date.now() + 60000,
  data: {}
});

// Cancelar
navigator.serviceWorker.controller.postMessage({
  type: 'CANCEL_NOTIFICATION',
  id: 'unique-id'
});

// Cancelar todas
navigator.serviceWorker.controller.postMessage({
  type: 'CANCEL_ALL_NOTIFICATIONS'
});
```

### Debug

```javascript
// No console (F12):

// Ver status
game.notificationManager.permission; // 'granted', 'denied', 'default'
game.notificationManager.enabled;    // true/false

// Ver notificações agendadas
console.table(game.notificationManager.getScheduledNotifications());

// Forçar atualização de todas
const plots = game.farmSystem.getPlots();
const cropsData = game.farmSystem.getCropsData();
game.notificationManager.updateCropNotifications(plots, cropsData);

// Ver info do Service Worker
navigator.serviceWorker.ready.then(reg => {
  console.log('Service Worker:', reg);
});
```

---

## 🚀 Futuro

Funcionalidades planejadas:

- ☐ Notificação de energia cheia
- ☐ Notificação de quest completa
- ☐ Notificação de evento especial
- ☐ Notificação de mercado (preços baixos)
- ☐ Customização de sons
- ☐ Agendamento inteligente (não notificar de madrugada)
- ☐ Resumo diário
- ☐ Notificações ricas (com imagem do crop)

---

## 📞 Suporte

### Reportar Problema

Se as notificações não estão funcionando:

1. Abra o Console (F12)
2. Vá em **Application** → **Service Workers**
3. Tire um print
4. Anote qual celular/navegador está usando
5. Descreva o problema detalhadamente

### Informações Úteis

```javascript
// Execute no console e copie o resultado:
console.log({
  permission: Notification.permission,
  swSupport: 'serviceWorker' in navigator,
  notificationSupport: 'Notification' in window,
  userAgent: navigator.userAgent,
  enabled: game.notificationManager.enabled,
  scheduled: game.notificationManager.getScheduledCount()
});
```

---

## 📝 Changelog

### v0.0.9 (Atual)
- ✨ Sistema de notificações push implementado
- ✨ Agendamento automático ao plantar crops
- ✨ Cancelamento automático ao colher
- ✨ Botão de teste nas configurações
- ✨ Status visual do sistema
- ✨ Suporte a PWA
- ✨ Documentação completa

---

**Documentação atualizada em**: 2024-01-15  
**Versão do Sistema**: 0.0.9  
**Autor**: FazendaRPG Team

**Aproveite as notificações e nunca mais perca uma colheita! 🌾🔔**