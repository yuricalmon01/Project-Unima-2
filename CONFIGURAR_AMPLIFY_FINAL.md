# ✅ Configuração Final do Amplify

## Problema Identificado

O frontend ainda mostra a tela de boas-vindas porque a variável `NEXT_PUBLIC_API_URL` não está configurada no Amplify.

## Solução: Configurar Variável de Ambiente no Amplify

### Passo 1: Acessar Console Amplify

1. Acesse: https://console.aws.amazon.com/amplify/
2. Faça login na sua conta AWS
3. Selecione sua aplicação (a que está conectada ao repositório `Guilhermegg-06/Project-Unima-2`)

### Passo 2: Configurar Variável de Ambiente

1. No menu lateral, clique em **"App settings"**
2. Clique em **"Environment variables"**
3. Clique em **"Manage variables"** ou **"Add environment variable"**
4. Adicione a variável:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `http://unima-health-env.eba-ipsfzmqn.us-east-1.elasticbeanstalk.com`
5. Clique em **"Save"**

### Passo 3: Fazer Redeploy

1. Vá em **"App settings" > "Build settings"**
2. Clique em **"Redeploy this version"**
3. Aguarde o build e deploy (5-10 minutos)

---

## ⚠️ Sobre os Erros de Console

Os erros que você viu são avisos, não erros críticos:

1. **404 do favicon.ico** - Normal, não afeta o funcionamento
2. **Cross-Origin-Opener-Policy** - Aviso sobre HTTP vs HTTPS, mas o CORS já está configurado para aceitar

---

## 🔒 HTTPS no Backend (Opcional - Para Produção)

Para resolver completamente os avisos de HTTPS, você pode:

1. Configurar um certificado SSL no Elastic Beanstalk
2. Ou usar um Load Balancer com certificado (mas sua conta não tem permissão para criar load balancers)

Por enquanto, o HTTP funciona, mas os navegadores mostram avisos.

---

## ✅ Verificar se Funcionou

Após configurar a variável e fazer redeploy:

1. Acesse: https://main.dclv4sf0nhoba.amplifyapp.com/
2. A página deve carregar (não mais a mensagem de boas-vindas)
3. Teste fazer login:
   - Username: `admin`
   - Password: `123456`

---

## 📋 Checklist Final

- [x] Backend deployado e funcionando
- [x] Banco de dados configurado
- [x] Variáveis de ambiente do backend configuradas
- [ ] Variável `NEXT_PUBLIC_API_URL` configurada no Amplify
- [ ] Redeploy do frontend feito
- [ ] Teste de login funcionando
