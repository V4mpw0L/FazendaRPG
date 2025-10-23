# 🔔 Sistema de Notificações - FazendaRPG

## 📋 Visão Geral

Sistema de notificações completamente reformulado para v0.0.13, com design profissional, leve e otimizado para mobile, seguindo a identidade visual da fazenda/RPG.

## ✨ Características Principais

### 🎨 Design

- **Estilo Fazenda/Terra**: Gradiente marrom (#8b6914, #a0522d, #654321)
- **Borda Dourada**: Contorno dourado realçando a notificação
- **Linha Verde no Topo**: Accent line com as cores da marca (brand-primary, brand-secondary)
- **Ícones PNG**: Integração com sprites do jogo (items, ouro, XP, etc)
- **Sombras Profissionais**: Múltiplas camadas para profundidade
- **Text Shadow**: Contraste perfeito em ambos os temas

### 🚀 Performance

- **Leve**: CSS otimizado, menos animações pesadas
- **Mobile-First**: Design responsivo e touch-friendly
- **Cache de Ícones**: Sistema de cache para ícones de items
- **Transições Suaves**: 350ms com cubic-bezier otimizado
- **Max 4 Notificações**: Limite de notificações visíveis simultaneamente

### 🌓 Temas

- **Dark Theme**: Tons mais escuros, sombras mais profundas
- **Light Theme**: Tons mais claros, maior contraste
- **Adaptação Automática**: Ajusta-se ao tema ativo

## 📱 Tipos de Notificações

### 1. Success (Sucesso)
```javascript
notifications.success("Ação realizada com sucesso!");
```
- Linha verde no topo
- Ícone: ✓
- Uso: Ações bem-sucedidas gerais

### 2. Error (Erro)
```javascript
notifications.error("Algo deu errado!");
```
- Linha vermelha no topo
- Ícone: ✕
- Animação: Shake
- Uso: Mensagens de erro

### 3. Warning (Aviso)
```javascript
notifications.warning("Atenção!");
```
- Linha laranja no topo
- Ícone: ⚠
- Uso: Avisos e alertas

### 4. Info (Informação)
```javascript
notifications.info("Informação útil");
```
- Linha azul no topo
- Ícone: ℹ
- Uso: Mensagens informativas

### 5. Gold (Ouro)
```javascript
// Ganhou ouro
notifications.gold(100, true);

// Gastou ouro
notifications.gold(50, false);
```
- Linha dourada brilhante no topo
- Ícone: PNG do ouro (ouro.png)
- Destaque especial para valores
- Uso: Transações de ouro

### 6. Level Up (Subiu de Nível)
```javascript
notifications.levelUp(10, "Agricultura");
```
- Linha roxa brilhante no topo
- Ícone: ⭐
- Animação: Pulse
- Box-shadow especial
- Uso: Quando subir de nível

### 7. Item (Item Recebido)
```javascript
notifications.item("Trigo", 5, "wheat");
```
- Linha verde da marca no topo
- Ícone: PNG do item (se disponível)
- Display especial com quantidade e ícone
- Uso: Ao receber items

### 8. Harvest (Colheita)
```javascript
notifications.harvest("Milho", 3, "corn");
```
- Mesma estilização de Item
- Ícone: PNG da cultura colhida
- Texto: "Colheu Nx [Item] 🌽"
- Uso: Ao colher plantações

### 9. XP (Experiência)
```javascript
notifications.xp(25, "Agricultura");
```
- Ícone: PNG da poção de XP (xp-potion.png)
- Destaque verde para valores
- Uso: Ganho de experiência

### 10. Quest (Missão)
```javascript
notifications.quest("Nome da Missão", { gold: 100, xp: 50 });
```
- Ícone: 📜
- Mostra recompensas (ouro e XP)
- Duração: 5000ms
- Uso: Conclusão de missões

### 11. Achievement (Conquista)
```javascript
notifications.achievement("Mestre da Colheita", "Colheu 1000 plantas!");
```
- Ícone: 🏆
- Título em destaque
- Duração: 6000ms
- Uso: Conquistas desbloqueadas

## 🎯 Recursos Avançados

### Destaque Automático de Números

O sistema automaticamente destaca números no texto:

```javascript
// Ouro
notifications.success("Você ganhou 100g!");
// "100g" será destacado com estilo gold-value

// XP
notifications.success("Você ganhou 50 XP!");
// "50 XP" será destacado com estilo xp-value

// Positivo
notifications.success("Você ganhou +25 items!");
// "+25" será destacado com estilo positive

// Negativo
notifications.warning("Você perdeu -10 items!");
// "-10" será destacado com estilo negative
```

### Display de Items com Ícones

Quando usar `item()` ou `harvest()`:

```javascript
notifications.harvest("Trigo", 5, "wheat");
```

Isso cria um display especial:
- Ícone PNG do item (1247.png para wheat)
- Nome do item destacado em dourado
- Quantidade formatada (5x)
- Background escuro com borda dourada
- Tudo dentro da notificação

### Mapeamento de Ícones

O sistema mapeia automaticamente IDs de items para sprites:

```javascript
// Sementes
wheat_seed → 1053.png
corn_seed → 1058.png
tomato_seed → 1068.png

// Culturas
wheat → 1247.png
corn → 1248.png
tomato → 1249.png

// Ferramentas
hoe → 1358.png
trowel → 1359.png
axe → 1361.png

// Peixes
sardine → 1579.png
salmon → 1630.png

// Madeira
wood → 1752.png
oak_wood → 1753.png

// Minerais
stone → 1765.png
copper_ore → 1766.png
ruby → 1771.png

// E muito mais...
```

## 📐 Estrutura CSS

### Container
```css
.notifications-container
  position: fixed
  top: calc(var(--topbar-height) + 12px)
  right: 12px
  z-index: 10000
  max-width: 380px
```

### Notificação
```css
.notification
  background: linear-gradient(135deg, #8b6914, #a0522d, #654321)
  border: 2px solid rgba(139, 105, 20, 0.8)
  border-radius: 12px
  padding: 12px 16px
  min-width: 280px
  max-width: 380px
```

### Animações
- **Entrada**: `translateX(420px) → translateX(0)` (350ms)
- **Saída**: `translateX(0) → translateX(420px) + scale(0.95)` (350ms)
- **Shake**: Animação para erros
- **Pulse**: Animação para level up

## 📱 Responsividade

### Desktop (> 768px)
- Width: 280px - 380px
- Padding: 12px 16px
- Ícone: 40x40px
- Fonte Título: 14px
- Fonte Mensagem: 13px

### Tablet (≤ 768px)
- Width: 100% - 16px margin
- Padding: 10px 12px
- Ícone: 36x36px
- Fonte Título: 13px
- Fonte Mensagem: 12px

### Mobile (≤ 480px)
- Padding: 8px 10px
- Ícone: 32x32px
- Fonte Título: 12px
- Fonte Mensagem: 11px
- Valores: 110% (menor)

## 🔧 API Completa

### Métodos Principais

```javascript
// Notificação genérica
notifications.show(message, type, options);

// Atalhos
notifications.success(message, options);
notifications.error(message, options);
notifications.warning(message, options);
notifications.info(message, options);

// Especializadas
notifications.gold(amount, gained);
notifications.levelUp(level, skill);
notifications.xp(amount, skill);
notifications.item(itemName, quantity, itemId);
notifications.harvest(itemName, quantity, itemId);
notifications.quest(questName, rewards);
notifications.achievement(name, description);

// Utilitários
notifications.clearAll();
notifications.hide(notificationElement);
```

### Options

```javascript
{
  title: "Título da Notificação",
  duration: 3000,                // ms (0 = infinito)
  icon: "<img src='...' alt=''>",// HTML do ícone
  closable: false,               // Mostra botão fechar
  itemId: "wheat",              // ID do item (para ícone)
  itemName: "Trigo",            // Nome do item
  quantity: 5                    // Quantidade do item
}
```

## 🎨 Classes CSS Customizáveis

```css
/* Container */
.notifications-container

/* Notificação */
.notification
.notification.show
.notification.hide
.notification.success
.notification.error
.notification.warning
.notification.info
.notification.levelup
.notification.gold
.notification.item

/* Elementos */
.notification-icon
.notification-icon-emoji
.notification-content
.notification-title
.notification-message
.notification-close
.notification-progress

/* Values */
.notification-value
.notification-value.gold-value
.notification-value.xp-value
.notification-value.positive
.notification-value.negative

/* Item Display */
.notification-item-display
.notification-item-name
```

## 💡 Exemplos de Uso

### Colheita de Cultura
```javascript
// No GameEngine.js
const cropData = this.farmSystem.getCropData(result.crop);
const cropName = i18n.getCurrentLanguage() === "pt-BR" 
  ? cropData.namePtBR 
  : cropData.name;

notifications.harvest(cropName, result.amount, result.crop);
// Resultado: "Colheu 3x Milho 🌽" com ícone PNG
```

### Compra no Mercado
```javascript
// No MarketUI.js
const itemName = item.namePtBR || item.name;
notifications.item(itemName, amount, item.id);

setTimeout(() => {
  notifications.gold(totalCost, false);
}, 300);
// Mostra primeiro o item recebido, depois o ouro gasto
```

### Venda no Mercado
```javascript
// No MarketUI.js
notifications.gold(totalValue, true);
// Mostra ouro recebido
```

### Juros do Banco
```javascript
notifications.show(
  `Banco: Você recebeu +${amount}g de juros!`,
  "gold",
  {
    icon: '<img src="./assets/sprites/ouro.png" alt="Ouro">',
    duration: 4000,
  }
);
```

### Level Up com Colheita
```javascript
if (result.levelUp) {
  notifications.levelUp(result.newLevel, "Agricultura");
  
  // Mostra colheita depois do level up
  setTimeout(() => {
    notifications.harvest(cropName, result.amount, result.crop);
  }, 500);
}
```

## 🔄 Migração da Versão Antiga

### Antes (v0.0.12)
```javascript
notifications.show(
  `Colheu +${amount}x ${cropName}`,
  "success"
);
```

### Agora (v0.0.13)
```javascript
notifications.harvest(cropName, amount, cropId);
```

### Antes
```javascript
notifications.show(
  `Recebeu ${itemName} x${amount}`,
  "info",
  { icon: "📦" }
);
```

### Agora
```javascript
notifications.item(itemName, amount, itemId);
```

### Antes
```javascript
notifications.show(
  `+${amount}g`,
  "gold",
  { icon: '<img src="..." style="width: 1em; ...">'}
);
```

### Agora
```javascript
notifications.gold(amount, true);
```

## ✅ Checklist de Qualidade

- [x] Design profissional e elegante
- [x] Identidade visual da fazenda (marrom/terra com verde)
- [x] Ícones PNG integrados
- [x] Leve e performático
- [x] Responsivo (mobile, tablet, desktop)
- [x] Modo claro e escuro
- [x] Destaque automático de valores
- [x] Cache de ícones
- [x] Animações suaves
- [x] Internacionalização (i18n)
- [x] Sem quebras de código
- [x] Zero erros de diagnóstico

## 🎯 Próximos Passos

1. ✅ Sistema base implementado
2. ✅ Integração com colheita
3. ✅ Integração com mercado
4. ✅ Integração com banco
5. ⏳ Integração com NPCs
6. ⏳ Integração com missões
7. ⏳ Integração com conquistas
8. ⏳ Sons de notificações (opcional)
9. ⏳ Haptic feedback para mobile (opcional)

## 📝 Notas Importantes

- **Sempre use `itemId`** quando disponível para mostrar o ícone PNG correto
- **Cache automático** de ícones para melhor performance
- **Não use inline styles** nas imagens - o CSS cuida disso
- **Prefira métodos específicos** (`harvest`, `gold`, `item`) ao invés do genérico `show`
- **Sequencie notificações** com `setTimeout` quando necessário
- **Mantenha duração curta** para mobile (2500-3000ms)

## 🐛 Troubleshooting

### Ícone não aparece
- Verifique se o `itemId` está correto
- Verifique se o sprite existe em `/assets/sprites/`
- Adicione o mapeamento em `getItemIcon()` se necessário

### Notificação muito grande no mobile
- O CSS é responsivo - verifique se não tem override
- Verifique media queries

### Texto cortado
- Use `word-wrap: break-word` (já aplicado)
- Mantenha mensagens concisas

### Performance ruim
- Reduza `maxVisible` se necessário
- Verifique se há memory leaks
- Use cache de ícones (já implementado)

---

**Versão**: 0.0.13  
**Data**: Janeiro 2025  
**Status**: ✅ Produção  
**Compatibilidade**: Desktop, Tablet, Mobile (Android/iOS)