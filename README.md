# 🌾 FazendaRPG

> Um jogo de fazenda RPG completo para mobile (PWA)

[![Version](https://img.shields.io/badge/version-0.0.17-green.svg)](https://github.com/yourusername/FazendaRPG)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg)](manifest.json)

---

## 🎮 Sobre o Jogo

FazendaRPG é um jogo de fazenda com elementos de RPG, desenvolvido como Progressive Web App (PWA) para funcionar em dispositivos móveis e desktop.

### ✨ Principais Features

- 🌱 **Sistema de Fazenda** - Plante, colha e gerencie sua fazenda
- ⚡ **Sistema de Energia** - Regeneração automática e gerenciamento
- 🎒 **Inventário Completo** - Gerencie sementes, ferramentas e recursos
- 📈 **Sistema de Skills** - Evolua suas habilidades (estilo RuneScape)
- 🏙️ **Cidade** - Banco, Taverna, NPCs e muito mais
- 🎯 **Missões** - Complete quests e ganhe recompensas
- 🎃 **Eventos Especiais** - Eventos sazonais (Halloween, etc)
- 🔔 **Notificações Push** - Avisos quando crops estão prontos
- ☁️ **Cloud Saves** - Save na nuvem com login Google (Firebase)
- 🔄 **Multi-Dispositivo** - Jogue no PC e continue no celular
- 🌍 **Multilíngue** - Português (BR) e Inglês
- 🎨 **Temas** - Modo Claro e Escuro
- 🔤 **Fontes Customizáveis** - 5 opções de fonte (Padrão, Fredoka, Medieval, Cinzel, Pixel)
- 📱 **100% Mobile** - Responsivo e otimizado para touch

---

## 🚀 Como Jogar

### **Online (GitHub Pages):**
Acesse: `https://yourusername.github.io/FazendaRPG`

### **Instalar como PWA:**
1. Abra o jogo no navegador mobile
2. Toque em "Adicionar à Tela Inicial"
3. Jogue offline quando quiser!

---

## 📚 Documentação

Toda a documentação está organizada na pasta [`docs/`](docs/):

### **📖 Guias:**
- [📚 Comece Aqui](docs/guides/📚_COMECE_AQUI.md) - Guia inicial
- [⚡ Quick Start](docs/guides/QUICK_START.md) - Início rápido
- [🔥 Firebase Setup](docs/FIREBASE_SETUP.md) - Configurar cloud saves (completo)
- [🔥 Firebase Quick Start](docs/FIREBASE_QUICKSTART.md) - Configurar cloud saves (rápido)
- [🎃 Eventos](docs/guides/🎃_LEIA_AQUI_EVENTOS.md) - Sistema de eventos
- [📦 Como Adicionar Itens](docs/guides/📦_COMO_ADICIONAR_ITENS.md) - Adicionar conteúdo
- [📰 Sistema de Notícias](docs/guides/📰_NOTICIAS_GUIA.md) - Gerenciar notícias
- [🔄 Atualizar Versão](docs/guides/README_UPDATE_VERSION.md) - Sistema de versão

### **🌍 Internacionalização:**
- [README i18n](docs/i18n/README_I18N.md) - Sistema de traduções
- [Guia Rápido](docs/i18n/GUIA_RAPIDO_I18N.md) - Como traduzir

### **🔧 Desenvolvimento:**
- [Comandos Git](docs/development/COMANDOS_GIT_EVENTOS.md) - Workflow Git
- [Testes](docs/development/) - Documentação de testes

### **📝 Releases:**
- [Changelog](docs/releases/CHANGELOG.md) - Histórico de versões
- [Updates](docs/updates/) - Atualizações e melhorias

---

## 🛠️ Tecnologias

- **Vanilla JavaScript** (ES6+)
- **CSS3** (Grid, Flexbox, Animations)
- **Service Worker** (PWA)
- **IndexedDB** (Persistência local)
- **Web Notifications API**
- **GitHub Pages** (Hosting)

---

## 📦 Estrutura do Projeto

```
FazendaRPG/
├── index.html              # HTML principal
├── manifest.json           # PWA Manifest
├── sw.js                   # Service Worker
├── version.js              # Versão centralizada
├── update-version.js       # Script de atualização
├── assets/                 # Imagens e sprites
├── data/                   # JSONs (items, crops, NPCs, etc)
├── docs/                   # 📚 Documentação completa
├── js/
│   ├── core/              # Engine, Player, SaveManager
│   ├── systems/           # Farm, Inventory, Skills, etc
│   ├── ui/                # Interface components
│   ├── utils/             # Helpers e utilitários
│   ├── wiki/              # Sistema de Wiki
│   └── animations/        # Animações
├── style/                 # CSS
└── tests/                 # Testes
```

---

## 🎯 Roadmap

- [ ] Sistema de animais (galinhas, vacas)
- [ ] Pesca
- [ ] Mineração
- [ ] Crafting avançado
- [ ] Multiplayer (futuro)
- [ ] App nativo (iOS/Android)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Consulte a [documentação](docs/) para entender a estrutura do projeto.

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ por **Tiago**

---

## 📞 Suporte

- 📚 [Documentação Completa](docs/)
- 🐛 [Reportar Bug](https://github.com/yourusername/FazendaRPG/issues)
- 💡 [Sugerir Feature](https://github.com/yourusername/FazendaRPG/issues)

---

**Versão Atual:** 0.0.17  
**Última Atualização:** 2024