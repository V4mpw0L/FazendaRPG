# 🧪 INSTRUÇÕES DE TESTE - FazendaRPG

## ⚠️ ANTES DE TESTAR

1. **Limpe o LocalStorage:**
   - F12 → Application → Local Storage
   - Delete todos os itens `fazendarpg_*`
   - OU use `test-debug.html` e clique "Clear All"

2. **Recarregue a página:**
   - CTRL + SHIFT + R (hard reload)

---

## ✅ TESTE 1: NOVO JOGO

1. Abra `index.html`
2. Digite um nome
3. Clique "Começar Aventura"
4. **RESULTADO ESPERADO:**
   - Tela da fazenda aparece
   - Topbar mostra: 100 ouro, 100/100 energia, level 1, farming 1
   - 9 tiles vazios aparecem
   - NENHUM erro no console

---

## ✅ TESTE 2: TOPBAR FIXA

1. Role a página para baixo
2. **RESULTADO ESPERADO:**
   - Topbar PERMANECE FIXA no topo
   - Não se move junto com a página

---

## ✅ TESTE 3: PLANTAR

1. Clique em um tile vazio
2. Selecione "Wheat Seed"
3. Clique "Plantar"
4. **RESULTADO ESPERADO:**
   - Tile fica verde com ícone 🌾
   - Timer aparece (ex: "2:00")
   - Energia diminui para 95
   - Inventário perde 1 wheat_seed
   - Console mostra: `✅ Planted wheat at tile X`

---

## ✅ TESTE 4: COLHER

1. Aguarde o timer zerar (ou edite o tempo no código)
2. Clique no tile pronto
3. **RESULTADO ESPERADO:**
   - Wheat é adicionado ao inventário (+2 wheat)
   - XP de farming aumenta (+25 XP)
   - **BARRA DE XP NA TOPBAR ATUALIZA** ← IMPORTANTE!
   - Console mostra:
     ```
     🧺 Harvesting tile X
     ✅ Harvested 2x wheat from tile X
     🔔 EVENT: inventory:itemAdded { itemId: 'wheat', amount: 2 }
     🔔 EVENT: player:skillXpChanged { skill: 'farming', xp: 25, level: 1 }
     🔔 EVENT: player:xpChanged { xp: 2, level: 1 }
     ```

---

## ✅ TESTE 5: INVENTÁRIO

1. Abra o menu (☰)
2. Clique em "Inventário"
3. **RESULTADO ESPERADO:**
   - Wheat aparece no inventário (2x)
   - Fertilizer aparece (3x)
   - Gold total mostrado embaixo

4. Clique no Wheat
5. **RESULTADO ESPERADO:**
   - Modal de detalhes abre
   - Mostra ícone, nome, descrição, stats

6. Clique "Vender"
7. **RESULTADO ESPERADO:**
   - Modal de detalhes FECHA
   - Modal de venda ABRE (sem tela ofuscada!)
   - Mostra quantidade, valor unitário

8. Digite quantidade e clique "Vender"
9. **RESULTADO ESPERADO:**
   - Modal fecha
   - Gold aumenta
   - Inventário atualiza (wheat diminui)
   - Notificação de sucesso aparece

---

## ✅ TESTE 6: SAVE/LOAD

1. Faça várias ações (plantar, colher, vender)
2. Anote seu gold, energy, inventário
3. Recarregue a página (F5)
4. **RESULTADO ESPERADO:**
   - Tela "Welcome back!" aparece
   - Todos os dados PERSISTEM:
     - Gold igual
     - Energy igual
     - Inventário igual
     - Farm igual (crops plantados ainda lá)

---

## ✅ TESTE 7: XP BAR

1. Va para tela "Sua Fazenda"
2. Observe a barra de XP abaixo do título
3. Plante e colha várias vezes
4. **RESULTADO ESPERADO:**
   - Barra de XP ATUALIZA em tempo real
   - Mostra "X / Y XP"
   - Barra verde preenche conforme progride

---

## ✅ TESTE 8: SKILLS

1. Abra menu → Skills
2. **RESULTADO ESPERADO:**
   - Farming mostra level e XP corretos
   - Barra de progresso atualiza
   - Outras skills aparecem (level 1, 0 XP)

---

## 🐛 SE ALGO FALHAR

1. Abra o console (F12)
2. Procure por erros em vermelho
3. Copie e cole o erro
4. Verifique os eventos (ver DEBUG.md)

---

## 🎯 CHECKLIST FINAL

- [ ] Topbar FIXA (não rola com página)
- [ ] XP aparece e atualiza na barra de "Sua Fazenda"
- [ ] Inventário persiste após reload
- [ ] Modal de venda abre corretamente
- [ ] Save/load funciona 100%
- [ ] Nenhum erro no console
- [ ] Farming funciona end-to-end

**SE TODOS OS ITENS ESTIVEREM OK, O JOGO ESTÁ FUNCIONAL!** ✅

