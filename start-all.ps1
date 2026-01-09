# Script para iniciar todos os servicos do Rastreador de Cargas

Write-Host "Iniciando Rastreador de Cargas..." -ForegroundColor Green

# 1. Iniciar Docker (PostgreSQL e pgAdmin)
Write-Host "`nIniciando containers Docker..." -ForegroundColor Cyan
docker-compose up -d

# Aguardar o banco iniciar
Write-Host "Aguardando PostgreSQL iniciar (5 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 2. Iniciar Backend (Spring Boot)
Write-Host "`nIniciando Backend (Spring Boot)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\mvnw.cmd spring-boot:run"

# 3. Iniciar Web (React + Vite)
Write-Host "`nIniciando Web (React + Vite)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; npm run dev"

# 4. Iniciar Mobile (Expo)
Write-Host "`nIniciando Mobile (Expo)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mobile; npx expo start"

Write-Host "`nTodos os servicos foram iniciados!" -ForegroundColor Green
Write-Host "`nAcessos:" -ForegroundColor Yellow
Write-Host "  Backend:  http://localhost:8080" -ForegroundColor White
Write-Host "  Web:      http://localhost:5173" -ForegroundColor White
Write-Host "  Mobile:   Verifique o terminal do Expo" -ForegroundColor White
Write-Host "  pgAdmin:  http://localhost:5050" -ForegroundColor White
Write-Host ""
