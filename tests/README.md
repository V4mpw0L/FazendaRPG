# 🧪 Tests - FazendaRPG

## 📋 Visão Geral

Esta pasta contém todos os testes automatizados do projeto FazendaRPG.

---

## 📁 Estrutura

```
tests/
├── README.md                    # Este arquivo
├── TEST_INSTRUCTIONS.md         # Instruções detalhadas de teste
├── energia-system-test.js       # Suite de testes do sistema de energia
├── test-debug.html              # Página HTML para debug de testes
└── check-integrity.sh           # Script de verificação de integridade
```

---

## 📄 Arquivos

### Scripts de Teste
- **energia-system-test.js** - Suite de 7 testes automatizados do sistema de energia
- **check-integrity.sh** - Script bash para verificar integridade do projeto

### Páginas de Debug
- **test-debug.html** - Página HTML dedicada para debug e testes manuais

### Documentação
- **README.md** - Este arquivo (documentação principal de testes)
- **TEST_INSTRUCTIONS.md** - Instruções detalhadas para executar testes

---

## 🔧 Ferramentas Disponíveis

### 🧪 energia-system-test.js
**Suite de testes automatizados do sistema de energia**

- 7 testes completos
- Valida level ups, skills, saves, migração
- Executável no console do navegador

**Como usar:**
```javascript
// No console (F12)
energiaSystemTest.quickTest()     // Teste rápido
energiaSystemTest.runAll()        // Suite completa
energiaSystemTest.displayStats()  // Ver estatísticas
```

### 🔍 check-integrity.sh
**Script de verificação de integridade do projeto**

- Verifica todos os arquivos essenciais
- Valida estrutura de pastas
- Checa sintaxe JSON
- Verifica assets PWA

**Como usar:**
```bash
# Da raiz do projeto:
cd FazendaRPG
./tests/check-integrity.sh

# ou
bash tests/check-integrity.sh
```

**O que verifica:**
- ✅ Arquivos core (index.html, manifest.json, sw.js)
- ✅ Estrutura de pastas (assets, data, js, style, docs, tests)
- ✅ Arquivos JavaScript (core, systems, ui, utils)
- ✅ Arquivos de dados (skills, items, crops, quests, npcs)
- ✅ Traduções (pt-BR, en-US)
- ✅ Estilos CSS
- ✅ Ícones PWA
- ✅ Sintaxe JSON

### 🐛 test-debug.html
**Página HTML para debug e testes manuais**

- Interface dedicada para testes
- Console integrado
- Debug de funcionalidades específicas

**Como usar:**
```bash
# Abra o arquivo no navegador:
open tests/test-debug.html

# ou com servidor local:
cd FazendaRPG
python3 -m http.server 8000
# Acesse: http://localhost:8000/tests/test-debug.html
```

---

## 🚀 Como Executar os Testes

### No Console do Navegador (F12)

#### Teste Rápido
```javascript
energiaSystemTest.quickTest()
```

#### Suite Completa
```javascript
energiaSystemTest.runAll()
```

#### Ver Estatísticas
```javascript
energiaSystemTest.displayStats()
```

---

## 🧪 Testes Disponíveis

### Sistema de Energia (`energia-system-test.js`)

**7 Testes Automatizados:**

1. ✅ **Initial Values** - Valida valores iniciais de energia
2. ✅ **Level Up** - Testa aumento no level up (+5 maxEnergy)
3. ✅ **Skill Level Up** - Testa aumento no skill level up (+5 maxEnergy)
4. ✅ **Calculate Formula** - Valida fórmula de cálculo
5. ✅ **Save/Load Persistence** - Testa persistência de dados
6. ✅ **Old Save Migration** - Valida migração de saves antigos
7. ✅ **Energy Clamp** - Testa limite máximo de energia

**Uso:**
```javascript
// Executar todos os testes
const result = energiaSystemTest.runAll();
console.log(`${result.passed}/${result.total} testes passaram`);

// Executar teste específico
energiaSystemTest.testLevelUp();
energiaSystemTest.testSkillLevelUp();
energiaSystemTest.testOldSaveMigration();
```

---

## 📊 Interpretando Resultados

### Símbolos

- ✅ **Teste passou** - Funcionando corretamente
- ❌ **Teste falhou** - Requer atenção

### Exemplo de Output

```
🧪 FAZENDARRPG - ENERGIA SYSTEM TEST SUITE
==========================================

📊 CURRENT PLAYER STATS
=======================
┌──────────────┬────────┐
│  Player Level│   10   │
│  Energy      │ 200/200│
│  Gold        │  1000  │
└──────────────┴────────┘

🧪 TEST 1: Initial Energy Values
================================
Current Energy: 200/200
Expected Max Energy: 200
✅ PASSED

...

==================================================
📊 TEST SUMMARY
==================================================
✅ Initial Values
✅ Calculate Formula
✅ Level Up
✅ Skill Level Up
✅ Save/Load Persistence
✅ Old Save Migration
✅ Energy Clamp

==================================================
TOTAL: 7/7 tests passed
🎉 ALL TESTS PASSED!
==================================================
```

---

## 🔧 Debug e Helpers

### Comandos Úteis

```javascript
// Ver energia atual
console.log(`${game.player.data.energy}/${game.player.data.maxEnergy}`);

// Forçar level up
game.player.addXP(1000);

// Forçar skill level up
game.player.addSkillXP('farming', 500);

// Recalcular energia máxima
game.player.data.maxEnergy = game.player.calculateMaxEnergy(
  game.player.data.level,
  game.player.data.skills
);
```

---

## 📝 Criando Novos Testes

### Template de Teste

```javascript
testNomeDaFuncionalidade() {
  console.log('\n🧪 TEST: Nome do Teste');
  console.log('='.repeat(40));

  // Arrange - Preparar dados
  const before = game.player.data.someValue;

  // Act - Executar ação
  game.player.doSomething();

  // Assert - Verificar resultado
  const after = game.player.data.someValue;
  const passed = after === expectedValue;

  console.log(passed ? '✅ PASSED' : '❌ FAILED');
  return { test: 'Nome do Teste', passed };
}
```

### Adicionando ao Suite

```javascript
runAll() {
  const results = [];
  
  results.push(this.testExistente());
  results.push(this.testNovo()); // Seu novo teste
  
  return results;
}
```

---

## 🐛 Troubleshooting

### Testes Falhando

1. **Verifique se o jogo está carregado:**
   ```javascript
   console.log(window.game ? '✅ Game loaded' : '❌ Game not loaded');
   ```

2. **Verifique dados do player:**
   ```javascript
   energiaSystemTest.displayStats();
   ```

3. **Execute teste específico:**
   ```javascript
   energiaSystemTest.testInitialValues();
   ```

### Erro: "energiaSystemTest is not defined"

**Solução:** O script de teste deve ser carregado automaticamente. Se não estiver:

1. Abra o console (F12)
2. Cole o conteúdo de `energia-system-test.js`
3. Execute os testes normalmente

---

## 📚 Documentação Relacionada

- [Documentação do Sistema de Energia](../docs/updates/ENERGIA_SYSTEM_UPDATE.md)
- [Guia Rápido](../docs/guides/GUIA_RAPIDO_ENERGIA.md)
- [Release Notes v0.0.5](../docs/updates/RELEASE_NOTES_ENERGIA_v0.0.5.md)

---

## ✅ Checklist de Teste

Antes de considerar uma feature pronta:

- [ ] Todos os testes passam
- [ ] Nenhum erro no console
- [ ] Testes de edge cases incluídos
- [ ] Documentação atualizada
- [ ] Changelog atualizado

---

## 🎯 Boas Práticas

### Ao Escrever Testes

1. **Nome descritivo** - `testWhatIsBeingTested()`
2. **AAA Pattern** - Arrange, Act, Assert
3. **Logs claros** - Console.log resultados esperados vs atuais
4. **Return resultado** - Sempre retornar `{ test, passed }`
5. **Emojis** - Use ✅/❌ para clareza visual

### Ao Executar Testes

1. **Console limpo** - Execute com console limpo
2. **Estado conhecido** - Comece de um estado consistente
3. **Um de cada vez** - Se algo falhar, teste individualmente
4. **Capture logs** - Salve output para debug

---

## 📞 Suporte

Se encontrar problemas com os testes:

1. Execute `energiaSystemTest.runAll()`
2. Copie o output completo do console
3. Inclua:
   - Versão do jogo
   - Navegador utilizado
   - Passos para reproduzir
   - Estado do player (use `displayStats()`)

---

## 📊 Resumo dos Arquivos

| Arquivo | Tipo | Descrição | Como Executar |
|---------|------|-----------|---------------|
| `energia-system-test.js` | JavaScript | 7 testes automatizados | Console do navegador |
| `check-integrity.sh` | Bash Script | Verificação de integridade | Terminal na raiz |
| `test-debug.html` | HTML | Página de debug | Navegador |
| `README.md` | Markdown | Este arquivo | - |
| `TEST_INSTRUCTIONS.md` | Markdown | Instruções detalhadas | - |

---

## 🎯 Workflow de Testes Recomendado

### Antes de Commitar
```bash
# 1. Verificar integridade
./tests/check-integrity.sh

# 2. Testar no navegador
# Abra index.html e execute no console:
energiaSystemTest.runAll()

# 3. Verificar erros no console
# Certifique-se de que não há erros
```

### Desenvolvimento de Nova Feature
```bash
# 1. Desenvolva a feature
# 2. Crie testes se necessário
# 3. Execute testes existentes
# 4. Verifique integridade
# 5. Documente mudanças
```

### Debug de Problemas
```bash
# 1. Use test-debug.html para debug isolado
# 2. Execute energiaSystemTest.displayStats()
# 3. Verifique docs/development/DEBUG.md
# 4. Use check-integrity.sh para validar estrutura
```

---

## 📚 Documentação Relacionada

- [TEST_INSTRUCTIONS.md](TEST_INSTRUCTIONS.md) - Instruções detalhadas de teste
- [../docs/updates/ENERGIA_SYSTEM_UPDATE.md](../docs/updates/ENERGIA_SYSTEM_UPDATE.md) - Doc técnica
- [../docs/development/DEBUG.md](../docs/development/DEBUG.md) - Guia de debug
- [../NAVEGACAO.md](../NAVEGACAO.md) - Navegação geral do projeto

---

**Última Atualização:** Janeiro 2024  
**Versão:** 0.0.5  
**Status:** ✅ Completo e Funcional  
**Arquivos de Teste:** 5 (2 scripts, 2 docs, 1 HTML)