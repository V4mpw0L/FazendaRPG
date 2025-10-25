# 🎉 Como Ativar/Desativar Eventos - GUIA RÁPIDO

Gerenciamento super fácil de eventos no FazendaRPG via GitHub! ✨

## 🚀 RESUMO RÁPIDO

**Para ativar/desativar eventos para TODOS os jogadores:**

1. Edite **1 arquivo**: `js/systems/events/eventConfig.js`
2. Mude `enabled` e `autoStart` para `true` ou `false`
3. Faça commit e push
4. **PRONTO!** Todos terão o evento ativado/desativado automaticamente! 🎊

## 🎯 Arquivo de Configuração

📁 **Caminho**: `js/systems/events/eventConfig.js`

## 🚀 Como Ativar um Evento

### Passo 1: Abra o arquivo

```
js/systems/events/eventConfig.js
```

### Passo 2: Encontre o evento desejado

```javascript
halloween: {
  enabled: true,   // ← Aqui!
  autoStart: true, // ← E aqui!
},
```

### Passo 3: Mude os valores

- **`enabled: true`** = Evento disponível
- **`enabled: false`** = Evento desabilitado

- **`autoStart: true`** = Inicia automaticamente ao carregar o jogo
- **`autoStart: false`** = Só inicia se usar comando manual

### Passo 4: Salve e faça commit

```bash
git add js/systems/events/eventConfig.js
git commit -m "🎃 Ativar evento de Halloween"
git push
```

### Passo 5: Pronto! ✅

Todos que acessarem o jogo (GitHub Pages) terão o evento ativado automaticamente!

## 🎃 Exemplo: Ativar Halloween

```javascript
// js/systems/events/eventConfig.js

halloween: {
  enabled: true,   // ✅ Ativo
  autoStart: true, // ✅ Inicia automaticamente
},
```

**Commit**:
```bash
git commit -m "🎃 Ativar Halloween"
git push
```

## 🛑 Exemplo: Desativar Halloween

```javascript
// js/systems/events/eventConfig.js

halloween: {
  enabled: false,   // ❌ Desativado
  autoStart: false, // ❌ Não inicia
},
```

**Commit**:
```bash
git commit -m "🎃 Desativar Halloween"
git push
```

## 🎄 Exemplo: Múltiplos Eventos (Futuro)

```javascript
halloween: {
  enabled: true,   // 🎃 Halloween ATIVO
  autoStart: true,
},

christmas: {
  enabled: true,   // 🎄 Natal ATIVO
  autoStart: true,
},

easter: {
  enabled: false,  // 🐰 Páscoa DESATIVADO
  autoStart: false,
},
```

## 📊 Configurações Disponíveis

| Opção | Valores | Descrição |
|-------|---------|-----------|
| `enabled` | `true` / `false` | Se o evento está disponível no jogo |
| `autoStart` | `true` / `false` | Se inicia automaticamente ao carregar |

## 🔄 Combinações Possíveis

### 1. Evento ativo e automático (RECOMENDADO)
```javascript
enabled: true,
autoStart: true,
```
✅ Evento inicia sozinho ao carregar o jogo

### 2. Evento ativo mas manual
```javascript
enabled: true,
autoStart: false,
```
⚠️ Evento disponível mas precisa comando: `FazendaRPG.debug.startHalloween()`

### 3. Evento desativado
```javascript
enabled: false,
autoStart: false,
```
❌ Evento completamente desativado

## 🎮 Eventos Disponíveis

### 🎃 Halloween (IMPLEMENTADO)
- Abóboras aparecem na tela
- Clique para ganhar energia e ouro
- Decorações de teias de aranha

```javascript
halloween: {
  enabled: true,
  autoStart: true,
}
```

### 🎄 Natal (FUTURO)
```javascript
christmas: {
  enabled: false,  // Será implementado
  autoStart: false,
}
```

### 🐰 Páscoa (FUTURO)
```javascript
easter: {
  enabled: false,  // Será implementado
  autoStart: false,
}
```

### 🎆 Ano Novo (FUTURO)
```javascript
newYear: {
  enabled: false,  // Será implementado
  autoStart: false,
}
```

## 🌐 Fluxo de Trabalho (GitHub Pages)

### Para Ativar um Evento:

1. **Você edita** `eventConfig.js` localmente
2. **Você faz** `git commit` e `git push`
3. **GitHub Pages atualiza** automaticamente
4. **Seus amigos acessam** a página
5. **Evento inicia** automaticamente para eles! ✅

### Para Desativar um Evento:

1. **Você edita** `eventConfig.js` (muda para `false`)
2. **Você faz** `git commit` e `git push`
3. **GitHub Pages atualiza** automaticamente
4. **Seus amigos acessam** a página
5. **Evento está desativado** para todos! ✅

## ⏰ Ativação por Data (Automática - Futuro)

Se quiser que eventos ativem automaticamente por data:

```javascript
// Exemplo de como seria (futuro)
halloween: {
  enabled: true,
  autoStart: true,
  startDate: "2024-10-01",  // Inicia em 1º de outubro
  endDate: "2024-11-01",    // Termina em 1º de novembro
},
```

**Por enquanto**: Use apenas `enabled` e `autoStart`

## 🔧 Comandos Manuais (Opcional)

Se `autoStart: false`, use no console:

```javascript
// Iniciar
FazendaRPG.debug.startHalloween()

// Parar
FazendaRPG.debug.stopHalloween()

// Ver status
FazendaRPG.debug.listEvents()
```

## ❓ FAQ

### Como saber se funcionou?

Após fazer push, acesse o jogo e você verá:
- Notificação de evento iniciado
- Decorações na tela
- Mecânicas do evento funcionando

### E se meus amigos já estiverem jogando?

Eles precisam **recarregar a página (F5)** para pegar a nova versão.

### Posso testar localmente antes de fazer push?

Sim! Rode um servidor local e teste:
```bash
python -m http.server 8000
# ou
npx serve
```

### Como desativar temporariamente?

Mude apenas `autoStart` para `false`:
```javascript
halloween: {
  enabled: true,   // Continua disponível
  autoStart: false, // Mas não inicia sozinho
},
```

### Preciso limpar cache?

Geralmente não, mas se tiver problemas:
- **Ctrl + Shift + R** (hard reload)
- Ou **Ctrl + F5**

## 📁 Estrutura de Arquivos

```
FazendaRPG/
├── js/
│   └── systems/
│       └── events/
│           ├── eventConfig.js    ← EDITE AQUI!
│           ├── EventManager.js
│           └── HalloweenEvent.js
└── COMO_ATIVAR_EVENTOS.md        ← Este arquivo
```

## ✅ Checklist

Antes de fazer commit:

- [ ] Editei `js/systems/events/eventConfig.js`
- [ ] Mudei `enabled` e `autoStart` do evento desejado
- [ ] Salvei o arquivo
- [ ] Testei localmente (opcional)
- [ ] Fiz `git add`, `git commit`, `git push`
- [ ] Aguardei GitHub Pages atualizar (~1 min)
- [ ] Acessei o jogo e verifiquei que funcionou

## 🎉 Pronto!

Agora você pode gerenciar eventos facilmente para todos os jogadores!

---

**Dúvidas?** Veja também:
- `docs/EVENTOS.md` - Documentação completa
- `SISTEMA_EVENTOS_IMPLEMENTADO.md` - Detalhes técnicos
- `TESTE_HALLOWEEN.md` - Como testar eventos