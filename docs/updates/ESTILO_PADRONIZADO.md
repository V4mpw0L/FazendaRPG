# 🎨 Padronização de Estilos - Headers das Páginas

## ✅ Implementado

Todos os headers das páginas agora seguem o mesmo padrão visual do card de boas-vindas da fazenda!

### Páginas Afetadas:
- ✅ **Habilidades** (`#skills-screen .screen-header`)
- ✅ **Inventário** (`#inventory-screen .screen-header`)
- ✅ **Cidade** (`#city-screen .screen-header`)
- ✅ **Mercado** (`#market-screen .screen-header`)
- ✅ **Missões** (`#quests-screen .screen-header`)
- ✅ **NPCs** (`#npcs-screen .screen-header`)

### Características do Novo Estilo:

#### 🎨 Visual
- **Gradiente marrom/terra**: `linear-gradient(135deg, #8b6914 0%, #a0522d 40%, #654321 100%)`
- **Borda dourada**: `3px solid rgba(139, 105, 20, 0.6)`
- **Borda superior verde**: Efeito de linha verde brilhante no topo
- **Textura de terra**: Efeito de textura sutil com pseudo-elemento `::before`
- **Cantos arredondados**: `border-radius: 16px`

#### 💫 Efeitos
- **Sombras**: Múltiplas camadas de sombra para profundidade
- **Hover**: Elevação suave ao passar o mouse
- **Text-shadow**: Sombra no texto com brilho verde

#### 📱 Responsivo
- **Desktop**: `max-width: 550px`
- **Tablet (768px)**: `max-width: 95%`, fonte 1.4rem
- **Mobile (480px)**: Padding reduzido, fonte 1.3rem
- **Landscape**: Ajustes para orientação paisagem

#### 🌓 Temas
- **Light Theme**: Tons mais claros, sombras suaves
- **Dark Theme**: Tons mais escuros, brilho verde mais intenso

### Arquivos Modificados:
1. `style/main.css` - Estilo base do `.screen-header`
2. `style/themes.css` - Variações para tema claro/escuro
3. `style/mobile.css` - Responsividade

### Código Principal:

```css
.screen-header {
    background: linear-gradient(135deg, #8b6914 0%, #a0522d 40%, #654321 100%);
    border: 3px solid rgba(139, 105, 20, 0.6);
    border-radius: 16px;
    /* + efeitos de textura e borda verde */
}

.screen-header h2 {
    color: white;
    font-size: 1.8rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(92, 170, 31, 0.3);
}
```

## 🎯 Resultado

Agora todas as páginas têm um visual consistente e profissional, mantendo a identidade visual de fazenda/terra com toques verdes! 🌾
