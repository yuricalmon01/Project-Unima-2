# 🚀 Como Instalar AWS CLI no Windows

## Opção 1: Instalação Manual (Recomendada)

### Passo 1: Baixar o Instalador

1. Acesse: https://awscli.amazonaws.com/AWSCLIV2.msi
2. O download começará automaticamente
3. Ou clique com botão direito e "Salvar link como..."

### Passo 2: Instalar

1. Localize o arquivo `AWSCLIV2.msi` na pasta Downloads
2. **Clique com botão direito** no arquivo
3. Escolha **"Executar como administrador"**
4. Siga o assistente de instalação
5. Clique em **"Install"**
6. Aguarde a instalação (1-2 minutos)
7. Clique em **"Close"**

### Passo 3: Verificar Instalação

1. **Feche e reabra o PowerShell** (importante!)
2. Execute:
   ```powershell
   aws --version
   ```
3. Deve aparecer algo como: `aws-cli/2.x.x Python/3.x.x Windows/10`

---

## Opção 2: Via Script PowerShell (Como Administrador)

### Passo 1: Abrir PowerShell como Administrador

1. Pressione `Windows + X`
2. Escolha **"Windows PowerShell (Admin)"** ou **"Terminal (Admin)"**
3. Confirme a permissão de administrador

### Passo 2: Navegar até o Projeto

```powershell
cd "C:\Users\Vinicius\Documents\Diversos\projectunima2\Project-Unima-2"
```

### Passo 3: Executar Script

```powershell
.\install-aws-cli.ps1
```

---

## Opção 3: Via Chocolatey (Se tiver instalado)

```powershell
choco install awscli
```

---

## Opção 4: Via pip (Python)

Se você tem Python instalado:

```powershell
pip install awscli
```

---

## ✅ Após Instalar

1. **Feche e reabra o PowerShell**
2. Verifique a instalação:
   ```powershell
   aws --version
   ```
3. Configure as credenciais:
   ```powershell
   aws configure
   ```

---

## 🆘 Problemas Comuns

**"aws: command not found" após instalar:**
- Feche e reabra o PowerShell
- Verifique se o caminho está no PATH:
  ```powershell
  $env:PATH -split ';' | Select-String "aws"
  ```

**Erro de permissão:**
- Execute o PowerShell como Administrador
- Ou use a instalação manual (Opção 1)

**Não consegue executar scripts PowerShell:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

