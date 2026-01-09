# Script para parar todos os serviços do Rastreador de Cargas

Write-Host "🛑 Parando serviços do Rastreador de Cargas..." -ForegroundColor Red

# Parar containers Docker
Write-Host "`n📦 Parando containers Docker..." -ForegroundColor Cyan
docker-compose down

Write-Host "`n⚠️  Para parar Backend, Web e Mobile, feche os terminais abertos manualmente." -ForegroundColor Yellow
Write-Host "✅ Containers Docker parados!" -ForegroundColor Green
