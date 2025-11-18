import { test, expect } from '@playwright/test';
import { APIHelpers } from '../utils/api-helpers';
import { TEST_CONFIG } from '../utils/config';

test.describe('API de Autenticação - Testes de Caixa Preta', () => {

  test('POST /auth/signup - Deve criar usuário com dados válidos', async ({ request }) => {
    // Dados únicos para este teste
    const uniqueEmail = `api-test-${Date.now()}@example.com`;
    const password = TEST_CONFIG.NEW_USER.password;

    // Fazer requisição de cadastro
    const response = await APIHelpers.signupAPI(request, uniqueEmail, password);
    
    // Verificar status de sucesso
    await APIHelpers.expectAPISuccess(response, 200);
    
    // Verificar estrutura da resposta
    const responseData = await APIHelpers.getResponseData(response);
    expect(responseData).toHaveProperty('id');
    expect(responseData).toHaveProperty('email');
    expect(responseData.email).toBe(uniqueEmail);
    expect(responseData).not.toHaveProperty('password'); // Senha não deve ser retornada
  });

  test('POST /auth/signup - Deve retornar erro para email já cadastrado', async ({ request }) => {
    const email = `duplicate-${Date.now()}@example.com`;
    const password = TEST_CONFIG.NEW_USER.password;

    // Primeiro cadastro
    const firstResponse = await APIHelpers.signupAPI(request, email, password);
    await APIHelpers.expectAPISuccess(firstResponse, 200);

    // Segundo cadastro com mesmo email - deve falhar
    const secondResponse = await APIHelpers.signupAPI(request, email, password);
    
    // Verificar status de erro
    await APIHelpers.expectAPIError(secondResponse, 409);
    
    // Verificar mensagem de erro
    const errorData = await APIHelpers.getResponseData(secondResponse);
    expect(errorData).toHaveProperty('message');
    expect(errorData.message).toContain('E-mail já'); // Pode ser "já está em uso" ou "já cadastrado"
  });

  test('POST /auth/signin - Deve fazer login com credenciais válidas', async ({ request }) => {
    // Criar usuário primeiro
    const email = `signin-test-${Date.now()}@example.com`;
    const password = TEST_CONFIG.NEW_USER.password;
    
    const signupResponse = await APIHelpers.signupAPI(request, email, password);
    await APIHelpers.expectAPISuccess(signupResponse, 200);
    
    // Fazer login
    const signinResponse = await APIHelpers.loginAPI(request, email, password);
    
    // Verificar sucesso do login
    await APIHelpers.expectAPISuccess(signinResponse, 200);
    
    // Verificar dados do usuário
    const userData = await APIHelpers.getResponseData(signinResponse);
    expect(userData).toHaveProperty('id');
    expect(userData).toHaveProperty('email');
    expect(userData.email).toBe(email);
    expect(userData).not.toHaveProperty('password');
  });

  test('POST /auth/signin - Deve retornar erro para credenciais inválidas', async ({ request }) => {
    const invalidEmail = 'nonexistent@example.com';
    const invalidPassword = 'wrongpassword';

    // Tentar fazer login com credenciais inválidas
    const response = await APIHelpers.loginAPI(request, invalidEmail, invalidPassword);
    
    // Verificar status de erro
    await APIHelpers.expectAPIError(response, 401);
    
    // Verificar mensagem de erro
    const errorData = await APIHelpers.getResponseData(response);
    expect(errorData).toHaveProperty('message');
    expect(errorData.message).toBe('Credenciais inválidas');
  });
});