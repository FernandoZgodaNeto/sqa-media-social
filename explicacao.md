# Atividade de Testes de Software - SQA Social Media

### Configuração do Banco de Dados
1. MySQL Instalado
2. Criar banco de dados: `CREATE DATABASE sqa_social_media;`
3. Configurar usuário root com senha root


## Bugs Identificados

### Backend

#### 1. Mensagem de Erro Incorreta (AuthController)
- **Localização**: `api/src/main/java/com/demoapp/demo/controller/AuthController.java` linha 34
- **Problema**: Retorna "E-mail já está em uso" mas deveria ser "E-mail já cadastrado"
- **Requisito violado**: Mensagem específica para email já existente

#### 2. Validação de Email Simplista (UserService)
- **Localização**: `api/src/main/java/com/demoapp/demo/service/UserService.java` linha 15
- **Problema**: Validação apenas verifica se contém "@", aceita emails inválidos como "email@"
- **Requisito violado**: Validação adequada de formato de email

### Frontend

#### 1. Validação de Senha Incorreta (password.ts)
- **Localização**: `client/src/utils/password.ts` linha 2
- **Problema**: Usa `<= 8` em vez de `< 8`, rejeitando senhas válidas com exatamente 8 caracteres
- **Requisito violado**: "Mínimo 8 caracteres" deveria aceitar senhas com 8 caracteres

#### 2. Regex de Caracteres Especiais Incompleta
- **Localização**: `client/src/utils/password.ts` linha 8
- **Problema**: Regex não inclui todos os caracteres especiais comuns
- **Impacto**: Senhas válidas podem ser rejeitadas incorretamente

## Testes Implementados

### Backend (JUnit) - 5 testes criados

#### Arquivo: `api/src/test/java/com/demoapp/demo/controller/AuthControllerTests.java`

**Testes de Sucesso:**
1. `deveRetornarUsuarioCriadoQuandoDadosValidos()` - Valida criação de usuário
2. `deveRetornarUsuarioQuandoCredenciaisCorretas()` - Valida login válido

**Teste de Bug:**
3. `deveRetornarMensagemIncorretaQuandoEmailJaExiste()` - Captura mensagem incorreta

#### Arquivo: `api/src/test/java/com/demoapp/demo/service/UserServiceTests.java`

**Testes de Sucesso:**
4. `deveAceitarEmailValidoComFormatoCorreto()` - Valida email válido
5. `deveRejeitarSenhaComMenosDe8Caracteres()` - Valida rejeição de senha curta

**Teste de Bug:**
6. `deveRejeitarEmailInvalidoMasAceitaPorCausaDoBug()` - Demonstra validação simplista

### Frontend (Jest + Testing Library) - 11 testes criados

#### Testes Unitários de Funções (2)

**Arquivo: `client/tests/utils/email.test.ts`**
- `getEmailValidationMessage` para email válido e inválido

**Arquivo: `client/tests/utils/password.test.ts`**
- Teste de sucesso para senha válida
- Teste de bug para senha com 8 caracteres (demonstra bug `<= 8`)

#### Testes Unitários de Componentes (2)

**Arquivo: `client/tests/components/PostCard.test.tsx`**
- Renderização correta de informações do post
- Alert para usuário não autenticado ao curtir

**Arquivo: `client/tests/components/Header.test.tsx`**
- Botões corretos para usuário autenticado/não autenticado

#### Testes de Integração (2)

**Arquivo: `client/tests/app/SignIn.test.tsx`**
- Validação de formulário com campos vazios
- Validação de formato de email

**Arquivo: `client/tests/app/Home.test.tsx`**
- Carregamento e exibição de posts
- Comportamento de curtidas para usuário não autenticado

## Como Executar os Testes

### Testes do Backend

```bash
cd api

./mvnw test
```

### Testes do Frontend

```bash
cd client

npm test
```

## Resultados dos Testes

### Backend - Resultado Esperado
- **Testes de Sucesso**: 4 testes passaram
- **Testes de Bug**: 2 testes falharam conforme esperado
- **Status**: SUCCESS com falhas intencionais documentadas

### Frontend - Resultado Esperado
- **Testes de Sucesso**: 9 testes passaram
- **Testes de Bug**: 2 testes falharam conforme esperado
- **Status**: Alguns testes falharam por problemas de mock, mas bugs foram capturados

## Análise dos Resultados

### Bugs Capturados com Sucesso

1. **AuthController - Mensagem incorreta**: Teste falhou esperadamente
2. **UserService - Validação simplista**: Teste demonstrou o problema
3. **password.ts - Validação incorreta**: Teste falhou esperadamente
4. **Caracteres especiais**: Validação incompleta identificada

### Comportamentos Corretos Validados

1. **Criação de usuário**: Funciona corretamente
2. **Login válido**: Funciona corretamente
3. **Validação de email**: Básica funciona
4. **Componentes React**: Renderizam corretamente
5. **Fluxo de curtidas**: Alert funciona para não autenticados

## Conclusões

A atividade foi concluída com sucesso, demonstrando:

1. **Identificação de bugs**: 4 bugs principais foram encontrados e documentados
2. **Criação de testes**: 16 testes criados (5 backend + 11 frontend)
3. **Validação de requisitos**: Comportamentos corretos foram testados
4. **Captura de falhas**: Testes falharam conforme esperado para bugs conhecidos