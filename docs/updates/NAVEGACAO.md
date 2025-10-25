# 🧭 Navegação - FazendaRPG

> Guia completo para navegar na documentação do projeto

---

## 🚀 Começar Rápido

### Para Jogar
1. Abra `index.html` no navegador
2. Jogue normalmente
3. **Sistema de energia funciona automaticamente!**

### Para Entender o Sistema de Energia (v0.0.5)
1. **Iniciante:** [QUICK_START_ENERGIA.md](QUICK_START_ENERGIA.md) ← Comece aqui! (1 min)
2. **Resumo:** [docs/README_ENERGIA_UPDATE.md](docs/README_ENERGIA_UPDATE.md)
3. **Completo:** [docs/IMPLEMENTACAO_COMPLETA.md](docs/IMPLEMENTACAO_COMPLETA.md)
4. **Índice:** [docs/INDEX.md](docs/INDEX.md)

---

## 📁 Estrutura Organizada

```
FazendaRPG/
│
├─ 📄 README.md                           ← README principal do projeto
├─ 📄 CHANGELOG.md                        ← Histórico de mudanças (todas versões)
├─ 📄 NAVEGACAO.md                        ← Você está aqui!
├─ 📄 QUICK_START.md                      ← Quick start geral do projeto
├─ 📄 QUICK_START_ENERGIA.md              ← Quick start sistema de energia
│
├─ 📁 docs/                               ← 📚 TODA DOCUMENTAÇÃO
│  │
│  ├─ INDEX.md                            ← Índice completo da documentação
│  ├─ README_ENERGIA_UPDATE.md            ← README do sistema de energia
│  ├─ IMPLEMENTACAO_COMPLETA.md           ← Resumo da implementação v0.0.5
│  │
│  ├─ 📁 guides/                          ← Guias para usuários
│  │  ├─ GUIA_RAPIDO_ENERGIA.md           ← Guia de uso do sistema energia
│  │  └─ INSTALL_PWA.md                   ← Guia de instalação PWA
│  │
│  ├─ 📁 updates/                         ← Documentação técnica de updates
│  │  ├─ ENERGIA_SYSTEM_UPDATE.md         ← Doc técnica completa energia
│  │  └─ RELEASE_NOTES_ENERGIA_v0.0.5.md  ← Release notes v0.0.5
│  │
│  ├─ 📁 releases/                        ← Release notes antigas
│  │  └─ RELEASE_v0.0.4.md                ← Release notes v0.0.4
│  │
│  ├─ 📁 development/                     ← Docs de desenvolvimento
│  │  ├─ CORRECOES_COMPLETAS.md           ← Correções aplicadas
│  │  ├─ DEBUG.md                         ← Debug e troubleshooting
│  │  ├─ FINAL_FIXES.md                   ← Fixes finais
│  │  ├─ FIXES_APPLIED.md                 ← Histórico de fixes
│  │  ├─ IMPLEMENTADO.md                  ← Features implementadas
│  │  ├─ STATUS.md                        ← Status do projeto
│  │  └─ PWA_CHECKLIST.md                 ← Checklist PWA
│  │
│  └─ 📁 i18n/                            ← Documentação de tradução
│     ├─ CHECKLIST_TRADUCAO.md            ← Checklist de traduções
│     ├─ TRADUCAO_COMPLETA.md             ← Traduções completas
│     └─ I18N_FIXES.md                    ← Fixes de internacionalização
│
├─ 📁 tests/                              ← 🧪 TESTES
│  ├─ README.md                           ← Documentação de testes
│  ├─ TEST_INSTRUCTIONS.md                ← Instruções de teste
│  └─ energia-system-test.js              ← Suite de testes energia (7 testes)
│
├─ 📁 js/                                 ← Código fonte JavaScript
│  ├─ core/
│  │  ├─ Player.js                        ← Sistema de energia implementado
│  │  └─ GameEngine.js
│  ├─ systems/
│  └─ ui/
│
├─ 📁 assets/                             ← Recursos do jogo
├─ 📁 data/                               ← Dados e traduções
├─ 📁 style/                              ← Estilos CSS
├─ index.html                             ← Ponto de entrada
├─ manifest.json                          ← PWA manifest
└─ sw.js                                  ← Service Worker
```

---

## 🎯 Navegação por Necessidade

### "Quero jogar o jogo"
→ Abra [index.html](index.html) no navegador

### "Quero entender a atualização de energia"
→ [QUICK_START_ENERGIA.md](QUICK_START_ENERGIA.md) (1 minuto)

### "Quero documentação técnica completa"
→ [docs/updates/ENERGIA_SYSTEM_UPDATE.md](docs/updates/ENERGIA_SYSTEM_UPDATE.md)

### "Quero testar o sistema"
→ [tests/README.md](tests/README.md)

### "Quero ver o que mudou"
→ [CHANGELOG.md](CHANGELOG.md)

### "Quero todo o resumo da implementação"
→ [docs/IMPLEMENTACAO_COMPLETA.md](docs/IMPLEMENTACAO_COMPLETA.md)

### "Quero o índice completo da documentação"
→ [docs/INDEX.md](docs/INDEX.md)

### "Quero instalar como PWA"
→ [docs/guides/INSTALL_PWA.md](docs/guides/INSTALL_PWA.md)

### "Quero ver status do desenvolvimento"
→ [docs/development/STATUS.md](docs/development/STATUS.md)

### "Quero informações de tradução"
→ [docs/i18n/](docs/i18n/)

---

## 📖 Documentos por Público

### 👤 Para Jogadores
1. [QUICK_START_ENERGIA.md](QUICK_START_ENERGIA.md) - 1 minuto
2. [docs/guides/GUIA_RAPIDO_ENERGIA.md](docs/guides/GUIA_RAPIDO_ENERGIA.md) - Guia completo
3. [docs/guides/INSTALL_PWA.md](docs/guides/INSTALL_PWA.md) - Instalar como app

### 💻 Para Desenvolvedores
1. [docs/IMPLEMENTACAO_COMPLETA.md](docs/IMPLEMENTACAO_COMPLETA.md) - Resumo técnico
2. [docs/updates/ENERGIA_SYSTEM_UPDATE.md](docs/updates/ENERGIA_SYSTEM_UPDATE.md) - Doc técnica
3. [docs/development/](docs/development/) - Docs de desenvolvimento
4. [tests/README.md](tests/README.md) - Testes
5. [js/core/Player.js](js/core/Player.js) - Código fonte

### 📊 Para Gerentes/Overview
1. [docs/README_ENERGIA_UPDATE.md](docs/README_ENERGIA_UPDATE.md) - Resumo executivo
2. [docs/updates/RELEASE_NOTES_ENERGIA_v0.0.5.md](docs/updates/RELEASE_NOTES_ENERGIA_v0.0.5.md) - Release notes
3. [CHANGELOG.md](CHANGELOG.md) - Changelog completo
4. [docs/development/STATUS.md](docs/development/STATUS.md) - Status do projeto

### 🌍 Para Tradutores
1. [docs/i18n/CHECKLIST_TRADUCAO.md](docs/i18n/CHECKLIST_TRADUCAO.md) - Checklist
2. [docs/i18n/TRADUCAO_COMPLETA.md](docs/i18n/TRADUCAO_COMPLETA.md) - Traduções completas
3. [docs/i18n/I18N_FIXES.md](docs/i18n/I18N_FIXES.md) - Fixes de i18n

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
| Status geral | [docs/IMPLEMENTACAO_COMPLETA.md](docs/IMPLEMENTACAO_COMPLETA.md) |
| Índice completo | [docs/INDEX.md](docs/INDEX.md) |
| Instalar PWA | [docs/guides/INSTALL_PWA.md](docs/guides/INSTALL_PWA.md) |
| Debug geral | [docs/development/DEBUG.md](docs/development/DEBUG.md) |
| Traduções | [docs/i18n/](docs/i18n/) |

---

## 📚 Principais Documentos

### 🏠 Raiz (Essenciais)
- **README.md** - Apresentação do projeto
- **CHANGELOG.md** - Histórico completo de mudanças
- **NAVEGACAO.md** - Este arquivo (navegação)
- **QUICK_START.md** - Quick start geral
- **QUICK_START_ENERGIA.md** - Quick start sistema energia

### 📖 Documentação (docs/)
- **INDEX.md** - Índice completo de toda documentação
- **README_ENERGIA_UPDATE.md** - README do update de energia
- **IMPLEMENTACAO_COMPLETA.md** - Resumo implementação v0.0.5

### 📘 Guias (docs/guides/)
- **GUIA_RAPIDO_ENERGIA.md** - Guia de uso do sistema energia
- **INSTALL_PWA.md** - Guia instalação PWA

### 🔧 Updates (docs/updates/)
- **ENERGIA_SYSTEM_UPDATE.md** - Doc técnica completa
- **RELEASE_NOTES_ENERGIA_v0.0.5.md** - Release notes v0.0.5

### 🧪 Testes (tests/)
- **README.md** - Documentação de testes
- **energia-system-test.js** - Suite de 7 testes automatizados
- **TEST_INSTRUCTIONS.md** - Instruções de teste

---

## 🧪 Comandos Úteis

### No Console do Navegador (F12)
```javascript
// Teste rápido do sistema
energiaSystemTest.quickTest()

// Suite completa de testes (7 testes)
energiaSystemTest.runAll()

// Ver estatísticas do player
energiaSystemTest.displayStats()

// Ver energia atual
console.log(`${game.player.data.energy}/${game.player.data.maxEnergy}`)

// Forçar level up (teste)
game.player.addXP(1000)

// Forçar skill level up (teste)
game.player.addSkillXP('farming', 500)
```

---

## 📋 Checklist de Leitura Recomendada

### ⚡ Mínimo (5 minutos)
- [ ] [README.md](README.md) - Entender o projeto
- [ ] [QUICK_START_ENERGIA.md](QUICK_START_ENERGIA.md) - Sistema de energia
- [ ] [CHANGELOG.md](CHANGELOG.md) - Seção v0.0.5

### 📖 Recomendado (15 minutos)
- [ ] Tudo acima +
- [ ] [docs/README_ENERGIA_UPDATE.md](docs/README_ENERGIA_UPDATE.md)
- [ ] [docs/guides/GUIA_RAPIDO_ENERGIA.md](docs/guides/GUIA_RAPIDO_ENERGIA.md)
- [ ] [tests/README.md](tests/README.md)

### 📚 Completo (30 minutos)
- [ ] Tudo acima +
- [ ] [docs/IMPLEMENTACAO_COMPLETA.md](docs/IMPLEMENTACAO_COMPLETA.md)
- [ ] [docs/updates/ENERGIA_SYSTEM_UPDATE.md](docs/updates/ENERGIA_SYSTEM_UPDATE.md)
- [ ] [docs/INDEX.md](docs/INDEX.md)

---

## 🎯 Fluxo de Leitura por Perfil

### Jogador Casual
```
1. QUICK_START_ENERGIA.md (1 min)
   ↓
2. Jogue o jogo (10 min)
   ↓
3. docs/guides/GUIA_RAPIDO_ENERGIA.md (5 min - se tiver dúvidas)
```

### Desenvolvedor Novo
```
1. README.md (3 min)
   ↓
2. docs/IMPLEMENTACAO_COMPLETA.md (5 min)
   ↓
3. docs/updates/ENERGIA_SYSTEM_UPDATE.md (10 min)
   ↓
4. js/core/Player.js (5 min - código)
   ↓
5. tests/energia-system-test.js (5 min - testes)
   ↓
6. Execute: energiaSystemTest.runAll()
```

### Gerente de Projeto
```
1. docs/README_ENERGIA_UPDATE.md (3 min)
   ↓
2. docs/IMPLEMENTACAO_COMPLETA.md (5 min)
   ↓
3. CHANGELOG.md (3 min)
   ↓
4. docs/development/STATUS.md (2 min)
```

### Tradutor
```
1. docs/i18n/CHECKLIST_TRADUCAO.md
   ↓
2. docs/i18n/TRADUCAO_COMPLETA.md
   ↓
3. docs/i18n/I18N_FIXES.md
```

---

## 📊 Organização das Pastas

### docs/
Toda a documentação do projeto está organizada aqui:

- **guides/** - Guias para usuários finais
- **updates/** - Documentação técnica de atualizações
- **releases/** - Release notes de versões anteriores
- **development/** - Documentação de desenvolvimento (fixes, status, debug)
- **i18n/** - Documentação de internacionalização e traduções

### tests/
Todos os testes automatizados e documentação de testes:

- **energia-system-test.js** - Suite de testes do sistema energia
- **README.md** - Como executar e criar testes
- **TEST_INSTRUCTIONS.md** - Instruções detalhadas de teste

---

## 🎯 Versões

| Versão | Data | Principais Mudanças | Documentos |
|--------|------|---------------------|------------|
| 0.0.5 | Jan 2024 | Sistema de Energia Dinâmica | [Release Notes](docs/updates/RELEASE_NOTES_ENERGIA_v0.0.5.md) |
| 0.0.4 | - | - | [Release Notes](docs/releases/RELEASE_v0.0.4.md) |

Ver histórico completo: [CHANGELOG.md](CHANGELOG.md)

---

## 💡 Dicas de Navegação

### Para Encontrar Algo Rapidamente
1. Use este arquivo (NAVEGACAO.md) como ponto de partida
2. Consulte [docs/INDEX.md](docs/INDEX.md) para documentação detalhada
3. Use Ctrl+F para buscar palavras-chave

### Para Entender o Projeto
1. Comece pelo [README.md](README.md)
2. Leia o [QUICK_START.md](QUICK_START.md)
3. Explore [docs/](docs/) conforme necessidade

### Para Contribuir
1. Leia [docs/development/STATUS.md](docs/development/STATUS.md)
2. Consulte [docs/development/](docs/development/) para contexto
3. Execute os testes antes de começar
4. Atualize a documentação junto com código

---

## 🎉 Estrutura Limpa e Profissional

✅ **Raiz limpa** - Apenas arquivos essenciais  
✅ **Documentação organizada** - Tudo em /docs  
✅ **Testes separados** - Tudo em /tests  
✅ **Fácil navegação** - Estrutura intuitiva  
✅ **Bem documentado** - Guias para todos os públicos  

---

## 📞 Suporte

### Precisa de Ajuda?
1. Consulte este arquivo (NAVEGACAO.md)
2. Veja [docs/INDEX.md](docs/INDEX.md)
3. Execute `energiaSystemTest.runAll()` para testar
4. Verifique [docs/development/DEBUG.md](docs/development/DEBUG.md)

### Encontrou um Bug?
1. Execute os testes: `energiaSystemTest.runAll()`
2. Consulte [docs/updates/ENERGIA_SYSTEM_UPDATE.md](docs/updates/ENERGIA_SYSTEM_UPDATE.md#resolução-de-problemas)
3. Verifique [docs/development/DEBUG.md](docs/development/DEBUG.md)

---

**FazendaRPG**  
**Versão:** 0.0.5  
**Última Atualização:** Janeiro 2024  

🧭 **Boa navegação! Estrutura 100% organizada e profissional!** 📚✨