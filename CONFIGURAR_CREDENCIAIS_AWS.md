# 🔑 Configurar Credenciais AWS

## ✅ Passo 1: AWS CLI Instalado

O AWS CLI já está instalado! ✅

## 📋 Passo 2: Obter Credenciais AWS

### 2.1 Acessar Console AWS

1. Acesse: **https://console.aws.amazon.com/**
2. Faça login na sua conta AWS
   - Se não tiver conta, crie uma em: https://aws.amazon.com/pt/free/

### 2.2 Criar Access Key

1. No canto superior direito, clique no seu **nome de usuário**
2. Clique em **"Security credentials"** (Credenciais de segurança)
3. Role a página até encontrar **"Access keys"**
4. Clique em **"Create access key"** (Criar chave de acesso)
5. Escolha **"Command Line Interface (CLI)"**
6. Marque a caixa de confirmação
7. Clique em **"Next"**
8. (Opcional) Adicione uma descrição como "Deploy Unima Health"
9. Clique em **"Create access key"**

### 2.3 Salvar Credenciais

**⚠️ IMPORTANTE: Salve essas informações agora!**

Você verá:

- **Access key ID:** `AKIAIOSFODNN7EXAMPLE` (exemplo)
- **Secret access key:** `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` (exemplo)

**A Secret access key só aparece UMA VEZ!**

**Salve em um local seguro:**

- Copie e cole em um arquivo de texto temporário
- Ou anote em um gerenciador de senhas
- **NÃO compartilhe essas credenciais!**

10. Clique em **"Done"**

---

## 📋 Passo 3: Configurar Credenciais no Terminal

No PowerShell, execute:

```powershell
aws configure
```

**Responda as perguntas:**

1. **AWS Access Key ID:**
   - Cole a Access Key ID que você copiou
   - Pressione Enter

2. **AWS Secret Access Key:**
   - Cole a Secret Access Key que você copiou
   - Pressione Enter

3. **Default region name:**
   - Digite: `us-east-1` (ou escolha outra região)
   - Pressione Enter
   - **Regiões comuns:**
     - `us-east-1` - N. Virginia (mais barato)
     - `us-west-2` - Oregon
     - `sa-east-1` - São Paulo (Brasil)

4. **Default output format:**
   - Digite: `json`
   - Pressione Enter

---

## ✅ Passo 4: Verificar Configuração

Teste se está funcionando:

```powershell
aws sts get-caller-identity
```

Deve retornar algo como:

```json
{
  "UserId": "AIDA...",
  "Account": "123456789012",
  "Arn": "arn:aws:iam::123456789012:user/seu-usuario"
}
```

Se aparecer isso, está configurado corretamente! ✅

---

## 🆘 Problemas

**Erro: "Unable to locate credentials"**

- Execute `aws configure` novamente
- Verifique se copiou as credenciais corretamente

**Erro: "Invalid credentials"**

- Verifique se copiou a Access Key ID e Secret Access Key corretamente
- Crie uma nova access key se necessário

**Não consigo criar access key:**

- Verifique se você tem permissões na conta AWS
- Se for uma conta organizacional, pode precisar de permissão do administrador

---

## 🎯 Próximo Passo

Após configurar as credenciais, continue com:

- **Passo 3 do DEPLOY_GUIDE.md:** Criar banco de dados RDS
