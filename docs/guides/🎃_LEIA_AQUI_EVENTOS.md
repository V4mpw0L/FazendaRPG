# 🎃 EVENTOS - LEIA AQUI PRIMEIRO!

## 🚀 ATIVAÇÃO SUPER RÁPIDA

### Para ATIVAR o evento de Halloween para TODOS os jogadores:

**1. Edite este arquivo:**
```
js/systems/events/eventConfig.js
```

**2. Mude estas linhas:**
```javascript
halloween: {
  enabled: true,   // ← Mude para true
  autoStart: true, // ← Mude para true
},
```

**3. Faça commit e push:**
```bash
git add js/systems/events/eventConfig.js
git commit -m "🎃 Ativar Halloween"
git push
```

**4. PRONTO! 🎊**
- GitHub Pages atualiza em 1-2 minutos
- Todos os jogadores terão o evento automaticamente
- Abóboras aparecem na tela
- +1 Energia e +1 Ouro por clique!

---

## ❌ Para DESATIVAR o Halloween:

**Mude para:**
```javascript
halloween: {
  enabled: false,  // ← false = DESATIVADO
  autoStart: false,
},
```

**E faça commit:**
```bash
git add js/systems/events/eventConfig.js
git commit -m "🎃 Desativar Halloween"
git push
```

---

## 🎮 O QUE O EVENTO FAZ

✅ Abóboras aparecem aleatoriamente na tela
✅ Elas se movem a cada 2 segundos
✅ Clique para ganhar **+1 Energia** e **+1 Ouro**
✅ Cliques **ILIMITADOS** enquanto a abóbora estiver visível
✅ Decorações de teias de aranha nos cantos
✅ Animações suaves e bonitas
✅ Não quebra nada do jogo

---

## 📁 ARQUIVO IMPORTANTE

**EDITE APENAS ESTE ARQUIVO:**
```
js/systems/events/eventConfig.js
```

**NÃO EDITE:**
- `eventConfig.example.js` (apenas exemplos)
- `EventManager.js` (sistema interno)
- `HalloweenEvent.js` (código do evento)

---

## 🎯 STATUS ATUAL

**Evento de Halloween**: ✅ 100% IMPLEMENTADO E FUNCIONAL

**Configuração atual:**
- Abra `eventConfig.js` para ver

**Para ver no jogo (console):**
```javascript
FazendaRPG.debug.listEvents()
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **`COMO_ATIVAR_EVENTOS.md`** - Guia detalhado
- **`COMANDOS_GIT_EVENTOS.md`** - Comandos git prontos
- **`EVENTO_HALLOWEEN_PRONTO.md`** - Tudo sobre o evento
- **`docs/EVENTOS.md`** - Documentação técnica

---

## ⚡ COMANDOS DE TESTE (OPCIONAL)

Se quiser testar localmente antes do push:

```javascript
// Console do navegador (F12)
FazendaRPG.debug.startHalloween()  // Inicia
FazendaRPG.debug.stopHalloween()   // Para
FazendaRPG.debug.listEvents()      // Status
```

---

## 🎊 É ISSO!

**Simples assim:**
1. Edite `eventConfig.js`
2. Mude para `true` ou `false`
3. Commit + Push
4. **Todos terão o evento!**

**Happy Halloween! 🎃👻🕸️**