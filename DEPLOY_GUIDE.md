# 🚀 Guia de Deploy - Passo a Passo

## ✅ Passo 1: EB CLI Instalado

- EB CLI está instalado e funcionando!

## 📋 Passo 2: Instalar e Configurar AWS CLI

### 2.1 Instalar AWS CLI

**Windows:**

1. Baixe o instalador MSI: https://awscli.amazonaws.com/AWSCLIV2.msi
2. Execute o instalador
3. Reinicie o terminal/PowerShell

**OU via PowerShell (como administrador):**

```powershell
# Baixar e instalar AWS CLI
Invoke-WebRequest -Uri "https://awscli.amazonaws.com/AWSCLIV2.msi" -OutFile "$env:TEMP\AWSCLIV2.msi"
Start-Process msiexec.exe -ArgumentList "/i $env:TEMP\AWSCLIV2.msi /quiet" -Wait
```

**Verificar instalação:**

```powershell
aws --version
```

### 2.2 Obter Credenciais AWS

1. Acesse: https://console.aws.amazon.com/
2. Faça login na sua conta AWS
3. No canto superior direito, clique no seu nome de usuário
4. Clique em **"Security credentials"**
5. Role até **"Access keys"**
6. Clique em **"Create access key"**
7. Escolha **"Command Line Interface (CLI)"**
8. Marque a caixa de confirmação
9. Clique em **"Next"**
10. (Opcional) Adicione uma descrição
11. Clique em **"Create access key"**
12. **IMPORTANTE:** Copie e salve:
    - **Access Key ID**
    - **Secret Access Key** (só aparece uma vez!)

### 2.3 Configurar Credenciais

No PowerShell, execute:

```powershell
aws configure
```

Digite quando solicitado:

- **AWS Access Key ID:** [cole sua Access Key ID]
- **AWS Secret Access Key:** [cole sua Secret Access Key]
- **Default region name:** `us-east-1` (ou escolha: us-west-2, sa-east-1, etc.)
- **Default output format:** `json`

**Testar configuração:**

```powershell
aws sts get-caller-identity
```

Deve retornar informações da sua conta AWS.

---

## 📋 Passo 3: Criar Banco de Dados RDS MySQL

### 3.1 Acessar Console RDS

1. Acesse: https://console.aws.amazon.com/rds/
2. Certifique-se de estar na região correta (canto superior direito)
3. Clique em **"Databases"** no menu lateral
4. Clique em **"Create database"**

### 3.2 Configurar Banco

**Método de criação:**

- Escolha **"Standard create"**

**Configurações do engine:**

- **Engine type:** MySQL
- **Engine version:** MySQL 8.0.40 (ou mais recente)
- **Templates:**
  - Para testes: **Free tier**
  - Para produção: **Production**

**Configurações:**

- **DB instance identifier:** `unima-health-db`
- **Master username:** `admin` (ou outro de sua escolha)
- **Master password:** [Crie uma senha forte - ANOTE ELA!]
- **Confirm password:** [Confirme a senha]

**Configurações de instância:**

- **DB instance class:**
  - Free tier: `db.t3.micro`
  - Produção: `db.t3.small` ou maior
- **Storage:**
  - **Storage type:** General Purpose SSD (gp3)
  - **Allocated storage:** 20 GB (mínimo)

**Conectividade:**

- **Virtual private cloud (VPC):** Default VPC (ou escolha uma)
- **Subnet group:** default (criado automaticamente)
- **Public access:** **Yes** (para facilitar conexão inicial)
- **VPC security group:** Create new
  - **New VPC security group name:** `unima-rds-sg`
- **Availability Zone:** No preference
- **Port:** 3306 (padrão MySQL)

**Autenticação:**

- **Database authentication:** Password authentication

### 3.3 Configurações Adicionais

**Backup:**

- **Automated backups:** Enabled (recomendado)
- **Backup retention period:** 7 days
- **Backup window:** No preference

**Monitoring:**

- **Enhanced monitoring:** Disabled (para economizar)

**Manutenção:**

- **Auto minor version upgrade:** Enabled
- **Maintenance window:** No preference

### 3.4 Criar Banco

1. Role até o final
2. Clique em **"Create database"**
3. Aguarde 5-10 minutos enquanto o banco é criado

### 3.5 Anotar Informações Importantes

Após a criação, anote:

- **Endpoint:** `unima-health-db.abc123.us-east-1.rds.amazonaws.com`
- **Port:** `3306`
- **Username:** `admin` (ou o que você escolheu)
- **Password:** [a senha que você criou]

### 3.6 Configurar Security Group (Permitir Conexões)

1. No console RDS, clique no seu banco de dados
2. Na aba **"Connectivity & security"**, encontre **"VPC security groups"**
3. Clique no link do security group (ex: `sg-abc123`)
4. Isso abrirá o console EC2
5. Na aba **"Inbound rules"**, clique em **"Edit inbound rules"**
6. Clique em **"Add rule"**
7. Configure:
   - **Type:** MySQL/Aurora
   - **Protocol:** TCP
   - **Port range:** 3306
   - **Source:**
     - Para testes: `0.0.0.0/0` (qualquer IP)
     - Para produção: Seu IP específico ou o Security Group do Elastic Beanstalk
8. Clique em **"Save rules"**

### 3.7 Importar Schema do Banco

**Opção 1: Via MySQL Workbench (Recomendado)**

1. Baixe MySQL Workbench: https://dev.mysql.com/downloads/workbench/
2. Instale e abra
3. Crie nova conexão:
   - **Hostname:** [unima-health-db.c3km682gmshq.us-east-2.rds.amazonaws.com]
   - **Port:** 3306
   - **Username:** admin
   - **Password:** [991316110]
4. Conecte
5. Abra o arquivo `Banco de dados.sql` ou `initdb/init.sql`
6. Execute o script

**Opção 2: Via Linha de Comando (se tiver MySQL instalado)**

```powershell
# Instalar MySQL client (se não tiver)
# Baixe de: https://dev.mysql.com/downloads/mysql/

# Conectar e importar
mysql -h unima-health-db.abc123.us-east-1.rds.amazonaws.com -u admin -p < "Banco de dados.sql"
```

---

## 📋 Passo 4: Preparar Projeto (JÁ FEITO ✅)

Os arquivos já estão prontos:

- ✅ `.ebextensions/nodecommand.config`
- ✅ `.ebignore`
- ✅ CORS configurado

---

## 📋 Passo 5: Inicializar Aplicação no Elastic Beanstalk

**Na raiz do projeto (onde está o package.json), execute:**

```powershell
eb init
```

**Responda as perguntas:**

1. **Select a region:**
   - Escolha a mesma região onde criou o RDS
   - Exemplo: `us-east-1` (N. Virginia)
   - Digite o número correspondente

2. **Application name:**
   - Digite: `unima-health-api`
   - Ou pressione Enter para usar o padrão

3. **Platform:**
   - Escolha: `Node.js`
   - Digite o número correspondente

4. **Platform version:**
   - Escolha a versão mais recente do Node.js (ex: Node.js 18)
   - Digite o número correspondente

5. **SSH:**
   - Digite: `y` (yes) - útil para debug

6. **Keypair:**
   - Se já tiver um keypair, escolha
   - Se não tiver, escolha criar novo
   - Digite um nome (ex: `unima-eb-keypair`)
   - **IMPORTANTE:** Baixe e guarde a chave privada!

Isso criará um arquivo `.elasticbeanstalk/config.yml` na raiz do projeto.

---

## 📋 Passo 6: Criar Ambiente e Fazer Deploy

```powershell
eb create unima-health-env
```

Isso vai:

- Criar o ambiente no Elastic Beanstalk
- Fazer upload do código
- Instalar dependências
- Iniciar a aplicação

**Aguarde 5-10 minutos** enquanto o ambiente é criado.

Você verá o progresso no terminal. Quando terminar, verá algo como:

```
Environment health is green.
CNAME: unima-health-env.abc123.us-east-1.elasticbeanstalk.com
```

---

## 📋 Passo 7: Configurar Variáveis de Ambiente

Após o deploy, configure as variáveis de ambiente.

**Opção 1: Via Linha de Comando (Recomendado)**

```powershell
eb setenv `
  DB_HOST=unima-health-db.abc123.us-east-1.rds.amazonaws.com `
  DB_USER=admin `
  DB_PASSWORD=sua_senha_aqui `
  DB_NAME=unima_health_system `
  JWT_SECRET=sua_chave_secreta_forte_aqui `
  NODE_ENV=production `
  PORT=8080 `
  FRONTEND_URL=https://main.d1234567890.amplifyapp.com
```

**Substitua:**

- `unima-health-db.abc123.us-east-1.rds.amazonaws.com` pelo endpoint do seu RDS
- `admin` pelo username do seu banco
- `sua_senha_aqui` pela senha do banco
- `sua_chave_secreta_forte_aqui` por uma chave JWT forte (ex: gere com `openssl rand -base64 32`)
- `https://main.d1234567890.amplifyapp.com` pela URL do seu frontend no Amplify

**Opção 2: Via Console AWS**

1. Acesse: https://console.aws.amazon.com/elasticbeanstalk/
2. Selecione sua aplicação `unima-health-api`
3. Selecione o ambiente `unima-health-env`
4. No menu lateral, clique em **"Configuration"**
5. Role até **"Software"** e clique em **"Edit"**
6. Na seção **"Environment properties"**, adicione cada variável:
   - `DB_HOST` = [endpoint do RDS]
   - `DB_USER` = [username do banco]
   - `DB_PASSWORD` = [senha do banco]
   - `DB_NAME` = `unima_health_system`
   - `JWT_SECRET` = [chave secreta forte]
   - `NODE_ENV` = `production`
   - `PORT` = `8080`
   - `FRONTEND_URL` = [URL do Amplify]
7. Clique em **"Apply"**
8. Aguarde a atualização do ambiente (2-3 minutos)

---

## 📋 Passo 8: Obter URL do Backend

**Ver status e URL:**

```powershell
eb status
```

Você verá algo como:

```
Environment details for: unima-health-env
  Application name: unima-health-api
  Region: us-east-1
  Deployed version: app-abc123-1234567890123
  Platform: arn:aws:elasticbeanstalk:us-east-1::platform/Node.js 18 running on 64bit Amazon Linux 2/5.8.0
  Tier: WebServer-Standard-1.0
  CNAME: unima-health-env.abc123.us-east-1.elasticbeanstalk.com
  Status: Ready
  Health: Green
```

**A URL do backend é:** `http://unima-health-env.abc123.us-east-1.elasticbeanstalk.com`

**OU abra no navegador:**

```powershell
eb open
```

---

## 📋 Passo 9: Testar o Backend

**Testar healthcheck:**

```powershell
curl http://unima-health-env.abc123.us-east-1.elasticbeanstalk.com/health
```

Deve retornar: `{"status":"ok"}`

**OU teste no navegador:**
Abra: `http://unima-health-env.abc123.us-east-1.elasticbeanstalk.com/health`

---

## 📋 Passo 10: Configurar Frontend no Amplify

1. Acesse: https://console.aws.amazon.com/amplify/
2. Selecione sua aplicação
3. No menu lateral, clique em **"App settings"**
4. Clique em **"Environment variables"**
5. Clique em **"Manage variables"**
6. Adicione/Edite a variável:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `http://unima-health-env.abc123.us-east-1.elasticbeanstalk.com`
   - (Substitua pela URL real do seu backend)
7. Clique em **"Save"**
8. Vá em **"App settings" > "Build settings"**
9. Clique em **"Redeploy this version"** ou aguarde o próximo deploy automático

---

## ✅ Pronto!

Agora você tem:

- ✅ Backend rodando no Elastic Beanstalk
- ✅ Banco de dados no RDS
- ✅ Frontend configurado para usar o backend

**Teste completo:**

1. Acesse a URL do Amplify
2. Faça login
3. Verifique se consegue listar pacientes/usuários

---

## 🔧 Comandos Úteis

```powershell
# Ver status
eb status

# Ver logs
eb logs

# Abrir no navegador
eb open

# Fazer novo deploy após mudanças
eb deploy

# SSH no servidor (para debug)
eb ssh

# Listar ambientes
eb list

# Ver configuração
eb printenv

# Terminar ambiente (CUIDADO: apaga tudo!)
eb terminate
```

---

## 🆘 Troubleshooting

**Erro: "aws: command not found"**

- Instale o AWS CLI (Passo 2.1)

**Erro: "Credentials not found"**

- Execute `aws configure` (Passo 2.3)

**Erro de conexão com banco:**

- Verifique se o Security Group do RDS permite conexões
- Verifique se as credenciais estão corretas
- Verifique se o endpoint do RDS está correto

**Erro 502 Bad Gateway:**

- Verifique os logs: `eb logs`
- Verifique se a porta está configurada como 8080
- Verifique se todas as variáveis de ambiente estão configuradas

**CORS bloqueando:**

- Verifique se `FRONTEND_URL` está configurada com a URL do Amplify
- O código já aceita URLs do Amplify automaticamente
