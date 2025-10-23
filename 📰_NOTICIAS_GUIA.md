# 📰 Sistema de Notícias - Guia Rápido

## 🎯 O que é?

Sistema de notícias e changelog que aparece automaticamente quando você abre o jogo, mostrando as últimas atualizações, eventos e novidades!

## ✨ Características

- ✅ **Abre automaticamente** ao carregar o jogo (se houver novidades)
- ✅ **Design bonito** com suporte a tema claro e escuro
- ✅ **Paginação** - mostra 10 notícias por página
- ✅ **Categorias coloridas** (Evento, Sistema, Melhoria, etc)
- ✅ **Imagens** nas notícias
- ✅ **Tags** para organização
- ✅ **Opção de não mostrar novamente**

---

## 🎮 Como Usar

### Ver Notícias Manualmente

Abra o console (F12) e digite:

```javascript
FazendaRPG.debug.showNews()
```

### Se Marcou "Não Mostrar Novamente" por Engano

**SOLUÇÃO RÁPIDA:**

Abra o console e digite:

```javascript
FazendaRPG.debug.resetNewsSettings()
```

Pronto! As notícias vão aparecer novamente ao abrir o jogo! ✅

---

## 📝 Como Adicionar Notícias

### 1. Edite o arquivo de notícias:

```
data/news/news.json
```

### 2. Adicione uma nova notícia no TOPO do array:

```json
{
  "id": "news-11",
  "date": "2024-10-25",
  "version": "0.0.14",
  "title": "🎉 Sua Notícia Aqui!",
  "category": "evento",
  "content": "Descrição detalhada da sua notícia...",
  "image": "./assets/sprites/events/pumpkin2.png",
  "tags": ["novidade", "evento"],
  "highlight": true
}
```

### 3. Campos disponíveis:

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `id` | ✅ Sim | ID único (ex: news-11) |
| `date` | ✅ Sim | Data (YYYY-MM-DD) |
| `version` | ❌ Não | Versão do jogo |
| `title` | ✅ Sim | Título da notícia |
| `category` | ✅ Sim | Categoria (veja abaixo) |
| `content` | ✅ Sim | Conteúdo/descrição |
| `image` | ❌ Não | Caminho da imagem |
| `tags` | ❌ Não | Array de tags |
| `highlight` | ❌ Não | true = destaque laranja |

### 4. Categorias disponíveis:

- `evento` 🎉 - Eventos especiais
- `sistema` ⚙️ - Mudanças no sistema
- `melhoria` ✨ - Melhorias
- `recurso` 🆕 - Novos recursos
- `correção` 🔧 - Correções de bugs
- `visual` 🎨 - Mudanças visuais
- `lançamento` 🚀 - Lançamentos

---

## 🎨 Exemplo de Notícia Completa

```json
{
  "id": "news-12",
  "date": "2024-10-25",
  "version": "0.0.15",
  "title": "🎄 Evento de Natal Chegando!",
  "category": "evento",
  "content": "Prepare-se para o evento de Natal! Presentes especiais, decorações natalinas e muito mais. Fique ligado nas próximas atualizações!",
  "image": "./assets/sprites/christmas/tree.png",
  "tags": ["natal", "evento", "preview"],
  "highlight": true
}
```

---

## 💡 Dicas

### Para destacar uma notícia importante:
```json
"highlight": true
```
Isso deixa a notícia com borda laranja e fundo destacado!

### Para adicionar imagem:
```json
"image": "./assets/sprites/events/pumpkin2.png"
```
A imagem aparece flutuando à esquerda do texto.

### Para adicionar tags:
```json
"tags": ["novidade", "importante", "evento"]
```
Tags aparecem embaixo do conteúdo em formato de badges.

---

## 🔧 Comandos de Debug

```javascript
// Abrir notícias manualmente
FazendaRPG.debug.showNews()

// Fechar notícias
FazendaRPG.debug.hideNews()

// Resetar configuração "não mostrar novamente"
FazendaRPG.debug.resetNewsSettings()
```

---

## 📊 Como Funciona

1. **Ao abrir o jogo**, o sistema verifica:
   - Se marcou "não mostrar novamente" → NÃO mostra
   - Se há notícias novas desde a última vez → MOSTRA
   - Se é a primeira vez → MOSTRA

2. **Sistema salva**:
   - `fazenda_news_dont_show` → se marcou "não mostrar"
   - `fazenda_news_last_shown` → ID da última notícia vista

3. **Modal aparece** automaticamente após 1 segundo (para não atrapalhar carregamento)

---

## 🎯 Workflow Completo (GitHub)

### Para postar uma notícia para todos:

1. **Edite** `data/news/news.json`
2. **Adicione** a notícia no topo do array
3. **Commit e Push**:
   ```bash
   git add data/news/news.json
   git commit -m "📰 Nova notícia: Evento de Halloween"
   git push
   ```
4. **Pronto!** Todos que abrirem o jogo verão a notícia! 🎉

---

## ❓ FAQ

### As notícias não aparecem mais?

**R:** Você marcou "Não mostrar novamente". Execute:
```javascript
FazendaRPG.debug.resetNewsSettings()
```

### Como testar uma notícia nova?

**R:** 
1. Adicione a notícia no JSON
2. Execute `FazendaRPG.debug.resetNewsSettings()`
3. Recarregue a página (F5)
4. A notícia aparecerá automaticamente!

### Posso ter notícias sem imagem?

**R:** Sim! Basta não incluir o campo `image` ou deixá-lo vazio.

### Quantas notícias podem aparecer?

**R:** Todas! Mas apenas 10 por página. O sistema cria paginação automaticamente.

### Como remover uma notícia antiga?

**R:** Basta deletar ela do arquivo `news.json` e fazer commit.

---

## 🎨 Tema Claro vs Escuro

O sistema **automaticamente se adapta** ao tema atual do jogo!

- ✅ Tema Claro → Fundo branco, texto escuro
- ✅ Tema Escuro → Fundo escuro, texto claro

---

## 📱 Responsivo

Funciona perfeitamente em:
- 💻 Desktop
- 📱 Mobile
- 📲 Tablets

---

## 🎊 Pronto!

Agora você sabe tudo sobre o sistema de notícias!

**Comandos importantes:**

```javascript
// Ver notícias
FazendaRPG.debug.showNews()

// Resetar "não mostrar"
FazendaRPG.debug.resetNewsSettings()
```

**Happy Gaming! 🎮📰**