# 🌍 Guia Rápido - Sistema de Internacionalização

## 🚀 Como Usar o Sistema de Tradução

### Para Jogadores

1. **Mudar o Idioma:**
   - Abra o menu lateral (☰)
   - Clique em "Configurações" / "Settings"
   - Selecione o idioma desejado:
     - 🇧🇷 Português (Brasil)
     - 🇺🇸 English (US)
   - O jogo atualiza automaticamente!

2. **O que é Traduzido:**
   - ✅ Menu de navegação
   - ✅ Wiki completa (páginas principais)
   - ✅ Configurações
   - ✅ Sistema de inventário
   - ✅ Mercado
   - ✅ Notificações
   - ✅ Mensagens do sistema

---

## 👨‍💻 Para Desenvolvedores

### Adicionar Nova Tradução

#### 1. Adicione a chave nos arquivos JSON:

**`data/translations/pt-BR.json`:**
```json
{
  "novaSecao": {
    "titulo": "Meu Novo Título",
    "descricao": "Descrição em português"
  }
}
```

**`data/translations/en-US.json`:**
```json
{
  "novaSecao": {
    "titulo": "My New Title",
    "descricao": "Description in English"
  }
}
```

#### 2. Use no código JavaScript:

```javascript
import i18n from "./utils/i18n.js";

// Uso simples
const titulo = i18n.t("novaSecao.titulo");

// Com interpolação de variáveis
const mensagem = i18n.t("novaSecao.mensagem", { 
  nome: "João", 
  nivel: 5 
});
// Arquivo JSON: "mensagem": "Olá {nome}, você está no nível {nivel}!"
```

#### 3. Use no HTML:

```html
<!-- Atributo data-i18n -->
<h1 data-i18n="novaSecao.titulo">Título em PT-BR</h1>

<!-- Atualiza automaticamente ao mudar idioma -->
<button data-i18n="comum.confirmar">Confirmar</button>
```

---

### Traduzir Nova Página da Wiki

#### Passo 1: Adicionar traduções no JSON

**`data/translations/pt-BR.json`:**
```json
"wiki": {
  "minhaPagina": {
    "title": "🎮 Minha Página",
    "intro": "Introdução da página",
    "secao1": "Primeira seção",
    "secao1Desc": "Descrição da primeira seção"
  }
}
```

#### Passo 2: Atualizar WikiContentGenerator.js

```javascript
generateMinhaPagina() {
  const t = (key) => this.i18n.t(key);

  return `
    <h1 class="wiki-page-title">${t("wiki.minhaPagina.title")}</h1>
    
    <div class="wiki-card">
      <h2>${t("wiki.minhaPagina.secao1")}</h2>
      <p>${t("wiki.minhaPagina.secao1Desc")}</p>
    </div>
  `;
}
```

#### Passo 3: Adicionar no WikiManager.js

```javascript
case "minha-pagina":
  return this.contentGenerator.generateMinhaPagina();
```

---

### Estrutura de Chaves Recomendada

```
categoria.subCategoria.elemento

Exemplos:
- menu.farm
- wiki.gettingStarted.title
- settings.language
- errors.notEnoughGold
- notifications.levelUp
```

---

### Boas Práticas

✅ **FAZER:**
- Sempre adicionar tradução nos DOIS arquivos (pt-BR + en-US)
- Usar chaves descritivas: `wiki.gettingStarted.step1`
- Testar em ambos idiomas antes de commit
- Manter estrutura hierárquica consistente
- Usar interpolação para valores dinâmicos: `{variavel}`

❌ **NÃO FAZER:**
- Hardcodar strings em português no código
- Usar chaves genéricas: `texto1`, `mensagem`
- Duplicar chaves no mesmo arquivo
- Misturar idiomas no mesmo arquivo
- Esquecer de adicionar tradução em inglês

---

## 🔧 Comandos Úteis

### Validar JSON
```bash
jq empty data/translations/pt-BR.json
jq empty data/translations/en-US.json
```

### Contar traduções
```bash
jq 'paths | length' data/translations/pt-BR.json
jq 'paths | length' data/translations/en-US.json
```

### Buscar chave específica
```bash
jq '.wiki.gettingStarted' data/translations/pt-BR.json
```

### Ver diferença de chaves
```bash
diff <(jq -r 'paths | join(".")' data/translations/pt-BR.json | sort) \
     <(jq -r 'paths | join(".")' data/translations/en-US.json | sort)
```

---

## 📚 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `data/translations/pt-BR.json` | Traduções em Português |
| `data/translations/en-US.json` | Traduções em Inglês |
| `js/utils/i18n.js` | Sistema de internacionalização |
| `js/wiki/WikiContentGenerator.js` | Gerador de conteúdo da Wiki |
| `js/wiki/WikiManager.js` | Gerenciador da Wiki |
| `index.html` | HTML com atributos data-i18n |

---

## 🐛 Troubleshooting

### Problema: Tradução não aparece

**Solução:**
1. Verificar se a chave existe nos dois arquivos JSON
2. Verificar sintaxe JSON (vírgulas, aspas)
3. Verificar se o caminho da chave está correto
4. Limpar cache do navegador (Ctrl+Shift+R)

### Problema: Wiki não atualiza ao mudar idioma

**Solução:**
1. Verificar se evento `languagechange` está sendo disparado
2. Verificar console do navegador para erros
3. Verificar se WikiManager tem listener configurado

### Problema: Interpolação não funciona

**Solução:**
```javascript
// ❌ Errado
i18n.t("mensagem", "João");

// ✅ Correto
i18n.t("mensagem", { nome: "João" });
```

---

## 📞 Suporte

- **Documentação Completa**: Ver `RESUMO_TRADUCAO_FINAL.md`
- **Checklist**: Ver `CHECKLIST_TRADUCAO.md`
- **Histórico**: Ver `TRADUCAO_INGLES_COMPLETA.md`

---

**Versão**: 0.0.14  
**Idiomas Suportados**: 🇧🇷 PT-BR | 🇺🇸 EN-US  
**Status**: ✅ Funcional e Testado
