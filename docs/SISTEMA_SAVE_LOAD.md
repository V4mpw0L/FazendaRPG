# 📦 Sistema de Salvar e Carregar

> Sistema robusto de salvamento e carregamento de saves do FazendaRPG
> Versão: 0.0.9

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Funcionalidades](#funcionalidades)
3. [Como Usar](#como-usar)
4. [Estrutura de Dados](#estrutura-de-dados)
5. [Validações](#validações)
6. [Migração de Saves](#migração-de-saves)
7. [Troubleshooting](#troubleshooting)
8. [API Técnica](#api-técnica)

---

## 🎯 Visão Geral

O sistema de Save/Load foi completamente reformulado para ser:

- ✅ **Robusto**: Validações completas em múltiplas camadas
- ✅ **Seguro**: Confirmações antes de sobrescrever dados
- ✅ **Inteligente**: Migração automática de saves antigos
- ✅ **Informativo**: Mensagens claras e específicas
- ✅ **Preparado**: Pronto para futura migração online

### Mudanças da Versão Anterior

| Antes | Agora |
|-------|-------|
| Exportar/Importar | Salvar/Carregar |
| `exportSave()` | `saveToFile()` |
| `importSave()` | `loadFromFile()` |
| Validação básica | Validação completa + verificação de integridade |
| `exportedAt` | `savedAt` (padronizado) |
| Sem confirmação | Confirmação antes de sobrescrever |

---

## 🎮 Funcionalidades

### 1. Salvamento Automático (Auto-Save)

- Salva automaticamente a cada **60 segundos**
- Armazena em `localStorage` do navegador
- Cria backup automático antes de salvar
- Não afeta o salvamento em arquivo

### 2. Salvar para Arquivo

**Botão**: 💾 Salvar Jogo

- Baixa um arquivo `.json` com todos os dados
- Nome do arquivo: `FazendaRPG_[Nome]_[Data-Hora].json`
- Exemplo: `FazendaRPG_Jogador_2024-01-15T14-30-00.json`
- Verifica integridade antes de salvar
- Pode ser usado como backup manual

### 3. Carregar de Arquivo

**Botão**: 📂 Carregar Jogo

- Carrega um arquivo `.json` de save
- Valida formato e integridade
- Pede confirmação antes de sobrescrever
- Migra automaticamente saves antigos
- Aplica os dados e reinicia o jogo

### 4. Sistema de Backup

- **Backup Automático**: Criado antes de cada salvamento
- **Recuperação**: Se save principal corromper, usa backup
- **Snapshots**: Sistema de snapshots manuais (avançado)

---

## 📖 Como Usar

### Para Jogadores

#### Salvar seu Progresso

1. Abra o menu **⚙️ Configurações**
2. Na seção "Dados do Jogo", clique em **💾 Salvar Jogo**
3. O arquivo será baixado automaticamente
4. Guarde o arquivo em local seguro

**💡 Dica**: Salve regularmente para ter backups manuais!

#### Carregar um Save

1. Abra o menu **⚙️ Configurações**
2. Clique em **📂 Carregar Jogo**
3. Selecione o arquivo `.json` do save
4. Confirme que deseja substituir o progresso atual
5. O jogo será carregado automaticamente

**⚠️ Atenção**: Sempre salve seu progresso atual antes de carregar outro save!

### Para Desenvolvedores

```javascript
// Salvar para arquivo
game.saveToFile();

// Carregar de arquivo
await game.loadFromFile();

// Salvar em localStorage
game.saveGame();

// Carregar de localStorage
game.loadGame();

// Verificar integridade
const verification = game.saveManager.verifySaveIntegrity(saveData);
console.log(verification);
```

---

## 📊 Estrutura de Dados

### Formato do Save

```json
{
  "version": "0.0.9",
  "savedAt": 1705329000000,
  "exportType": "file",
  "player": {
    "name": "Jogador",
    "avatar": "assets/sprites/avatars/11.png",
    "createdAt": 1705320000000,
    "lastSaved": 1705329000000,
    "playTime": 3600,
    "level": 5,
    "xp": 1250,
    "gold": 500,
    "energy": 85,
    "maxEnergy": 120,
    "skills": {
      "farming": { "level": 3, "xp": 500 },
      "mining": { "level": 2, "xp": 200 },
      "fishing": { "level": 1, "xp": 0 },
      "cooking": { "level": 1, "xp": 0 },
      "woodcutting": { "level": 1, "xp": 0 },
      "crafting": { "level": 1, "xp": 0 },
      "smithing": { "level": 1, "xp": 0 },
      "foraging": { "level": 1, "xp": 0 }
    },
    "inventory": {
      "wheat": 10,
      "wheat_seed": 5,
      "fertilizer": 3
    },
    "farm": {
      "plots": [
        {
          "crop": "wheat",
          "plantedAt": 1705328000000,
          "fertilized": true,
          "hasWeeds": false,
          "lastHarvestedAt": 1705320000000
        }
      ]
    },
    "quests": {
      "active": [],
      "completed": [],
      "progress": {}
    },
    "npcs": {},
    "bank": {
      "balance": 0,
      "transactions": []
    },
    "tavern": {
      "reputation": 0,
      "mealsEaten": 0,
      "storiesHeard": 0,
      "lastVisit": null
    },
    "achievements": [],
    "settings": {
      "theme": "light",
      "language": "pt-BR",
      "soundEnabled": true,
      "musicEnabled": true,
      "notificationsEnabled": true
    },
    "stats": {
      "totalCropsPlanted": 15,
      "totalCropsHarvested": 10,
      "totalFishCaught": 0,
      "totalTreesChopped": 0,
      "totalOresMined": 0,
      "totalMealCooked": 0,
      "totalItemsCrafted": 0,
      "totalGoldEarned": 500,
      "totalGoldSpent": 200,
      "totalQuestsCompleted": 0
    }
  }
}
```

### Campos Obrigatórios

#### Raiz do Save
- `version` (string): Versão do jogo
- `player` (object): Dados do jogador

#### Player
- `name` (string): Nome do jogador
- `level` (number): Nível principal
- `xp` (number): Experiência total
- `gold` (number): Ouro atual
- `energy` (number): Energia atual
- `skills` (object): Skills do jogador
- `inventory` (object): Inventário
- `farm` (object): Fazenda com plots

---

## ✅ Validações

### Camadas de Validação

#### 1. Validação Básica (`validateSaveData`)

Verifica:
- ✓ Save é um objeto válido
- ✓ Possui propriedade `player`
- ✓ Possui propriedade `version`
- ✓ Player possui propriedades obrigatórias

#### 2. Verificação de Integridade (`verifySaveIntegrity`)

Verifica:
- ✓ Nome do jogador não está vazio
- ✓ Level é um número válido (≥ 1)
- ✓ XP é um número válido (≥ 0)
- ✓ Skills existem e são válidas
- ✓ Inventory existe
- ✓ Farm existe com plots válidos

Retorna objeto com:
```javascript
{
  valid: true/false,
  errors: [],      // Erros críticos
  warnings: []     // Avisos não-críticos
}
```

#### 3. Migração Automática

Converte saves antigos para o formato atual:
- `exportedAt` → `savedAt`
- Adiciona campos faltantes com valores padrão
- Atualiza versão

---

## 🔄 Migração de Saves

### Saves da Versão Antiga

O sistema detecta e migra automaticamente:

```javascript
// Save antigo (v0.0.8)
{
  "exportedAt": 1705329000000,  // ❌ Nome antigo
  "version": "0.0.8"              // ❌ Versão antiga
}

// Migração automática
{
  "savedAt": 1705329000000,       // ✅ Padronizado
  "version": "0.0.9"                // ✅ Atualizado
}
```

### Compatibilidade

- ✅ Saves da v0.0.8 são compatíveis
- ✅ Saves da v0.0.9 são nativos
- ⚠️ Saves muito antigos podem precisar de migração manual

---

## 🔧 Troubleshooting

### Problema: "Erro ao carregar: arquivo inválido"

**Causa**: Arquivo JSON está corrompido ou vazio

**Solução**:
1. Verifique se o arquivo não está corrompido
2. Abra o arquivo em um editor de texto
3. Verifique se é um JSON válido
4. Tente usar um backup anterior

### Problema: "Erro: save corrompido ou incompatível"

**Causa**: Save não possui dados necessários

**Solução**:
1. Verifique se o save é do FazendaRPG
2. Verifique se possui campo `player`
3. Tente carregar um save mais recente
4. Entre em contato com suporte se persistir

### Problema: "Save não aparece depois de carregar"

**Causa**: Erro durante aplicação dos dados

**Solução**:
1. Verifique o console do navegador (F12)
2. Recarregue a página
3. Tente carregar novamente
4. Use o auto-save do localStorage

### Problema: Save muito antigo

**Solução**:
```javascript
// No console (F12)
const oldSave = /* cole o conteúdo do save antigo */;
const newSave = game.saveManager.migrateSaveData(oldSave);
console.log(JSON.stringify(newSave, null, 2));
// Copie o resultado e salve em um novo arquivo
```

---

## 🔬 API Técnica

### SaveManager

#### Métodos Principais

##### `saveToFile(data)`
Salva dados em arquivo para download.

```javascript
const success = saveManager.saveToFile(gameData);
```

##### `loadFromFile()`
Carrega dados de arquivo selecionado pelo usuário.

```javascript
const data = await saveManager.loadFromFile();
```

##### `save(data)`
Salva no localStorage (auto-save).

```javascript
const success = saveManager.save(gameData);
```

##### `load()`
Carrega do localStorage.

```javascript
const data = saveManager.load();
```

##### `validateSaveData(data)`
Valida estrutura básica.

```javascript
const isValid = saveManager.validateSaveData(data);
```

##### `verifySaveIntegrity(data)`
Verificação completa de integridade.

```javascript
const result = saveManager.verifySaveIntegrity(data);
console.log(result.valid);
console.log(result.errors);
console.log(result.warnings);
```

##### `migrateSaveData(data)`
Migra save antigo para formato atual.

```javascript
const migrated = saveManager.migrateSaveData(oldSave);
```

#### Métodos Auxiliares

```javascript
// Informações
saveManager.hasSave()              // boolean
saveManager.getSaveInfo()          // Object
saveManager.getSaveSize()          // number (bytes)
saveManager.getStorageInfo()       // Object

// Backups
saveManager.loadBackup()           // Object|null
saveManager.deleteSave(includeBackup) // boolean

// Snapshots
saveManager.createSnapshot(data, name)  // boolean
saveManager.listSnapshots()             // Array
saveManager.deleteSnapshot(key)         // boolean

// Debug
saveManager.exportCompleteState()       // Object
saveManager.clearAll()                  // boolean
```

### GameEngine

#### Métodos Públicos

```javascript
// Salvar/Carregar
game.saveToFile()           // void
await game.loadFromFile()   // void
game.saveGame()             // boolean
game.loadGame()             // boolean

// Outros
game.resetGame()            // void
game.start()                // void
game.stop()                 // void
```

---

## 🎓 Boas Práticas

### Para Jogadores

1. **Salve Regularmente**: Faça backups manuais frequentes
2. **Organize Saves**: Nomeie os arquivos de forma clara
3. **Múltiplos Saves**: Mantenha vários saves de diferentes momentos
4. **Antes de Atualizar**: Sempre salve antes de atualizar o jogo

### Para Desenvolvedores

1. **Validação Sempre**: Valide antes de salvar e carregar
2. **Tratamento de Erros**: Use try-catch em operações assíncronas
3. **Migração**: Adicione lógica de migração para mudanças no formato
4. **Versionamento**: Sempre atualize o número de versão

```javascript
// ✅ BOM
try {
  const data = await saveManager.loadFromFile();
  if (data && saveManager.verifySaveIntegrity(data).valid) {
    // Usar dados
  }
} catch (error) {
  console.error("Erro ao carregar:", error);
}

// ❌ RUIM
const data = await saveManager.loadFromFile();
player.load(data.player); // Sem validação!
```

---

## 🚀 Futuro: Sistema Online

O sistema está preparado para migração online:

### Estrutura Preparada

```javascript
// Atual (Local)
saveManager.saveToFile(data);

// Futuro (Online)
await saveManager.saveToCloud(data, userId);
await saveManager.loadFromCloud(userId);
await saveManager.syncWithCloud();
```

### Recursos Planejados

- ☐ Salvamento em nuvem
- ☐ Sincronização automática
- ☐ Múltiplos slots de save
- ☐ Compartilhamento de saves
- ☐ Histórico de versões
- ☐ Backup automático na nuvem

---

## 📝 Changelog

### v0.0.9 (Atual)
- ✨ Renomeado export/import para save/load
- ✨ Validação completa de integridade
- ✨ Migração automática de saves antigos
- ✨ Confirmação antes de sobrescrever
- ✨ Mensagens mais descritivas
- ✨ Melhor tratamento de erros
- ✨ Nome de arquivo mais informativo
- 🐛 Corrigido: exportedAt vs savedAt
- 🐛 Corrigido: falha ao carregar saves antigos

### v0.0.8 (Anterior)
- Sistema básico de export/import
- Salvamento em localStorage
- Auto-save a cada 60s

---

## 📞 Suporte

### Problemas Comuns

Consulte a seção [Troubleshooting](#troubleshooting)

### Reportar Bugs

1. Abra o console (F12)
2. Copie os erros
3. Salve o save problemático
4. Reporte com detalhes

### Informações de Debug

```javascript
// Execute no console (F12)
console.log(game.saveManager.exportCompleteState());
```

---

**Documentação atualizada em**: 2024-01-15  
**Versão do Sistema**: 0.0.9  
**Autor**: FazendaRPG Team