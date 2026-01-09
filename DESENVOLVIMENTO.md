# Guia de Desenvolvimento

## 🚀 Como Rodar o Projeto

### Opção 1: Script Automático (Recomendado)

Execute o script PowerShell para iniciar todos os serviços de uma vez:

```powershell
.\start-all.ps1
```

Para parar os containers Docker:
```powershell
.\stop-all.ps1
```

### Opção 2: Manual

#### 1. Iniciar Docker (PostgreSQL e pgAdmin)
```bash
docker-compose up -d
```

#### 2. Iniciar Backend (Spring Boot)
```bash
cd backend
.\mvnw.cmd spring-boot:run
# ou no Linux/Mac:
./mvnw spring-boot:run
```

#### 3. Iniciar Web (React + Vite)
```bash
cd web
npm run dev
```

#### 4. Iniciar Mobile (Expo)
```bash
cd mobile
npx expo start
```

## 📍 URLs de Acesso

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Backend | http://localhost:8080 | API Spring Boot |
| Web | http://localhost:5173 | Frontend React |
| Mobile | Terminal Expo | App React Native |
| pgAdmin | http://localhost:5050 | Interface do PostgreSQL |
| PostgreSQL | localhost:5432 | Banco de dados |

## 🔑 Credenciais

### PostgreSQL
- **Host:** localhost
- **Porta:** 5432
- **Database:** rastreador_db
- **User:** postgres
- **Password:** password

### pgAdmin
- **Email:** admin@admin.com
- **Password:** root

## 📦 Instalação de Dependências

### Backend
As dependências são gerenciadas pelo Maven e baixadas automaticamente.

### Web
```bash
cd web
npm install
```

### Mobile
```bash
cd mobile
npm install
```

## 🔧 Configurações

### Backend
Configurações em: `backend/src/main/resources/application.properties`

### Web
Configurações em: `web/vite.config.js` e `web/package.json`

### Mobile
Configurações em: `mobile/app.json` e `mobile/package.json`

## 🐛 Troubleshooting

### Porta 8080 já está em uso
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Porta 5173 já está em uso
Mude a porta no `web/vite.config.js` ou mate o processo.

### Docker não inicia
```bash
docker-compose down
docker-compose up -d
```

### Backend não conecta ao banco
1. Verifique se o Docker está rodando: `docker ps`
2. Verifique as credenciais no `application.properties`
3. Aguarde alguns segundos para o PostgreSQL iniciar completamente

## 📝 Scripts Disponíveis

### Backend
- `.\mvnw.cmd spring-boot:run` - Roda o backend
- `.\mvnw.cmd clean install` - Compila o projeto
- `.\mvnw.cmd test` - Executa os testes

### Web
- `npm run dev` - Modo desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Verifica código

### Mobile
- `npx expo start` - Inicia o Expo
- `npx expo start --android` - Abre no Android
- `npx expo start --ios` - Abre no iOS
- `npx expo start --web` - Abre no navegador
- `npm run lint` - Verifica código
