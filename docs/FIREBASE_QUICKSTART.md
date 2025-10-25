# 🔥 Firebase Quick Start - FazendaRPG

## ⚡ Setup Rápido (5 minutos)

### 1️⃣ Criar Projeto Firebase
1. Acesse: https://console.firebase.google.com/
2. Clique em "Adicionar projeto"
3. Nome: `fazendarpg`
4. Desabilite Google Analytics
5. Clique em "Criar projeto"

### 2️⃣ Registrar App Web
1. Clique no ícone `</>` (Web)
2. Nome: `FazendaRPG Web`
3. Clique em "Registrar app"
4. **COPIE as credenciais** (firebaseConfig)

### 3️⃣ Ativar Google Sign-In
1. Menu lateral > "Authentication"
2. "Get started" > "Sign-in method"
3. Clique em "Google" > Ative o toggle
4. Selecione seu email de suporte
5. Clique em "Save"

### 4️⃣ Criar Firestore Database
1. Menu lateral > "Firestore Database"
2. "Create database"
3. **"Production mode"**
4. Localização: `southamerica-east1` (Brasil)
5. "Enable"

### 5️⃣ Configurar Regras de Segurança
1. Aba "Rules"
2. Delete tudo e cole:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /saves/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Clique em "Publish"

### 6️⃣ Configurar o Código
1. Abra: `FazendaRPG/js/core/FirebaseManager.js`
2. Localize (linha ~18):
```javascript
this.firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  // ...
```
3. Substitua pelas suas credenciais do **Passo 2**
4. Salve o arquivo

### 7️⃣ Testar
1. Recarregue o jogo (`Ctrl+Shift+R`)
2. Menu > Configurações > "☁️ Save na Nuvem"
3. Clique em "🔐 Entrar com Google"
4. Faça login
5. **Pronto!** ✅

---

## 🎮 Como Usar

### Login
- Configurações > "🔐 Entrar com Google"
- Login com 1 clique

### Auto-Save
- Salva automaticamente LOCAL + NUVEM a cada 60s
- Funciona 100% offline

### Multi-Dispositivo
1. Faça login no PC
2. Faça login no celular (mesma conta)
3. Seu save aparece automaticamente! 🎉

### Carregar Save da Nuvem
- Configurações > "☁️📂 Carregar da Nuvem"

### Salvar Manualmente
- Configurações > "☁️💾 Salvar na Nuvem"

---

## 🔒 Segurança

✅ **Seus dados são seguros:**
- Só você pode acessar seu save
- Criptografia em trânsito (HTTPS)
- Regras de segurança no Firestore
- Backup automático do Firebase

❌ **NUNCA compartilhe:**
- Suas credenciais do Firebase
- Arquivo `FirebaseManager.js` em repos públicos

---

## 💰 Preço

**100% GRÁTIS** para jogos indie!

Limites do plano gratuito:
- ✅ 50.000 logins/mês
- ✅ 50.000 leituras/dia
- ✅ 20.000 escritas/dia
- ✅ 1 GB armazenamento
- ✅ 10 GB bandwidth/mês

**Mais que suficiente!** 🎉

---

## 🐛 Problemas Comuns

### "Firebase SDK not loaded"
- Verifique sua internet
- Limpe o cache do navegador

### "Firebase not configured"
- Verifique as credenciais em `FirebaseManager.js`
- Certifique-se de não ter erros de sintaxe

### "Permission denied"
- Verifique as regras do Firestore (Passo 5)
- Publique as regras novamente

### "Popup blocked"
- Permita popups no navegador
- Ou use no mobile (usa redirect)

---

## 📚 Documentação Completa

Para mais detalhes, veja: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

---

## ✅ Checklist

- [ ] Projeto Firebase criado
- [ ] App Web registrado
- [ ] Google Auth ativado
- [ ] Firestore criado
- [ ] Regras de segurança configuradas
- [ ] Credenciais no código
- [ ] Testado login
- [ ] Testado save na nuvem
- [ ] Testado multi-dispositivo

---

## 🎉 Pronto!

Agora você tem:
- ✅ Login com Google em 1 clique
- ✅ Save automático na nuvem
- ✅ Multi-dispositivo
- ✅ Nunca mais perder progresso
- ✅ Funciona offline

**Boa fazendagem!** 🌾

---

**Dúvidas?** Veja a [documentação completa](./FIREBASE_SETUP.md) ou abra uma issue no GitHub.

**Versão**: 0.0.18