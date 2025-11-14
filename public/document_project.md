cor-e-arte-api/
├── prisma/
│   └── schema.prisma           # modelo do banco
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── values.controller.ts
│   ├── middlewares/
│   │   └── auth.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── values.routes.ts
│   ├── services/
│   │   └── values.service.ts
│   ├── utils/
│   │   └── generateToken.ts
│   ├── server.ts               # inicializa o Express
│   └── app.ts                  # configura middlewares e rotas
├── public/
│   └── admin/                  # painel administrativo
│       ├── index.html
│       ├── login.html
│       └── script.js
├── .env
├── package.json
└── tsconfig.json
🧱 Stack base
Camada	Tecnologia
Servidor	Express.js
Linguagem	TypeScript
ORM	Prisma
Banco (dev)	MySQL via XAMPP
Autenticação	JWT + bcryptjs
Painel Admin	HTML + Bootstrap + JS puro (fetch API)
Deploy futuro	Hostinger (Node + MySQL) ou Railway/Render

⚙️ Fluxo geral
Frontend (land page na Vercel) → faz GET /api/values → exibe valores.

Admin (Hostinger):

/admin/login → autentica (JWT)

/admin → formulário de edição

PUT /api/values/:id → altera preços, descrições etc.

Banco (MySQL) → Prisma abstrai o acesso.

🗄️ Exemplo inicial do schema.prisma
prisma
Copiar código
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Value {
  id          Int      @id @default(autoincrement())
  name        String
  price       Float
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
Depois basta rodar:

bash
Copiar código
npx prisma migrate dev --name init
🔐 Auth (básico com JWT)
Usuário admin armazenado na tabela User:

prisma
Copiar código
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
}
E a autenticação com bcryptjs + jsonwebtoken:

POST /api/login → retorna um token JWT

Authorization: Bearer <token> protege as rotas /api/values

🧰 Dependências principais
bash
Copiar código
npm install express prisma @prisma/client bcryptjs jsonwebtoken dotenv cors
npm install -D typescript ts-node-dev @types/express @types/node @types/jsonwebtoken @types/bcryptjs
🚀 Próximos passos
 Iniciar o projeto com npm init -y

 Configurar o tsconfig.json

 Criar o schema.prisma e conectar ao XAMPP

 Configurar servidor base em server.ts

 Criar rotas e controladores (auth, values)

 Criar o painel admin simples (HTML + fetch)

Se quiser, posso gerar agora o esqueleto completo desse projeto — com todos os arquivos já estruturados (TypeScript + Prisma + Express + JWT + painel HTML) — e você só ajusta as credenciais e roda localmente