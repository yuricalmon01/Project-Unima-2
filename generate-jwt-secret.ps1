# Script para gerar chave JWT secreta forte
# Execute: .\generate-jwt-secret.ps1

Write-Host "Gerando chave JWT secreta..." -ForegroundColor Green

# Gera uma string aleatória de 64 caracteres
$bytes = New-Object byte[] 48
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
$secret = [Convert]::ToBase64String($bytes)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUA CHAVE JWT SECRETA:" -ForegroundColor Yellow
Write-Host $secret -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Copie esta chave e use no comando:" -ForegroundColor Green
Write-Host "eb setenv JWT_SECRET=$secret" -ForegroundColor White
Write-Host ""

