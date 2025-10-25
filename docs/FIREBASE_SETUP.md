# 🔥 Guia de Configuração do Firebase - FazendaRPG

Este guia explica como configurar o Firebase para habilitar **saves na nuvem** com **login do Google** no FazendaRPG.

## 📋 **Pré-requisitos**

- Conta Google
- 10 minutos de tempo
- **Tudo é GRÁTIS!** (até 50k usuários/dia)

---

## 🚀 **Passo 1: Criar Projeto no Firebase**

### 1.1 Acesse o Firebase Console
Vá para: [https://console.firebase.google.com/](https://console.firebase.google.com/)

### 1.2 Criar Novo Projeto
1. Clique em **"Adicionar projeto"** ou **"Create a project"**
2. Nome do projeto: `fazendarpg` (ou o nome que preferir)
3. Clique em **Continuar**
4. **Desabilite** Google Analytics (não é necessário)
5. Clique em **Criar projeto**
6. Aguarde a criação (30 segundos)

---

## 🌐 **Passo 2: Registrar App Web**

### 2.1 Adicionar App Web ao Projeto
1. Na tela inicial do projeto, clique no ícone **`</>`** (Web)
2. Nome do app: `FazendaRPG Web`
3. **Marque** a opção: "Firebase Hosting" (opcional, mas recomendado)
4. Clique em **Registrar app**

### 2.2 Copiar Configurações
Você verá um código JavaScript como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "fazendarpg.firebaseapp.com",
  projectId: "fazendarpg",
  storageBucket: "fazendarpg.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

**⚠️ GUARDE ESSAS INFORMAÇÕES!** Vamos usar no Passo 4.

---

## 🔐 **Passo 3: Configurar Autenticação Google**

### 3.1 Ativar Google Sign-In
1. No menu lateral, clique em **"Authentication"** (Autenticação)
2. Clique em **"Get started"** (Começar)
3. Clique na aba **"Sign-in method"** (Método de login)
4. Clique em **"Google"**
5. **Ative** o toggle (deixe azul)
6. Em "Project support email", selecione seu email
7. Clique em **"Save"** (Salvar)

### 3.2 Adicionar Domínios Autorizados (Se necessário)
1. Na mesma tela, vá para a aba **"Settings"** > **"Authorized domains"**
2. Domínios que já vêm por padrão:
   - `localhost` (para desenvolvimento)
   - `seu-projeto.firebaseapp.com`
   - `seu-projeto.web.app`
3. **Se você tiver um domínio customizado**, adicione aqui:
   - Clique em **"Add domain"**
   - Digite seu domínio (ex: `fazendarpg.com`)
   - Clique em **"Add"**

---

## 📁 **Passo 4: Configurar Firestore Database**

### 4.1 Criar Banco de Dados
1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Create database"** (Criar banco de dados)
3. **Importante**: Selecione **"Start in production mode"** (vamos configurar as regras em seguida)
4. Escolha a localização mais próxima (ex: `southamerica-east1` para Brasil)
5. Clique em **"Enable"** (Ativar)

### 4.2 Configurar Regras de Segurança
1. Na aba **"Rules"** (Regras)
2. **DELETE** todo o conteúdo atual
3. **COLE** este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regra para a coleção de saves
    match /saves/{userId} {
      // Usuário só pode ler/escrever seu próprio save
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Bloquear acesso a outras coleções
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. Clique em **"Publish"** (Publicar)

**✅ Pronto!** Agora os usuários só podem acessar seus próprios saves.

---

## 🔧 **Passo 5: Configurar o Código do FazendaRPG**

### 5.1 Abrir o Arquivo de Configuração
Abra o arquivo: `FazendaRPG/js/core/FirebaseManager.js`

### 5.2 Localizar as Configurações
Procure por estas linhas (linhas 18-24):

```javascript
this.firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5.3 Substituir pelos Seus Dados
Cole as configurações que você copiou no **Passo 2.2**:

```javascript
this.firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "fazendarpg.firebaseapp.com",
  projectId: "fazendarpg",
  storageBucket: "fazendarpg.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

### 5.4 Salvar o Arquivo
Salve o arquivo (`Ctrl+S` ou `Cmd+S`)

---

## 🧪 **Passo 6: Testar**

### 6.1 Recarregar o Jogo
1. Abra o FazendaRPG no navegador
2. Pressione `Ctrl+Shift+R` (ou `Cmd+Shift+R` no Mac) para recarregar sem cache

### 6.2 Testar Login
1. Abra o **Menu** (☰)
2. Vá em **Configurações** ⚙️
3. Role até a seção **☁️ Save na Nuvem**
4. Clique em **"🔐 Entrar com Google"**
5. Escolha sua conta Google
6. Autorize o acesso

### 6.3 Verificar Sincronização
Você deve ver:
- ✅ Seu nome e foto
- ✅ Status "CONECTADO"
- ✅ "Última sincronização: agora mesmo"

### 6.4 Testar Save na Nuvem
1. Faça algum progresso no jogo
2. O jogo salva automaticamente a cada 60 segundos
3. **OU** clique em **"☁️💾 Salvar na Nuvem"** manualmente

### 6.5 Verificar no Firebase Console
1. Volte para o Firebase Console
2. Vá em **Firestore Database**
3. Você deve ver:
   - Coleção: `saves`
   - Documento: seu `userId`
   - Dados: todo o progresso do jogo

---

## 📱 **Passo 7: Testar Multi-Dispositivo**

### 7.1 Abrir em Outro Dispositivo
1. Abra o FazendaRPG no celular (ou outro PC)
2. Faça login com a **mesma conta Google**
3. **MÁGICA!** Seu save aparece automaticamente! 🎉

### 7.2 Testar Sincronização
1. Jogue no PC, faça progresso
2. Abra no celular
3. Clique em **"☁️📂 Carregar da Nuvem"**
4. Seu progresso do PC aparece no celular! ✅

---

## 🔒 **Segurança**

### ✅ Dados Seguros
- ✅ Só **você** pode acessar seu save
- ✅ Ninguém mais pode ler ou modificar seus dados
- ✅ Dados criptografados em trânsito (HTTPS)
- ✅ Backup automático do Firebase

### 🚫 O que NÃO fazer
- ❌ **NUNCA** compartilhe suas credenciais do Firebase
- ❌ **NUNCA** commit o arquivo `FirebaseManager.js` com suas credenciais em repositórios públicos
- ❌ **NUNCA** mude as regras do Firestore para `allow read, write: if true` (público)

---

## 🐛 **Troubleshooting (Solução de Problemas)**

### Problema 1: "Firebase SDK not loaded"
**Causa**: Scripts do Firebase não carregaram  
**Solução**: 
1. Verifique sua conexão com internet
2. Verifique se os scripts estão no `index.html` (linhas 789-791)
3. Tente limpar o cache do navegador

### Problema 2: "Firebase not configured"
**Causa**: Credenciais não foram configuradas  
**Solução**: 
1. Verifique se você substituiu as credenciais no `FirebaseManager.js`
2. Verifique se não tem erros de sintaxe (vírgulas, aspas)

### Problema 3: "Permission denied"
**Causa**: Regras do Firestore incorretas  
**Solução**: 
1. Vá no Firebase Console > Firestore > Rules
2. Copie as regras do **Passo 4.2** novamente
3. Clique em "Publish"

### Problema 4: "Popup blocked"
**Causa**: Navegador bloqueou popup de login  
**Solução**: 
1. Permita popups para o site
2. Ou use o **modo mobile** (usa redirect ao invés de popup)

### Problema 5: Login funciona mas não salva
**Causa**: Usuário não tem permissão  
**Solução**: 
1. Abra o Console do navegador (F12)
2. Veja se há erros relacionados ao Firestore
3. Verifique as regras do Firestore (Passo 4.2)

### Problema 6: "Multiple tabs open"
**Causa**: Offline persistence só funciona em uma aba  
**Solução**: 
1. Isso é normal e não afeta a funcionalidade
2. Apenas um aviso, pode ignorar

---

## 💡 **Dicas e Truques**

### Auto-Save Inteligente
O jogo salva automaticamente:
- ✅ A cada 60 segundos
- ✅ Ao fechar o jogo
- ✅ Ao fazer qualquer alteração importante

### Modo Offline
O jogo funciona **100% offline**:
- ✅ Se você perder internet, continua funcionando
- ✅ Salva localmente no localStorage
- ✅ Quando a internet voltar, sincroniza automaticamente

### Sincronização Inteligente
O sistema é inteligente:
- ✅ Compara timestamps (local vs nuvem)
- ✅ Sempre usa o save mais recente
- ✅ Nunca sobrescreve progresso mais novo

### Backup Manual
Mesmo com cloud saves, você pode:
- ✅ Exportar save para arquivo (Configurações > 💾 Salvar Jogo)
- ✅ Manter backups locais
- ✅ Compartilhar saves com amigos

---

## 📊 **Monitoramento**

### Ver Estatísticas de Uso
1. Firebase Console > Analytics (se ativou)
2. Authentication > Users (ver usuários logados)
3. Firestore > Data (ver saves armazenados)

### Limites Gratuitos (Spark Plan)
- ✅ **Autenticação**: 50.000 logins/mês (grátis)
- ✅ **Firestore Leitura**: 50.000/dia (grátis)
- ✅ **Firestore Escrita**: 20.000/dia (grátis)
- ✅ **Armazenamento**: 1 GB (grátis)
- ✅ **Bandwidth**: 10 GB/mês (grátis)

**Para um jogo indie, isso é mais que suficiente!** 🎉

---

## 🚀 **Próximos Passos (Opcional)**

### Melhorias Futuras
1. **Firebase Hosting**: Hospede o jogo de graça
2. **Cloud Functions**: Processamento server-side
3. **Analytics**: Rastrear eventos do jogo
4. **Remote Config**: Mudar configurações sem deploy
5. **Crashlytics**: Rastrear erros em produção

### Upgrade para Blaze Plan (Pago)
Só necessário se você **bombar**:
- 💰 Pay-as-you-go (paga só o que usar)
- 💰 ~$25/mês para 1M de usuários ativos
- 💰 Escala automaticamente

---

## 📞 **Suporte**

### Documentação Oficial
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)

### Comunidade
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
- [Firebase Discord](https://discord.gg/BN2cgc3)
- [Firebase Twitter](https://twitter.com/Firebase)

---

## ✅ **Checklist Final**

Antes de colocar em produção, verifique:

- [ ] Firebase projeto criado
- [ ] App Web registrado
- [ ] Google Auth ativado
- [ ] Firestore criado
- [ ] Regras de segurança configuradas
- [ ] Credenciais no `FirebaseManager.js`
- [ ] Testado login no PC
- [ ] Testado login no mobile
- [ ] Testado save na nuvem
- [ ] Testado load da nuvem
- [ ] Testado multi-dispositivo
- [ ] Backup local funciona
- [ ] Modo offline funciona

---

## 🎉 **Conclusão**

Parabéns! Você configurou com sucesso o Firebase no FazendaRPG! 🚀

Agora seus jogadores podem:
- ✅ Fazer login com 1 clique
- ✅ Salvar automaticamente na nuvem
- ✅ Jogar em qualquer dispositivo
- ✅ Nunca mais perder o progresso
- ✅ Funcionar 100% offline

**Divirta-se fazendando!** 🌾🎮

---

**Versão**: 0.0.18  
**Data**: Dezembro 2024  
**Autor**: FazendaRPG Team