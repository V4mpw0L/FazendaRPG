# 🌾 FazendaRPG v0.0.4 - Release Notes

**Data de Lançamento:** 19 de Outubro de 2024  
**Versão:** 0.0.4  
**Status:** ✅ PRONTO PARA INSTALAÇÃO NO CELULAR

---

## 🎉 Novidades Principais

### 🛒 Sistema de Shop Completo
- **Lojas nos NPCs:** Agora você pode comprar itens diretamente dos NPCs que possuem loja!
- **Interface Profissional:** Preview de itens, preços, estoque e descrições
- **Compra em Quantidade:** Selecione quantos itens deseja comprar (1, 5, 10 ou máximo)
- **Sistema de Amizade:** Ganhe pontos de amizade ao comprar dos NPCs

### 🧪 Poção de Energia
- **Novo Item:** Poção de Energia disponível na loja da Chef Maria
- **Restauração:** Recupera 20 de energia ao usar
- **Preço:** 25 moedas de ouro (vende por 15g)
- **Empilhável:** Até 999 unidades

### 🎮 Uso de Itens Consumíveis
- **Botão "Usar":** Clique em itens consumíveis no inventário para usá-los
- **Feedback Visual:** Notificações mostram quanto de energia foi restaurada
- **Atualização Automática:** Stats atualizam instantaneamente

### ✅ Validação de Nome do Jogador
- **Obrigatório:** Não é mais possível iniciar o jogo sem um nome válido
- **Proteção F5:** Se você dar F5 durante a criação, volta para tela de boas-vindas
- **Sem mais "Fazendeiro":** Nomes genéricos não são mais aceitos

---

## 📱 PWA - Instalável como App!

### Agora você pode instalar FazendaRPG no seu celular!

#### ✨ Recursos PWA:
- ✅ **Funciona Offline** - Jogue sem internet após instalação
- ✅ **Ícone Personalizado** - Novo ícone de fazenda com trator e plantação
- ✅ **Tela Cheia** - Sem barras do navegador
- ✅ **Início Rápido** - Abre instantaneamente
- ✅ **Atualização Automática** - Sempre na versão mais recente

#### 📲 Como Instalar:

**Android (Chrome/Edge):**
1. Abra o jogo no navegador
2. Toque nos 3 pontinhos (⋮)
3. Selecione "Instalar app"
4. Confirme!

**iOS (Safari):**
1. Abra o jogo no Safari
2. Toque no botão Compartilhar (□↑)
3. Selecione "Adicionar à Tela de Início"
4. Toque em "Adicionar"

📖 **Guia Completo:** Veja `INSTALL_PWA.md` para instruções detalhadas

---

## 🔧 Melhorias Técnicas

### Sistema de Versões
- ✅ Todas as versões atualizadas de 0.0.3 → 0.0.4
- ✅ Service Worker v0.0.4 com cache otimizado
- ✅ Manifest.json configurado para PWA
- ✅ Meta tags completas para instalação

### Arquivos Atualizados
- **Data:** crops.json, items.json, npcs.json, quests.json, skills.json
- **Core:** GameEngine.js, Player.js, SaveManager.js
- **Systems:** Todos os sistemas atualizados
- **UI:** Todas as interfaces atualizadas
- **Total:** 30+ arquivos atualizados

### Novos Arquivos
- `assets/icon.svg` - Ícone vetorial da fazenda
- `INSTALL_PWA.md` - Guia de instalação no celular
- `PWA_CHECKLIST.md` - Checklist técnico completo
- `RELEASE_v0.0.4.md` - Este arquivo!

---

## 🐛 Correções de Bugs

### TopBar
- ✅ Restaurada ao estado original limpo
- ✅ Sem progress bars (layout ficou confuso)
- ✅ Itens do mesmo tamanho e alinhados
- ✅ Botão do menu sempre visível

### Player System
- ✅ Método `getXPForNextLevel()` adicionado
- ✅ Validação de nome implementada
- ✅ Salva apenas com nome válido

### Shop System
- ✅ NPCSUI recebe inventorySystem corretamente
- ✅ Cálculo de preços com multiplicador
- ✅ Verificação de ouro antes de comprar
- ✅ Atualização de amizade funcional

---

## 📊 Estatísticas da Versão

```
📁 Arquivos Modificados: 30+
➕ Linhas Adicionadas: 500+
➖ Linhas Removidas: 100+
🆕 Novos Arquivos: 4
🐛 Bugs Corrigidos: 5
✨ Features Novas: 4
⚡ Performance: Otimizada
```

---

## 🎮 Itens Disponíveis no Shop

### Chef Maria (Taberna):
- 🍤 Camarão Cozido - 18g (restaura 5 energia)
- 🍣 Peixe Cozido - 30g (restaura 10 energia)
- 🍞 Pão - 33g (restaura 8 energia)
- 🧪 **Poção de Energia - 25g (restaura 20 energia)** ⭐ NOVO!

### Fazendeiro José:
- 🌱 Sementes de Trigo - 5g
- 🌱 Sementes de Milho - 10g
- 🌱 Sementes de Tomate - 20g
- 🌱 Sementes de Batata - 30g
- 🌱 Sementes de Cenoura - 40g
- 💩 Fertilizante - 50g

### Outros NPCs:
- 8 lojas diferentes com itens únicos!

---

## 🚀 Próximas Versões (Planejado)

### v0.0.5 (Em breve)
- 🎣 Sistema de pesca completo
- ⛏️ Sistema de mineração
- 🪓 Sistema de woodcutting
- 🍳 Sistema de culinária

### v0.0.6 (Futuro)
- 🏠 Upgrade da fazenda
- 🐮 Criação de animais
- 🎁 Sistema de presentes para NPCs
- 📜 Mais missões

---

## ⚙️ Requisitos Técnicos

### Navegadores Suportados:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Dispositivos:
- ✅ Android 5.0+ (Qualquer navegador moderno)
- ✅ iOS 11.4+ (Safari obrigatório para PWA)
- ✅ Desktop (Windows, Mac, Linux)

### Conexão:
- ⚠️ Internet necessária para primeira instalação
- ✅ Funciona offline após cache completo
- 📦 Tamanho do cache: ~2MB

---

## 🔍 Como Testar

### Desenvolvimento Local:
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/FazendaRPG

# Entre na pasta
cd FazendaRPG

# Inicie um servidor local
python -m http.server 8000
# OU
npx http-server -p 8000

# Abra no navegador
http://localhost:8000
```

### Testar no Celular (mesma rede WiFi):
```bash
# Descubra seu IP local
ipconfig  # Windows
ifconfig  # Linux/Mac

# Acesse do celular
http://SEU_IP:8000
```

### Para HTTPS (necessário para PWA em rede):
```bash
# Instale o ngrok
npm install -g ngrok

# Execute
ngrok http 8000

# Use o link HTTPS gerado no celular
```

---

## 📝 Changelog Detalhado

### Adicionado ✨
- Sistema completo de shop nos NPCs com interface profissional
- Poção de Energia (restaura 20 energia, 25g)
- Botão "Usar" para itens consumíveis no inventário
- Validação obrigatória de nome do jogador
- Ícone SVG da fazenda para PWA
- Suporte completo para instalação como app
- Manifest.json otimizado para PWA
- Service Worker v0.0.4 com cache inteligente
- Meta tags completas para iOS e Android
- Documentação de instalação PWA
- Checklist técnico PWA

### Modificado 🔧
- TopBar restaurada ao layout original limpo
- NPCSUI agora recebe inventorySystem no construtor
- Player.load() agora valida nome obrigatório
- GameEngine.loadGame() verifica nome válido antes de iniciar
- Todas as versões atualizadas para 0.0.4
- Manifest com caminhos relativos (./)
- Service Worker com caminhos relativos

### Corrigido 🐛
- Player não tinha método getXPForNextLevel()
- TopBar quebrava em mobile com progress bars
- Itens da topbar com tamanhos diferentes
- Botão do menu sumia em resoluções menores
- Jogo iniciava sem nome válido (F5 bug)
- NPCSUI shop não funcionava (faltava inventorySystem)

### Removido ❌
- Progress bars da topbar (causavam confusão visual)
- Fallback "Fazendeiro" como nome padrão
- Caminhos absolutos no manifest e service worker

---

## 🙏 Agradecimentos

Obrigado por testar o FazendaRPG! Esta versão marca um milestone importante - agora o jogo é um PWA completo e pode ser instalado como app!

**Reporte bugs:** github.com/fazendarpg/issues  
**Sugestões:** discord.gg/fazendarpg  
**Email:** suporte@fazendarpg.com

---

## 📜 Licença

Este projeto é open source. Consulte LICENSE para mais detalhes.

---

**Divirta-se jogando! 🌾🎮**

---

### Verificação Final ✅

- [x] Todas as versões 0.0.3 → 0.0.4
- [x] Service Worker funcional
- [x] Manifest configurado
- [x] Ícones criados
- [x] Meta tags completas
- [x] Shop funcionando
- [x] Poção de energia implementada
- [x] Validação de nome funcionando
- [x] Documentação completa
- [x] **PRONTO PARA INSTALAÇÃO NO CELULAR!** 🎉

**Status:** ✅ READY FOR PRODUCTION