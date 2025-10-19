# 🧭 Navegação - FazendaRPG

> Guia rápido para navegar na documentação do projeto

---

## 🚀 Começar Rápido

### Para Jogar
1. Abra `index.html` no navegador
2. Jogue normalmente
3. **Sistema de energia funciona automaticamente!**

### Para Entender o Sistema de Energia
1. **Iniciante:** [QUICK_START_ENERGIA.md](QUICK_START_ENERGIA.md) ← Comece aqui!
2. **Resumo:** [docs/README_ENERGIA_UPDATE.md](docs/README_ENERGIA_UPDATE.md)
3. **Completo:** [docs/INDEX.md](docs/INDEX.md)

---

## 📚 Documentação Principal

### 🎯 Sistema de Energia v0.0.5
```
├─ QUICK_START_ENERGIA.md          ⚡ Início ultra rápido (1 min)
├─ IMPLEMENTACAO_COMPLETA.md       ✅ Resumo executivo completo
└─ docs/
   ├─ INDEX.md                     📖 Índice de toda documentação
   ├─ README_ENERGIA_UPDATE.md     📋 README executivo
   ├─ updates/
   │  ├─ ENERGIA_SYSTEM_UPDATE.md          🔧 Doc técnica completa
   │  └─ RELEASE_NOTES_ENERGIA_v0.0.5.md   📄 Release notes
   └─ guides/
      └─ GUIA_RAPIDO_ENERGIA.md    📘 Guia de usuário
```

### 🧪 Testes
```
tests/
├─ README.md                       📖 Doc de testes
└─ energia-system-test.js          🧪 Suite de testes (7 testes)
```

---

## 🗂️ Estrutura do Projeto

```
FazendaRPG/
├─ 📄 NAVEGACAO.md                 ← Você está aqui!
├─ 📄 README.md                    ← README principal do projeto
├─ 📄 CHANGELOG.md                 ← Histórico de mudanças
├─ 📄 QUICK_START_ENERGIA.md       ← Quick start energia (1 min)
├─ 📄 IMPLEMENTACAO_COMPLETA.md    ← Resumo da implementação
│
├─ 📁 docs/                        ← Documentação organizada
│  ├─ INDEX.md                     ← Índice da documentação
│  ├─ README_ENERGIA_UPDATE.md     ← README do sistema energia
│  ├─ updates/                     ← Docs técnicas
│  └─ guides/                      ← Guias de usuário
│
├─ 📁 tests/                       ← Testes automatizados
│  ├─ README.md                    ← Doc de testes
│  └─ energia-system-test.js       ← Suite de testes
│
├─ 📁 js/                          ← Código fonte
│  └─ core/
│     └─ Player.js                 ← Sistema de energia implementado
│
├─ 📁 assets/                      ← Recursos do jogo
├─ 📁 data/                        ← Dados e traduções
├─ 📁 style/                       ← Estilos CSS
├─ index.html                      ← Ponto de entrada
└─ manifest.json                   ← PWA manifest
```

---

## 🎯 Por Necessidade

### "Quero jogar o jogo"
→ Abra `index.html` no navegador

### "Quero entender a atualização de energia"
→ [QUICK_START_ENERGIA.md](QUICK_START_ENERGIA.md)

### "Quero documentação técnica"
→ [docs/updates/ENERGIA_SYSTEM_UPDATE.md](docs/updates/ENERGIA_SYSTEM_UPDATE.md)

### "Quero testar o sistema"
→ [tests/README.md](tests/README.md)

### "Quero ver o que mudou"
→ [CHANGELOG.md](CHANGELOG.md)

### "Quero todo o resumo da implementação"
→ [IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md)

### "Quero o índice completo"
→ [docs/INDEX.md](docs/INDEX.md)

---

## 📖 Documentos por Público

### 👤 Para Jogadores
1. [QUICK_START_ENERGIA.md](QUICK_START_ENERGIA.md) - 1 minuto
2. [docs/guides/GUIA_RAPIDO_ENERGIA.md](docs/guides/GUIA_RAPIDO_ENERGIA.md) - Guia completo

### 💻 Para Desenvolvedores
1. [IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md) - Resumo técnico
2. [docs/updates/ENERGIA_SYSTEM_UPDATE.md](docs/updates/ENERGIA_SYSTEM_UPDATE.md) - Doc técnica
3. [tests/README.md](tests/README.md) - Testes
4. [js/core/Player.js](js/core/Player.js) - Código fonte

### 📊 Para Gerentes/Overview
1. [docs/README_ENERGIA_UPDATE.md](docs/README_ENERGIA_UPDATE.md) - Resumo executivo
2. [docs/updates/RELEASE_NOTES_ENERGIA_v0.0.5.md](docs/updates/RELEASE_NOTES_ENERGIA_v0.0.5.md) - Release notes
3. [CHANGELOG.md](CHANGELOG.md) - Changelog

---

## 🔍 Busca Rápida

| Procurando por... | Vá para... |
|-------------------|------------|
| Como funciona energia? | [QUICK_START_ENERGIA.md](QUICK_START_ENERGIA.md) |
| Fórmula de cálculo | [docs/updates/ENERGIA_SYSTEM_UPDATE.md](docs/updates/ENERGIA_SYSTEM_UPDATE.md#fórmula-de-cálculo) |
| Como testar | [tests/README.md](tests/README.md) |
| Migração de saves | [docs/updates/ENERGIA_SYSTEM_UPDATE.md](docs/updates/ENERGIA_SYSTEM_UPDATE.md#migração-de-saves-antigos) |
| Debug commands | [docs/guides/GUIA_RAPIDO_ENERGIA.md](docs/guides/GUIA_RAPIDO_ENERGIA.md#debug-e-helpers) |
| O que mudou? | [CHANGELOG.md](CHANGELOG.md) |
| Status geral | [IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md) |
| Índice completo | [docs/INDEX.md](docs/INDEX.md) |

---

## 🧪 Comandos Úteis

### No Console do Navegador (F12)
```javascript
// Teste rápido do sistema
energiaSystemTest.quickTest()

// Suite completa de testes
energiaSystemTest.runAll()

// Ver estatísticas do player
energiaSystemTest.displayStats()

// Ver energia atual
console.log(`${game.player.data.energy}/${game.player.data.maxEnergy}`)
```

---

## 📋 Checklist de Leitura

### Mínimo (5 minutos)
- [ ] [QUICK_START_ENERGIA.md](QUICK_START_ENERGIA.md)
- [ ] [CHANGELOG.md](CHANGELOG.md) - Seção v0.0.5

### Recomendado (15 minutos)
- [ ] [QUICK_START_ENERGIA.md](QUICK_START_ENERGIA.md)
- [ ] [docs/README_ENERGIA_UPDATE.md](docs/README_ENERGIA_UPDATE.md)
- [ ] [docs/guides/GUIA_RAPIDO_ENERGIA.md](docs/guides/GUIA_RAPIDO_ENERGIA.md)

### Completo (30 minutos)
- [ ] Tudo acima +
- [ ] [IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md)
- [ ] [docs/updates/ENERGIA_SYSTEM_UPDATE.md](docs/updates/ENERGIA_SYSTEM_UPDATE.md)
- [ ] [tests/README.md](tests/README.md)

---

## 🎯 Fluxo de Leitura Sugerido

### Para Iniciantes
```
1. QUICK_START_ENERGIA.md          (1 min)
   ↓
2. Jogue o jogo                     (10 min)
   ↓
3. docs/guides/GUIA_RAPIDO_ENERGIA.md  (5 min)
   ↓
4. Teste: energiaSystemTest.quickTest()
```

### Para Desenvolvedores
```
1. IMPLEMENTACAO_COMPLETA.md        (5 min)
   ↓
2. docs/updates/ENERGIA_SYSTEM_UPDATE.md  (10 min)
   ↓
3. js/core/Player.js                (5 min - ver código)
   ↓
4. tests/energia-system-test.js     (5 min - ver testes)
   ↓
5. Executar: energiaSystemTest.runAll()
```

---

## 📊 Versões dos Documentos

| Documento | Versão | Status |
|-----------|--------|--------|
| Sistema de Energia | 0.0.5 | ✅ Completo |
| Documentação | 0.0.5 | ✅ Completo |
| Testes | 0.0.5 | ✅ Completo |

---

## 💡 Dicas

### Para Novos Desenvolvedores
1. Comece pelo [QUICK_START_ENERGIA.md](QUICK_START_ENERGIA.md)
2. Leia [IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md)
3. Execute os testes: `energiaSystemTest.runAll()`
4. Explore o código em `js/core/Player.js`

### Para Contribuir
1. Leia a documentação técnica
2. Execute os testes
3. Siga as convenções do projeto
4. Atualize a documentação

---

## 🎉 Próximos Passos

Depois de ler a documentação:

1. ✅ Jogue o jogo e teste o sistema
2. ✅ Execute os testes automatizados
3. ✅ Explore o código fonte
4. ✅ Experimente os debug commands
5. ✅ Contribua com feedback!

---

## 📞 Suporte

### Precisa de Ajuda?
1. Consulte [docs/INDEX.md](docs/INDEX.md)
2. Execute `energiaSystemTest.runAll()`
3. Verifique [docs/updates/ENERGIA_SYSTEM_UPDATE.md](docs/updates/ENERGIA_SYSTEM_UPDATE.md#resolução-de-problemas)

---

**FazendaRPG**  
**Versão:** 0.0.5  
**Última Atualização:** Janeiro 2024  

🧭 **Boa navegação!** 📚