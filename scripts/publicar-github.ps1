#requires -Version 5.1
param([switch]$Push)
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$remote = 'https://github.com/balancerec/HUD-Studio-for-SNES.git'
Set-Location -LiteralPath $root
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git não encontrado. Instale Git for Windows.' }
if (-not (Test-Path -LiteralPath '.git')) {
    git init -b main
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao inicializar Git.' }
}
$current = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) { git remote add origin $remote }
elseif ($current.Trim() -ne $remote) {
    throw "Remote origin existente aponta para: $current`nVerifique manualmente antes de continuar."
}
Write-Host "Projeto: $root"
Write-Host "Remote:  $remote"
Write-Host '--- git status ---'
git status --short
Write-Host '--- arquivos com alterações ---'
git status --short
if (-not $Push) {
    Write-Host 'Nenhuma mudança enviada. Revise os arquivos e execute novamente com -Push.'
    exit 0
}
# Evita reescrever ou publicar sobre commits remotos inesperados.
git ls-remote --exit-code --heads origin main | Out-Null
$hasRemoteMain = ($LASTEXITCODE -eq 0)
if ($hasRemoteMain) {
    git fetch origin main
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao consultar origin/main.' }
    $localHead = git rev-parse HEAD 2>$null
    if ($LASTEXITCODE -eq 0) {
        $mergeBase = git merge-base HEAD origin/main 2>$null
        if ($LASTEXITCODE -ne 0) { throw 'Históricos divergentes. Não enviarei push automático.' }
    }
}
git add --all
if ($LASTEXITCODE -ne 0) { throw 'Falha em git add.' }
$pending = git diff --cached --name-only
if ($pending) {
    git commit -m 'chore: bootstrap HUD Studio for SNES'
    if ($LASTEXITCODE -ne 0) { throw 'Falha no commit. Configure user.name/user.email.' }
}
git branch -M main
if ($LASTEXITCODE -ne 0) { throw 'Falha em git branch.' }
git push -u origin main
if ($LASTEXITCODE -ne 0) { throw 'Push rejeitado. Verifique a saída do Git e não use --force.' }
Write-Host 'Publicação concluída.'
