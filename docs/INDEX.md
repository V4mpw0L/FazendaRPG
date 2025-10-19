# 📚 Índice de Documentação - FazendaRPG

> Documentação organizada e profissional do projeto FazendaRPG

---

## 📖 Visão Geral

Este diretório contém toda a documentação técnica, guias de usuário e notas de release do projeto FazendaRPG.

---

## 🗂️ Estrutura de Pastas

```
docs/
├── INDEX.md                          # Este arquivo (índice principal)
├── README_ENERGIA_UPDATE.md          # README rápido da atualização de energia
├── updates/                          # Documentação de atualizações
│   ├── ENERGIA_SYSTEM_UPDATE.md      # Documentação técnica completa do sistema de energia
│   └── RELEASE_NOTES_ENERGIA_v0.0.5.md  # Release notes detalhadas v0.0.5
└── guides/                           # Guias para usuários
    └── GUIA_RAPIDO_ENERGIA.md        # Guia rápido de uso do sistema de energia
```

---

## 🚀 Quick Start

### Para Desenvolvedores
1. **Documentação Técnica:** [ENERGIA_SYSTEM_UPDATE.md](updates/ENERGIA_SYSTEM_UPDATE.md)
2. **Release Notes:** [RELEASE_NOTES_ENERGIA_v0.0.5.md](updates/RELEASE_NOTES_ENERGIA_v0.0.5.md)
3. **Testes:** `/tests/energia-system-test.js`

### Para Usuários
1. **README Rápido:** [README_ENERGIA_UPDATE.md](README_ENERGIA_UPDATE.md)
2. **Guia de Uso:** [GUIA_RAPIDO_ENERGIA.md](guides/GUIA_RAPIDO_ENERGIA.md)

---

## 📋 Documentos Disponíveis

### 🔄 Atualizações (updates/)

#### Sistema de Energia v0.0.5

| Documento | Descrição | Público-Alvo |
|-----------|-----------|--------------|
| [ENERGIA_SYSTEM_UPDATE.md](updates/ENERGIA_SYSTEM_UPDATE.md) | Documentação técnica completa do sistema de energia dinâmica | Desenvolvedores |
| [RELEASE_NOTES_ENERGIA_v0.0.5.md](updates/RELEASE_NOTES_ENERGIA_v0.0.5.md) | Release notes detalhadas da versão 0.0.5 | Todos |

**Conteúdo:**
- ✅ Como funciona o sistema
- ✅ Fórmulas de cálculo
- ✅ Migração de saves
- ✅ Testes e validação
- ✅ Resolução de problemas
- ✅ Impacto no gameplay

---

### 📖 Guias (guides/)

| Guia | Descrição | Nível |
|------|-----------|-------|
| [GUIA_RAPIDO_ENERGIA.md](guides/GUIA_RAPIDO_ENERGIA.md) | Guia rápido do sistema de energia | Iniciante |

**Conteúdo:**
- ✅ O que mudou
- ✅ Exemplos práticos
- ✅ Como testar
- ✅ Debug commands
- ✅ FAQ

---

### 📄 READMEs

| README | Descrição |
|--------|-----------|
| [README_ENERGIA_UPDATE.md](README_ENERGIA_UPDATE.md) | Resumo da atualização do sistema de energia |

**Conteúdo:**
- ✅ Resumo executivo
- ✅ Exemplos rápidos
- ✅ Comandos úteis
- ✅ Compatibilidade

---

## 🎯 Por Tópico

### ⚡ Sistema de Energia

**O que é?**
Sistema dinâmico de energia que escala com a progressão do jogador.

**Documentos relacionados:**
1. 📖 [README Rápido](README_ENERGIA_UPDATE.md) - Comece aqui!
2. 📚 [Documentação Técnica](updates/ENERGIA_SYSTEM_UPDATE.md) - Detalhes completos
3. 📘 [Guia de Usuário](guides/GUIA_RAPIDO_ENERGIA.md) - Como usar
4. 📋 [Release Notes](updates/RELEASE_NOTES_ENERGIA_v0.0.5.md) - Changelog

**Testes:**
- `/tests/energia-system-test.js` - Suite de testes automatizados

---

## 🧪 Testes e Validação

### Como Testar

```javascript
// No console do navegador (F12)

// Teste rápido
energiaSystemTest.quickTest()

// Suite completa
energiaSystemTest.runAll()

// Ver estatísticas
energiaSystemTest.displayStats()
```

**Documentação de Testes:**
- [ENERGIA_SYSTEM_UPDATE.md - Seção de Testes](updates/ENERGIA_SYSTEM_UPDATE.md#como-testar)

---

## 🔍 Busca Rápida

### Preciso entender como funciona...

#### O Sistema de Energia
→ [ENERGIA_SYSTEM_UPDATE.md](updates/ENERGIA_SYSTEM_UPDATE.md)

#### A Migração de Saves
→ [ENERGIA_SYSTEM_UPDATE.md - Migração](updates/ENERGIA_SYSTEM_UPDATE.md#migração-de-saves-antigos)

#### Como Testar no Jogo
→ [GUIA_RAPIDO_ENERGIA.md](guides/GUIA_RAPIDO_ENERGIA.md)

#### Comandos de Debug
→ [README_ENERGIA_UPDATE.md - Debug](README_ENERGIA_UPDATE.md#debug-commands)

#### O que mudou nesta versão
→ [RELEASE_NOTES_ENERGIA_v0.0.5.md](updates/RELEASE_NOTES_ENERGIA_v0.0.5.md)

#### Resolução de Problemas
→ [ENERGIA_SYSTEM_UPDATE.md - Troubleshooting](updates/ENERGIA_SYSTEM_UPDATE.md#resolução-de-problemas)

---

## 📊 Versões

| Versão | Data | Documentos |
|--------|------|-----------|
| 0.0.5 | Jan 2024 | Sistema de Energia Dinâmica |

---

## 🛠️ Ferramentas

### Scripts de Teste
```javascript
// Disponíveis globalmente após carregar o jogo
energiaSystemTest.runAll()        // Todos os testes
energiaSystemTest.quickTest()     // Validação rápida
energiaSystemTest.displayStats()  // Estatísticas
```

### Debug Commands
```javascript
// Ver energia
console.log(`${game.player.data.energy}/${game.player.data.maxEnergy}`);

// Adicionar XP
game.player.addXP(1000);

// Adicionar Skill XP
game.player.addSkillXP('farming', 500);
```

---

## 📝 Convenções de Documentação

### Estrutura de Documentos

1. **README** - Resumo executivo e quick start
2. **Guides** - Tutoriais e guias de uso
3. **Updates** - Documentação técnica e release notes

### Emojis Utilizados

- 📚 Documentação
- 🚀 Quick Start
- ⚡ Sistema de Energia
- 🧪 Testes
- 🔧 Debug/Ferramentas
- ✅ Confirmado/Implementado
- 🎯 Objetivo/Foco
- 📊 Estatísticas/Dados
- 🐛 Bugs/Problemas
- 💡 Dicas/Sugestões

---

## 🤝 Contribuindo

### Adicionando Nova Documentação

1. Crie o arquivo na pasta apropriada:
   - `updates/` - Documentação técnica de atualizações
   - `guides/` - Guias para usuários

2. Adicione entrada neste INDEX.md

3. Use as convenções estabelecidas:
   - Emojis descritivos
   - Títulos claros
   - Exemplos práticos
   - Links internos

### Template de Documento

```markdown
# 🎯 Título do Documento

## 📋 Resumo
Breve descrição...

## 🚀 Quick Start
Como começar...

## 📚 Conteúdo Detalhado
Detalhes completos...

## 🧪 Como Testar
Exemplos de teste...

## 🐛 Problemas Conhecidos
Issues e soluções...

---

**Versão:** X.X.X  
**Data:** MM/AAAA  
**Status:** ✅ Implementado
```

---

## 📞 Suporte

### Encontrou um Bug?
1. Execute os testes: `energiaSystemTest.runAll()`
2. Capture os logs do console
3. Consulte [Resolução de Problemas](updates/ENERGIA_SYSTEM_UPDATE.md#resolução-de-problemas)

### Precisa de Ajuda?
1. Consulte os [Guias](guides/)
2. Verifique as [Release Notes](updates/)
3. Execute os comandos de debug

---

## 📈 Estatísticas da Documentação

- **Total de Documentos:** 4
- **Guias de Usuário:** 1
- **Documentação Técnica:** 2
- **READMEs:** 1
- **Idioma:** Português (pt-BR)
- **Última Atualização:** Janeiro 2024

---

## 🎉 Conclusão

Esta documentação foi criada com foco em:
- ✅ **Profissionalismo** - Estrutura organizada
- ✅ **Clareza** - Explicações diretas
- ✅ **Completude** - Todos os detalhes necessários
- ✅ **Usabilidade** - Fácil navegação
- ✅ **Manutenibilidade** - Fácil atualização

**Boa leitura! 📚**

---

**FazendaRPG Documentation**  
**Versão:** 0.0.5  
**Última Atualização:** Janeiro 2024