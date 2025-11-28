# 🚀 Como Fazer Redeploy no Amplify

## Método 1: Via Console AWS (Mais Simples)

### Passo 1: Acessar o Console
1. Acesse: https://console.aws.amazon.com/amplify/
2. Faça login na sua conta AWS

### Passo 2: Selecionar Aplicação
1. Clique na sua aplicação (provavelmente `main` ou o nome que você deu)

### Passo 3: Fazer Redeploy
1. No menu lateral, clique em **"Redeploy this version"** (se aparecer)
2. **OU** vá em **"App settings" > "Build settings"**
3. Clique em **"Redeploy this version"**
4. Aguarde o build e deploy (5-10 minutos)

---

## Método 2: Fazer Push no Repositório (Dispara Deploy Automático)

Se o Amplify está conectado ao GitHub, fazer um commit e push dispara o deploy automaticamente:

```powershell
git add .
git commit -m "Atualizar configuração para produção"
git push
```

---

## Método 3: Via AWS CLI (Se tiver App ID)

Se você souber o App ID e Branch Name:

```powershell
aws amplify start-job --app-id dclv4sf0nhoba --branch-name main --job-type RELEASE --region us-east-1
```

---

## ✅ Verificar se Funcionou

Após o redeploy:
1. Acesse: https://main.dclv4sf0nhoba.amplifyapp.com/
2. A página deve carregar (não mais a mensagem de boas-vindas)
3. Teste fazer login

---

## 🔧 Se o Frontend Ainda Não Funcionar

Verifique:
1. Se a variável `NEXT_PUBLIC_API_URL` está configurada corretamente
2. Se o build foi bem-sucedido (veja os logs no console)
3. Se há erros no console do navegador (F12)

