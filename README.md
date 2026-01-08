"# Rastreador de Cargas

Sistema de rastreamento de cargas com backend Spring Boot, frontend web React/Vite e aplicativo mobile React Native/Expo.

## 🚀 Tecnologias

### Backend
- Java 17
- Spring Boot 3.5.9
- PostgreSQL 15
- JPA/Hibernate
- Lombok

### Web
- React 19
- Vite 7
- ESLint

### Mobile
- React Native
- Expo ~54
- Expo Router
- React Navigation

## 📦 Estrutura do Projeto

```
rastreador-cargas/
├── backend/          # API Spring Boot
├── web/              # Frontend React
├── mobile/           # App React Native
└── docker-compose.yml # PostgreSQL + pgAdmin
```

## 🐳 Docker

O projeto utiliza Docker Compose para PostgreSQL e pgAdmin:

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down
```

**Acessos:**
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:5050`
  - Email: admin@admin.com
  - Senha: root

## 🛠️ Como Executar

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Web
```bash
cd web
npm install
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```

## 📝 Configuração do Banco

**Conexão PostgreSQL:**
- Host: localhost
- Porta: 5432
- Database: rastreador_db
- User: postgres
- Password: password

## 👨‍💻 Desenvolvimento

Projeto em desenvolvimento inicial." 
