# SQA Social Media - Frontend

Interface web desenvolvida em Next.js para gerenciamento de usuários e posts de uma rede social.

## 📋 Requisitos do Sistema

- **Node.js**: versão 18 ou superior
- **npm**: versão 8 ou superior
- **Backend**: API Spring Boot rodando (veja seção [Conexão com Backend](#conexão-com-backend))

## 🚀 Como Clonar e Rodar

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd client
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8080
```

> ⚠️ **Importante**: A variável `NEXT_PUBLIC_BASE_URL` deve apontar para a URL do backend.

### 4. Rodar o Projeto

```bash
# Modo desenvolvimento
npm run dev

# Build de produção
npm run build

# Rodar build de produção
npm start
```

Acesse: **http://localhost:3000**

## 🧪 Executar Testes

```bash
# Rodar todos os testes
npm test

# Rodar testes em modo watch (reexecuta ao salvar)
npm run test:watch

# Rodar testes com relatório de cobertura
npm run test:coverage
```

## 📁 Organização de Pastas

```
client/
├── src/
│   ├── app/                     # Páginas Next.js (App Router)
│   │   ├── page.tsx             # Home - Feed de posts
│   │   ├── signin/              # Página de login
│   │   ├── signup/              # Página de cadastro
│   │   ├── reset-password/      # Página de recuperação de senha
│   │   ├── auth/
│   │   │   └── liked/           # Página de posts curtidos (protegida)
│   │   ├── layout.tsx           # Layout principal da aplicação
│   │   └── globals.css          # Estilos globais e variáveis CSS
│   │
│   ├── components/              # Componentes reutilizáveis
│   │   ├── Button.tsx           # Botão customizado
│   │   ├── Input.tsx            # Input com validação
│   │   ├── Header.tsx           # Cabeçalho com navegação
│   │   ├── PostCard.tsx         # Card de post com like
│   │   └── TextButton.tsx       # Botão de texto (links)
│   │
│   ├── contexts/                # Contexts React
│   │   └── AuthContext.tsx      # Context de autenticação
│   │
│   ├── service/                 # Camada de serviços
│   │   ├── api.ts               # Cliente Axios configurado
│   │   ├── auth/
│   │   │   └── auth.ts          # Serviços de autenticação
│   │   ├── posts/
│   │   │   └── posts.ts         # Serviços de posts
│   │   └── types/
│   │       └── index.ts         # Interfaces TypeScript
│   │
│   ├── utils/                   # Funções utilitárias
│   │   ├── tests/               # Testes unitários
│   │   │   └── email.test.ts
│   │   ├── email.ts             # Validação de email
│   │   └── password.ts          # Validação de senha
│   │
│   └── lib/                     # Bibliotecas auxiliares
│       └── localStorage.ts      # Gerenciamento de localStorage
│
├── .env                         # Variáveis de ambiente (não commitado)
├── .gitignore                   # Arquivos ignorados pelo git
├── jest.config.ts               # Configuração do Jest
├── next.config.ts               # Configuração do Next.js
├── package.json                 # Dependências e scripts
└── tsconfig.json                # Configuração do TypeScript
```

## 🔌 Conexão com Backend

### URL da API

O frontend se conecta ao backend através da variável de ambiente `NEXT_PUBLIC_BASE_URL` definida no arquivo `.env`.

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8080
```

### Endpoints Consumidos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/signup` | Criar nova conta |
| POST | `/auth/signin` | Fazer login |
| POST | `/auth/reset-password` | Resetar senha |
| GET | `/posts` | Listar posts (com paginação) |
| GET | `/posts/liked` | Listar posts curtidos do usuário |
| POST | `/posts/:id/like` | Curtir/descurtir um post |

### Formato das Requisições

#### Autenticação
```typescript
// Signup
POST /auth/signup
Body: { email: string, password: string }
Response: { id: number, email: string }

// Signin
POST /auth/signin
Body: { email: string, password: string }
Response: { id: number, email: string }

// Reset Password
POST /auth/reset-password
Body: { email: string }
Response: void
```

#### Posts
```typescript
// Listar Posts
GET /posts?userId=1&limit=10&skip=0
Response: { posts: Post[], total: number, skip: number, limit: number }

// Posts Curtidos
GET /posts/liked?userId=1&limit=10
Response: { posts: Post[], total: number, limit: number }

// Curtir/Descurtir
POST /posts/:id/like?userId=1
Response: void
```

### Verificar Conexão

Para verificar se o backend está rodando:

```bash
curl http://localhost:8080/posts?userId=0&limit=1
```

Se retornar dados, a conexão está funcionando! ✅

## 🎨 Funcionalidades

### Para Usuários Não Autenticados
- ✅ Visualizar feed de posts
- ✅ Criar conta
- ✅ Fazer login
- ✅ Recuperar senha

### Para Usuários Autenticados
- ✅ Todas as funcionalidades acima
- ✅ Curtir/descurtir posts
- ✅ Ver lista de posts curtidos
- ✅ Fazer logout

### Validações Implementadas

**Email:**
- Formato válido
- Campo obrigatório

**Senha:**
- Mínimo de 8 caracteres
- Pelo menos uma letra maiúscula
- Pelo menos uma letra minúscula
- Pelo menos um número
- Pelo menos um caractere especial

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Axios** - Cliente HTTP
- **React Context API** - Gerenciamento de estado
- **Jest** - Framework de testes
- **Testing Library** - Testes de componentes React
- **CSS-in-JS** - Estilização inline com variáveis CSS

## 📦 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| Desenvolvimento | `npm run dev` | Inicia servidor de desenvolvimento |
| Build | `npm run build` | Cria build de produção |
| Start | `npm start` | Inicia servidor de produção |
| Lint | `npm run lint` | Executa verificação de código |
| Testes | `npm test` | Executa todos os testes |
| Testes (watch) | `npm run test:watch` | Executa testes em modo watch |
| Cobertura | `npm run test:coverage` | Gera relatório de cobertura |
