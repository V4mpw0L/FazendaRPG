# 🎃 Comandos Git - Gerenciar Eventos

Comandos prontos para copiar e colar! 🚀

## ✅ Ativar Evento de Halloween

### 1. Edite o arquivo
```bash
# Abra o arquivo no editor
nano js/systems/events/eventConfig.js
# ou
code js/systems/events/eventConfig.js
```

### 2. Mude para:
```javascript
halloween: {
  enabled: true,   // ✅ ATIVO
  autoStart: true, // ✅ AUTOMÁTICO
},
```

### 3. Salve e execute:
```bash
git add js/systems/events/eventConfig.js
git commit -m "🎃 Ativar evento de Halloween"
git push origin main
```

---

## ❌ Desativar Evento de Halloween

### 1. Edite o arquivo
```bash
nano js/systems/events/eventConfig.js
```

### 2. Mude para:
```javascript
halloween: {
  enabled: false,   // ❌ DESATIVADO
  autoStart: false, // ❌ NÃO INICIA
},
```

### 3. Salve e execute:
```bash
git add js/systems/events/eventConfig.js
git commit -m "🎃 Desativar evento de Halloween"
git push origin main
```

---

## 🔄 Comandos Úteis

### Ver status atual
```bash
git status
```

### Ver diferenças antes de commitar
```bash
git diff js/systems/events/eventConfig.js
```

### Desfazer mudanças locais (antes de commit)
```bash
git checkout js/systems/events/eventConfig.js
```

### Ver últimos commits
```bash
git log --oneline -5
```

### Forçar push (use com cuidado!)
```bash
git push -f origin main
```

---

## 📋 Fluxo Completo (Passo a Passo)

### Cenário: Você quer ATIVAR o Halloween

```bash
# 1. Certifique-se que está na branch main
git checkout main

# 2. Puxe últimas alterações
git pull origin main

# 3. Edite o arquivo
nano js/systems/events/eventConfig.js
# Mude enabled e autoStart para true

# 4. Veja o que mudou
git diff js/systems/events/eventConfig.js

# 5. Adicione as mudanças
git add js/systems/events/eventConfig.js

# 6. Commit
git commit -m "🎃 Ativar evento de Halloween"

# 7. Push
git push origin main

# 8. PRONTO! GitHub Pages vai atualizar automaticamente
```

---

## 🎯 Mensagens de Commit Sugeridas

```bash
# Ativar Halloween
git commit -m "🎃 Ativar evento de Halloween"

# Desativar Halloween
git commit -m "🎃 Desativar evento de Halloween"

# Ativar para testes
git commit -m "🎃 Ativar Halloween para testes"

# Ajustar configurações
git commit -m "🎃 Ajustar configurações do evento de Halloween"

# Ativar múltiplos eventos
git commit -m "🎉 Ativar eventos de Halloween e Natal"
```

---

## ⚡ Comandos Rápidos (One-liner)

### Ativar Halloween (assumindo que já editou o arquivo)
```bash
git add js/systems/events/eventConfig.js && git commit -m "🎃 Ativar Halloween" && git push
```

### Verificar e commitar tudo de uma vez
```bash
git add . && git commit -m "🎃 Atualizar eventos" && git push
```

---

## 🆘 Resolução de Problemas

### Erro: "Updates were rejected"
```bash
# Puxe as alterações primeiro
git pull origin main

# Depois push novamente
git push origin main
```

### Erro: "Merge conflict"
```bash
# Veja os arquivos em conflito
git status

# Edite os arquivos manualmente para resolver
nano js/systems/events/eventConfig.js

# Adicione após resolver
git add js/systems/events/eventConfig.js

# Complete o merge
git commit -m "🔀 Resolver conflito em eventConfig"

# Push
git push origin main
```

### Erro: "Nothing to commit"
```bash
# Você não fez mudanças, verifique:
git status

# Se editou o arquivo, adicione:
git add js/systems/events/eventConfig.js
```

---

## 📱 Verificar Deploy no GitHub Pages

### Após fazer push:

1. Vá para o repositório no GitHub
2. Clique em **Actions** (se disponível)
3. Aguarde o deploy completar (~1-2 minutos)
4. Acesse seu site: `https://seu-usuario.github.io/FazendaRPG`
5. Recarregue a página (Ctrl+Shift+R)
6. Evento deve estar ativo! ✅

---

## 🎮 Testar Localmente Antes do Push

```bash
# Rode um servidor local
python -m http.server 8000
# ou
npx serve

# Acesse
# http://localhost:8000

# Teste o evento
# Abra console (F12) e digite:
# FazendaRPG.debug.listEvents()
```

---

## 📁 Estrutura de Arquivos

```
FazendaRPG/
├── js/
│   └── systems/
│       └── events/
│           ├── eventConfig.js         ← EDITE ESTE!
│           ├── eventConfig.example.js ← Exemplos
│           ├── EventManager.js
│           └── HalloweenEvent.js
└── COMANDOS_GIT_EVENTOS.md            ← Este arquivo
```

---

## ✅ Checklist Final

Antes de fazer push, verifique:

- [ ] Editei `eventConfig.js` (NÃO o `.example.js`)
- [ ] Salvei as alterações (Ctrl+S)
- [ ] Testei localmente (opcional)
- [ ] Executei `git add`
- [ ] Executei `git commit`
- [ ] Executei `git push`
- [ ] Aguardei GitHub Pages atualizar
- [ ] Testei no site online

---

## 🎊 Pronto!

Agora você pode gerenciar eventos facilmente!

**Dúvidas?** Consulte:
- `COMO_ATIVAR_EVENTOS.md` - Guia detalhado
- `docs/EVENTOS.md` - Documentação técnica