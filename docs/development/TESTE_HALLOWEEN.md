# 🎃 Teste Rápido - Evento de Halloween

Guia rápido para testar o sistema de eventos de Halloween implementado.

## 🚀 Como Testar

### 1. Abra o jogo no navegador

```
http://localhost:8000
```

### 2. Abra o Console (F12 ou Ctrl+Shift+I)

### 3. Execute o comando para iniciar o Halloween

```javascript
FazendaRPG.debug.startHalloween()
```

### 4. O que deve acontecer:

✅ **Notificação aparece**: "🎃 Evento de Halloween Iniciado!"

✅ **Teias de aranha aparecem nos 4 cantos da tela** (SVG com opacidade 0.6)

✅ **Uma abóbora aparece em posição aleatória** (pumpkin2.png ou pumpkin3.png)

✅ **A abóbora tem animação de bounce** (sobe e desce suavemente)

✅ **A cada 2 segundos a abóbora muda de posição** (movimento suave)

✅ **Ao clicar na abóbora**:
   - Aparece texto flutuante: "+1 ⚡ +1 💰"
   - Energia aumenta em +1
   - Ouro aumenta em +1
   - TopBar é atualizada
   - Console mostra: "🎃 +1 Energia, +1 Ouro!"

✅ **Você pode clicar várias vezes** (cliques ilimitados enquanto ela estiver visível)

✅ **Após 8-15 segundos** a abóbora desaparece

✅ **Após 5 segundos** uma nova abóbora aparece

## 🎮 Comandos Úteis

```javascript
// Iniciar Halloween
FazendaRPG.debug.startHalloween()

// Parar Halloween
FazendaRPG.debug.stopHalloween()

// Verificar se está ativo
FazendaRPG.debug.listEvents()

// Ver energia e ouro atual
FazendaRPG.debug.getPlayer()

// Adicionar energia manualmente (teste)
FazendaRPG.debug.setEnergy(50)

// Adicionar ouro manualmente (teste)
FazendaRPG.debug.addGold(100)
```

## ✅ Checklist de Testes

### Funcionalidade Básica
- [ ] Evento inicia sem erros
- [ ] Decorações aparecem (teias nos cantos)
- [ ] Abóbora spawna em posição aleatória
- [ ] Abóbora tem animação de bounce
- [ ] Abóbora se move a cada 2 segundos

### Mecânica de Clique
- [ ] Clicar na abóbora dá +1 energia
- [ ] Clicar na abóbora dá +1 ouro
- [ ] TopBar é atualizada (valores mudam)
- [ ] Efeito visual aparece (+1 ⚡ +1 💰)
- [ ] Pode clicar múltiplas vezes
- [ ] Console mostra mensagem de recompensa

### Spawning
- [ ] Abóbora desaparece após 8-15 segundos
- [ ] Nova abóbora aparece após 5 segundos
- [ ] Alterna entre pumpkin2.png e pumpkin3.png (veja diferentes sprites)

### Parar Evento
- [ ] Comando `stopHalloween()` funciona
- [ ] Decorações são removidas
- [ ] Abóbora atual desaparece
- [ ] Notificação de encerramento aparece
- [ ] Novas abóboras não aparecem mais

### Persistência
- [ ] Iniciar evento
- [ ] Recarregar página (F5)
- [ ] Evento continua ativo após reload
- [ ] Parar evento e recarregar
- [ ] Evento não inicia automaticamente

## 🐛 Problemas Comuns

### "Evento não inicia"
```javascript
// Verificar se EventManager existe
console.log(FazendaRPG.engine.eventManager)

// Verificar eventos registrados
FazendaRPG.debug.listEvents()
```

### "Abóbora não aparece"
```javascript
// Verificar se evento está realmente ativo
FazendaRPG.debug.listEvents()
// Deve mostrar: { name: 'halloween', active: true }

// Aguardar 5 segundos (intervalo de spawn)

// Verificar console por erros
```

### "Cliques não dão recompensa"
```javascript
// Verificar Player
console.log(FazendaRPG.engine.player)

// Verificar TopBar
console.log(FazendaRPG.engine.topBar)

// Ver energia/ouro antes e depois do clique
FazendaRPG.debug.getPlayer()
```

### "Decorações não aparecem"
```javascript
// Verificar elemento de decorações
document.getElementById('halloween-decorations')

// Deve retornar um elemento div com SVGs
```

## 📊 Teste de Performance

```javascript
// Iniciar evento
FazendaRPG.debug.startHalloween()

// Deixar rodando por 5 minutos

// Verificar:
// - Não deve ter vazamento de memória
// - Performance deve continuar boa
// - Abóboras devem continuar aparecendo
// - Timers devem funcionar corretamente
```

## 🎯 Teste Completo (Passo a Passo)

1. **Abra o jogo**
2. **Anote energia e ouro atual**
   ```javascript
   FazendaRPG.debug.getPlayer()
   // { energy: X, gold: Y, ... }
   ```

3. **Inicie o Halloween**
   ```javascript
   FazendaRPG.debug.startHalloween()
   ```

4. **Aguarde abóbora aparecer** (máx 5 segundos)

5. **Clique na abóbora 10 vezes**

6. **Verifique energia e ouro**
   ```javascript
   FazendaRPG.debug.getPlayer()
   // energia deve ser X+10
   // ouro deve ser Y+10
   ```

7. **Aguarde abóbora desaparecer** (8-15 seg)

8. **Aguarde nova abóbora** (5 seg)

9. **Pare o evento**
   ```javascript
   FazendaRPG.debug.stopHalloween()
   ```

10. **Verifique se tudo foi removido**
    - Decorações sumidas ✅
    - Abóbora sumida ✅
    - Notificação de encerramento ✅

## 🎨 Verificação Visual

### Decorações
- Teia canto superior esquerdo ✅
- Teia canto superior direito ✅
- Teia canto inferior esquerdo ✅
- Teia canto inferior direito ✅
- Opacidade 0.6 (levemente transparente) ✅

### Abóbora
- Tamanho: 80x80 pixels ✅
- Sombra (drop-shadow) ✅
- Animação bounce ✅
- Cursor pointer ao passar mouse ✅
- Hover aumenta tamanho (scale 1.1) ✅

### Efeito de Clique
- Texto "+1 ⚡ +1 💰" ✅
- Cor laranja (#ff6600) ✅
- Animação float up ✅
- Some após 1 segundo ✅

## 📱 Teste Mobile

Se estiver testando em mobile:

1. Abra DevTools mobile (F12 > Toggle device toolbar)
2. Selecione um dispositivo mobile
3. Execute os mesmos testes
4. Verifique:
   - Touch funciona para clicar ✅
   - Abóbora não fica fora da tela ✅
   - Decorações se adaptam ✅
   - Performance é boa ✅

## 🔄 Teste de Reload

```javascript
// 1. Iniciar evento
FazendaRPG.debug.startHalloween()

// 2. Verificar que está ativo
FazendaRPG.debug.listEvents()
// { name: 'halloween', active: true }

// 3. Recarregar página (F5)

// 4. Após reload, verificar novamente
FazendaRPG.debug.listEvents()
// Deve continuar: { name: 'halloween', active: true }

// 5. Decorações e abóboras devem voltar a aparecer
```

## ✨ Teste de Múltiplos Eventos (Futuro)

```javascript
// Quando mais eventos forem adicionados:

// Listar todos
FazendaRPG.debug.listEvents()

// Iniciar múltiplos
FazendaRPG.debug.startHalloween()
// FazendaRPG.debug.startChristmas() // futuro

// Verificar que ambos estão ativos

// Parar todos
const em = FazendaRPG.debug.getEventManager()
em.stopAllEvents()
```

## 📝 Resultado Esperado

Ao final dos testes, você deve ter:

✅ Evento de Halloween funcionando perfeitamente
✅ Recompensas sendo dadas corretamente
✅ Visual agradável e não intrusivo
✅ Performance boa
✅ Persistência funcionando
✅ Sem erros no console

## 🎉 Sucesso!

Se todos os testes passaram, o sistema de eventos está **100% funcional** e pronto para uso!

Agora você pode:
- Deixar o Halloween ativo permanentemente
- Ativar apenas em outubro
- Criar novos eventos seguindo o mesmo padrão
- Adicionar mais mecânicas ao Halloween

**Divirta-se clicando nas abóboras! 🎃**

---

**Dúvidas ou problemas?**
Consulte: `docs/EVENTOS.md` ou `SISTEMA_EVENTOS_IMPLEMENTADO.md`
