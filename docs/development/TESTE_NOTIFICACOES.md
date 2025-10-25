# 🔔 Guia de Teste - Notificações em Background

## ✅ O que foi implementado:

1. **Service Worker com verificação periódica a cada 15 segundos**
2. **IndexedDB para persistir notificações** (sobrevive ao app fechar)
3. **Heartbeat para manter o SW ativo**
4. **Notificações funcionam com app FECHADO**

---

## 🧪 Como Testar:

### 1️⃣ Preparação:

```bash
cd FazendaRPG
python3 -m http.server 8000
```

Acesse: `http://localhost:8000`

### 2️⃣ Ativar Notificações:

1. Abra o jogo
2. Vá em **Configurações** (⚙️)
3. Ative **"Ativar Notificações"**
4. Aceite a permissão do navegador

### 3️⃣ Plantar uma Cultura Rápida:

1. Vá para a **Fazenda** 🌾
2. Plante **Trigo** (60 segundos para crescer)
3. Observe no console:
   ```
   📅 Notificação agendada: 🌾 Colheita Pronta! para [timestamp]
   💾 Notificação salva em IndexedDB para disparo em background
   ⚠️ IMPORTANTE: Notificação será disparada MESMO COM APP FECHADO
   ```

### 4️⃣ Testar com App FECHADO:

**IMPORTANTE:** Para testar de verdade:

1. ✅ **FECHE a aba do navegador completamente**
2. ✅ Espere 60 segundos
3. ✅ A notificação deve aparecer MESMO com o navegador fechado!

### 5️⃣ Verificar nos Logs (DevTools):

Antes de fechar, abra o console e veja:

```javascript
// Verificar notificações agendadas
navigator.serviceWorker.ready.then(reg => {
  const channel = new MessageChannel();
  channel.port1.onmessage = (event) => {
    console.log('📋 Notificações agendadas:', event.data.notifications);
  };
  reg.active.postMessage({ type: 'GET_SCHEDULED_NOTIFICATIONS' }, [channel.port2]);
});
```

---

## 📱 Testar no Celular (Método Real):

### Opção 1: ngrok (mais fácil)

```bash
# Terminal 1
python3 -m http.server 8000

# Terminal 2
ngrok http 8000
```

Acesse a URL do ngrok no celular.

### Opção 2: Mesma rede WiFi

```bash
# Descubra seu IP
hostname -I   # Linux/Mac
ipconfig      # Windows

# Acesse no celular:
http://SEU_IP:8000
```

### Teste no Celular:

1. Abra o jogo no navegador móvel
2. Ative notificações
3. Plante trigo (60s)
4. **FECHE o navegador completamente** (não só minimize)
5. **Trave a tela do celular**
6. Aguarde 60 segundos
7. ✅ **NOTIFICAÇÃO DEVE APARECER NA TELA DE BLOQUEIO!**

---

## 🔍 Logs Importantes:

### No Console do App:

```
📅 Notificação agendada para Trigo em 60s
💾 Notificação salva em IndexedDB para disparo em background
⚠️ IMPORTANTE: Notificação será disparada MESMO COM APP FECHADO
```

### No Console do Service Worker:

Para ver logs do SW:

1. Chrome: `chrome://serviceworker-internals/`
2. Edge: `edge://serviceworker-internals/`
3. Ou DevTools → Application → Service Workers → "Inspect"

```
✅ Service Worker ativado - verificando notificações...
✅ Verificação periódica ativada (15s) + heartbeat
🔄 Verificação periódica de notificações (background)
🔔 Disparando notificação: 🌾 Colheita Pronta!
🔔 ✅ NOTIFICAÇÃO BACKGROUND FUNCIONANDO! App FECHADO: 🌾 Colheita Pronta!
```

---

## 🐛 Troubleshooting:

### ❌ Notificação não aparece com app fechado:

**Possíveis causas:**

1. **Permissão negada:**
   - Chrome: `chrome://settings/content/notifications`
   - Verifique se o site tem permissão

2. **Service Worker desativado:**
   - DevTools → Application → Service Workers
   - Deve estar "activated and is running"

3. **Navegador não suporta notificações em background:**
   - ✅ Chrome/Edge: FUNCIONA
   - ✅ Firefox: FUNCIONA
   - ❌ Safari: Limitado (iOS 16.4+ apenas)

4. **Battery Saver ativo no celular:**
   - Desative o modo economia de bateria
   - Permita que o navegador rode em background

### ❌ "Service Worker not supported":

- Normal no iOS < 16.4
- Use Chrome/Edge no Android para testar

### 🔧 Resetar tudo:

```javascript
// No console do navegador:
window.clearCacheAndReload()
```

Ou manualmente:
1. DevTools → Application → Storage
2. "Clear site data"
3. Recarregue a página

---

## ✅ Checklist Final:

- [ ] Notificações ativadas nas configurações do jogo
- [ ] Permissão concedida no navegador
- [ ] Service Worker ativo (verde no DevTools)
- [ ] Cultura plantada (trigo = 60s)
- [ ] Console mostra "Notificação salva em IndexedDB"
- [ ] **APP FECHADO completamente**
- [ ] Aguardou o tempo necessário
- [ ] **NOTIFICAÇÃO APARECEU!** 🎉

---

## 📊 Comportamento Esperado:

| Situação | Notificação Aparece? |
|----------|---------------------|
| App aberto e visível | ✅ SIM |
| App em outra aba | ✅ SIM |
| Navegador minimizado | ✅ SIM |
| **Navegador FECHADO** | **✅ SIM!** |
| Celular com tela travada | ✅ SIM |
| Modo avião | ❌ Não (precisa internet) |

---

## 🎯 Sistema de Verificação:

O Service Worker verifica notificações pendentes:

1. **A cada 15 segundos** automaticamente
2. **Quando o app abre**
3. **Quando o SW é ativado**
4. **Quando recebe uma mensagem**

**Isso garante que a notificação seja disparada mesmo que:**
- O usuário feche o app
- O celular esteja travado
- O navegador esteja em background

---

## 💡 Dicas:

- **Teste primeiro com 60s (trigo)** - mais rápido
- **Não use DevTools aberto** ao fechar o app (pode manter SW ativo artificialmente)
- **No celular, feche o navegador completamente** (não só troque de app)
- **Verifique as configurações do celular** para permitir notificações do navegador

---

## 🚀 Funciona em Produção?

✅ **SIM!** Quando você fizer deploy no GitHub Pages:

1. O PWA funcionará normalmente
2. Service Worker será instalado
3. Notificações funcionarão em background
4. Usuários podem instalar o app na home screen

**Importante:** HTTPS é obrigatório para notificações (GitHub Pages já tem)

---

## 📝 Notas Técnicas:

- **Verificação:** 15 segundos (agressiva para confiabilidade)
- **Storage:** IndexedDB (persiste após fechar)
- **Heartbeat:** Fetch a cada verificação (mantém SW vivo)
- **Buffer:** 5 segundos de tolerância para disparar

---

**Qualquer dúvida, verifique os logs do Service Worker!** 🔍