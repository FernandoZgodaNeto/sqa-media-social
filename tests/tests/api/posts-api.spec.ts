import { test, expect } from '@playwright/test';
import { APIHelpers } from '../utils/api-helpers';
import { TEST_CONFIG } from '../utils/config';

test.describe('API de Posts - Testes de Caixa Preta', () => {

  test('GET /posts - Deve retornar lista de posts com estrutura correta', async ({ request }) => {
    // Fazer requisição para obter posts
    const response = await APIHelpers.getPostsAPI(request);
    
    // Verificar status de sucesso
    await APIHelpers.expectAPISuccess(response, 200);
    
    // Verificar estrutura da resposta
    const responseData = await APIHelpers.getResponseData(response);
    expect(responseData).toHaveProperty('posts');
    expect(responseData).toHaveProperty('total');
    expect(responseData).toHaveProperty('skip');
    expect(responseData).toHaveProperty('limit');
    
    // Verificar se posts é um array
    expect(Array.isArray(responseData.posts)).toBe(true);
    
    // Se houver posts, verificar estrutura de um post
    if (responseData.posts.length > 0) {
      const firstPost = responseData.posts[0];
      expect(firstPost).toHaveProperty('id');
      expect(firstPost).toHaveProperty('title');
      expect(firstPost).toHaveProperty('body');
      expect(firstPost).toHaveProperty('liked');
      expect(typeof firstPost.liked).toBe('boolean');
    }
  });

  test('GET /posts - Deve respeitar parâmetros de paginação', async ({ request }) => {
    const limit = 5;
    const skip = 2;
    
    // Fazer requisição com parâmetros de paginação
    const response = await APIHelpers.getPostsAPI(request, undefined, limit, skip);
    
    // Verificar status de sucesso
    await APIHelpers.expectAPISuccess(response, 200);
    
    // Verificar estrutura da resposta
    const responseData = await APIHelpers.getResponseData(response);
    
    // Verificar se os parâmetros foram respeitados
    expect(responseData.limit).toBe(limit);
    expect(responseData.skip).toBe(skip);
    
    // Verificar se o número de posts não excede o limit
    expect(responseData.posts.length).toBeLessThanOrEqual(limit);
  });

  test('GET /posts/liked - Deve retornar erro quando userId não é fornecido', async ({ request }) => {
    // Tentar acessar posts curtidos sem userId
    const response = await request.get(`${TEST_CONFIG.BACKEND_URL}/posts/liked`);
    
    // Verificar status de erro
    await APIHelpers.expectAPIError(response, 400);
    
    // Verificar mensagem de erro
    const errorData = await APIHelpers.getResponseData(response);
    expect(errorData).toHaveProperty('message');
    expect(errorData.message).toContain('userId é obrigatório');
  });

  test('POST /posts/{postId}/like - Deve retornar erro quando userId não é fornecido', async ({ request }) => {
    const postId = 1;
    
    // Tentar curtir post sem userId
    const response = await request.post(`${TEST_CONFIG.BACKEND_URL}/posts/${postId}/like`);
    
    // Verificar status de erro
    await APIHelpers.expectAPIError(response, 400);
    
    // Verificar mensagem de erro
    const errorData = await APIHelpers.getResponseData(response);
    expect(errorData).toHaveProperty('message');
    expect(errorData.message).toContain('userId é obrigatório');
  });
});

test.describe('API de Reset de Senha - Testes de Caixa Preta', () => {

  test('POST /auth/reset-password - Deve retornar erro para email não cadastrado', async ({ request }) => {
    const nonExistentEmail = 'nonexistent@example.com';
    
    // Tentar resetar senha para email não cadastrado
    const response = await APIHelpers.resetPasswordAPI(request, nonExistentEmail);
    
    // Verificar status de erro
    await APIHelpers.expectAPIError(response, 404);
    
    // Verificar mensagem de erro
    const errorData = await APIHelpers.getResponseData(response);
    expect(errorData).toHaveProperty('message');
    expect(errorData.message).toBe('Usuário não encontrado');
  });

  test('POST /auth/reset-password - Deve retornar sucesso para email cadastrado', async ({ request }) => {
    // Primeiro, criar um usuário
    const email = `reset-test-${Date.now()}@example.com`;
    const password = TEST_CONFIG.NEW_USER.password;
    
    const signupResponse = await APIHelpers.signupAPI(request, email, password);
    await APIHelpers.expectAPISuccess(signupResponse, 200);
    
    // Tentar resetar senha
    const resetResponse = await APIHelpers.resetPasswordAPI(request, email);
    
    // Verificar status de sucesso
    await APIHelpers.expectAPISuccess(resetResponse, 200);
    
    // Verificar mensagem de sucesso
    const responseData = await APIHelpers.getResponseData(resetResponse);
    expect(responseData).toHaveProperty('message');
    expect(responseData.message).toContain('redefinida com sucesso');
  });
});