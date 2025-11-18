import { APIRequestContext, expect } from '@playwright/test';
import { TEST_CONFIG } from './config';

/**
 * Helpers para testes de API
 */
export class APIHelpers {
  
  /**
   * Realiza requisição de login na API
   */
  static async loginAPI(request: APIRequestContext, email: string, password: string) {
    const response = await request.post(`${TEST_CONFIG.BACKEND_URL}/auth/signin`, {
      data: {
        email,
        password,
      },
    });
    return response;
  }

  /**
   * Realiza requisição de cadastro na API
   */
  static async signupAPI(request: APIRequestContext, email: string, password: string) {
    const response = await request.post(`${TEST_CONFIG.BACKEND_URL}/auth/signup`, {
      data: {
        email,
        password,
      },
    });
    return response;
  }

  /**
   * Realiza requisição de reset de senha na API
   */
  static async resetPasswordAPI(request: APIRequestContext, email: string) {
    const response = await request.post(`${TEST_CONFIG.BACKEND_URL}/auth/reset-password`, {
      data: {
        email,
      },
    });
    return response;
  }

  /**
   * Busca posts na API
   */
  static async getPostsAPI(request: APIRequestContext, userId?: number, limit = 10, skip = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: skip.toString(),
    });
    
    if (userId) {
      params.append('userId', userId.toString());
    }

    const response = await request.get(`${TEST_CONFIG.BACKEND_URL}/posts?${params}`);
    return response;
  }

  /**
   * Busca posts curtidos na API
   */
  static async getLikedPostsAPI(request: APIRequestContext, userId: number, limit = 5, skip = 0) {
    const params = new URLSearchParams({
      userId: userId.toString(),
      limit: limit.toString(),
      skip: skip.toString(),
    });

    const response = await request.get(`${TEST_CONFIG.BACKEND_URL}/posts/liked?${params}`);
    return response;
  }

  /**
   * Curte/descurte um post na API
   */
  static async toggleLikeAPI(request: APIRequestContext, postId: number, userId: number) {
    const response = await request.post(`${TEST_CONFIG.BACKEND_URL}/posts/${postId}/like?userId=${userId}`);
    return response;
  }

  /**
   * Verifica se resposta da API está OK
   */
  static async expectAPISuccess(response: any, expectedStatus = 200) {
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Verifica se resposta da API retornou erro
   */
  static async expectAPIError(response: any, expectedStatus: number) {
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Extrai dados JSON da resposta
   */
  static async getResponseData(response: any) {
    return await response.json();
  }
}