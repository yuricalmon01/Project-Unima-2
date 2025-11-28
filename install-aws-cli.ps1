# Script para instalar AWS CLI no Windows
# Execute como Administrador: .\install-aws-cli.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Instalando AWS CLI..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verifica se já está instalado
$awsInstalled = Get-Command aws -ErrorAction SilentlyContinue
if ($awsInstalled) {
    Write-Host "AWS CLI já está instalado!" -ForegroundColor Yellow
    aws --version
    exit
}

# Verifica se está executando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERRO: Execute este script como Administrador!" -ForegroundColor Red
    Write-Host "Clique com botão direito no PowerShell e escolha 'Executar como administrador'" -ForegroundColor Yellow
    pause
    exit
}

# URL do instalador AWS CLI
$installerUrl = "https://awscli.amazonaws.com/AWSCLIV2.msi"
$installerPath = "$env:TEMP\AWSCLIV2.msi"

Write-Host "Baixando AWS CLI..." -ForegroundColor Green
try {
    Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "Download concluído!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao baixar: $_" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Instalando AWS CLI..." -ForegroundColor Green
Write-Host "Isso pode levar alguns minutos..." -ForegroundColor Yellow

try {
    # Instala silenciosamente
    $process = Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait -PassThru
    
    if ($process.ExitCode -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "AWS CLI instalado com sucesso!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "IMPORTANTE: Feche e reabra o PowerShell para usar o AWS CLI" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Depois, execute:" -ForegroundColor Green
        Write-Host "  aws --version" -ForegroundColor White
        Write-Host "  aws configure" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "Erro na instalação. Código de saída: $($process.ExitCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "Erro ao instalar: $_" -ForegroundColor Red
}

# Limpa arquivo temporário
if (Test-Path $installerPath) {
    Remove-Item $installerPath -Force
}

Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

