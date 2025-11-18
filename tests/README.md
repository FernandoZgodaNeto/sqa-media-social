# Testes E2E e API - SQA Social Media

Este projeto contém testes End-to-End (E2E) e testes de API para a aplicação SQA Social Media usando Playwright.

## Estrutura do Projeto

```
tests/
├── tests/
│   ├── e2e/
│   │   ├── auth-flow.spec.ts      # Testes E2E de autenticação
│   │   └── posts-flow.spec.ts     # Testes E2E de posts e curtidas
│   ├── api/
│   │   ├── auth-api.spec.ts       # Testes API de autenticação
│   │   └── posts-api.spec.ts      # Testes API de posts
│   └── utils/
│       ├── config.ts              # Configurações dos testes
│       ├── e2e-helpers.ts         # Helpers para testes E2E
│       └── api-helpers.ts         # Helpers para testes API
├── playwright.config.ts           # Configuração do Playwright
└── package.json
```

## Pré-requisitos

1. **Backend (API) rodando** em http://localhost:8080
2. **Frontend** rodando em http://localhost:3000
3. **Banco de dados** configurado e acessível

## Como Executar os Testes

### Instalação

```bash
# Instalar dependências
npm install

# Instalar browsers do Playwright (se necessário)
npx playwright install
```

### Executar Todos os Testes

```bash
npm test
```

### Executar Testes Específicos

```bash
# Apenas testes E2E
npm run test:e2e

# Apenas testes API
npm run test:api

# Com interface visual
npm run test:headed

# Modo debug
npm run test:debug

# Interface interativa
npm run test:ui
```

### Ver Relatório

```bash
npm run report
```

## Testes Implementados

### Testes E2E (2)

#### 1. Fluxo de Autenticação (`auth-flow.spec.ts`)
- **Teste de Sucesso**: Cadastro, login, logout e login novamente
- **Teste de Erro**: Validação de campos e credenciais incorretas

#### 2. Fluxo de Posts (`posts-flow.spec.ts`)
- **Teste de Sucesso**: Curtir posts, ver posts curtidos
- **Teste de Error**: Alert para usuário não autenticado

### Testes de API (6)

#### 1. API de Autenticação (`auth-api.spec.ts`)
- **POST /auth/signup** - Criar usuário válido
- **POST /auth/signup** - Erro para email duplicado
- **POST /auth/signin** - Login válido
- **POST /auth/signin** - Erro para credenciais inválidas

#### 2. API de Posts e Reset (`posts-api.spec.ts`)
- **GET /posts** - Listar posts com estrutura correta
- **GET /posts** - Paginação funcionando
- **GET /posts/liked** - Erro sem userId
- **POST /posts/{id}/like** - Erro sem userId
- **POST /auth/reset-password** - Erro para email não cadastrado
- **POST /auth/reset-password** - Sucesso para email válido

## Configuração

### Variáveis de Ambiente
As configurações estão em `tests/utils/config.ts`:

```typescript
export const TEST_CONFIG = {
  FRONTEND_URL: 'http://localhost:3000',
  BACKEND_URL: 'http://localhost:8080',
};
```

### Playwright Config
O arquivo `playwright.config.ts` está configurado para:
- Executar testes em múltiplos browsers (Chrome, Firefox, Safari)
- Iniciar o frontend automaticamente antes dos testes
- Gerar relatórios em HTML
- Capturar traces para debugging

## Debugging

### Executar em Modo Debug
```bash
npm run test:debug
```

### Executar Específico em Debug
```bash
npx playwright test auth-flow.spec.ts --debug
```

### Visualizar Traces
```bash
npx playwright show-trace trace.zip
```

## Helpers Disponíveis

### E2E Helpers
- `E2EHelpers.login()` - Realizar login
- `E2EHelpers.signup()` - Realizar cadastro
- `E2EHelpers.logout()` - Fazer logout
- `E2EHelpers.isUserLoggedIn()` - Verificar se está logado

### API Helpers
- `APIHelpers.loginAPI()` - Login via API
- `APIHelpers.signupAPI()` - Cadastro via API
- `APIHelpers.getPostsAPI()` - Buscar posts
- `APIHelpers.toggleLikeAPI()` - Curtir/descurtir posts

## Troubleshooting

### Problemas Comuns

1. **Erro de conexão**: Verifique se backend e frontend estão rodando
2. **Timeout**: Ajuste timeouts em `config.ts`
3. **Browser não encontrado**: Execute `npx playwright install`
4. **Dados de teste**: Testes usam emails únicos baseados em timestamp

### Logs e Debugging
- Use `--headed` para ver o browser
- Use `--debug` para pausar e inspecionar
- Verifique `test-results/` para screenshots de falhas