/**
 * Configurações e constantes para os testes
 */
export const TEST_CONFIG = {
  // URLs
  FRONTEND_URL: 'http://localhost:3000',
  BACKEND_URL: 'http://localhost:8080',
  
  // Timeouts
  DEFAULT_TIMEOUT: 30000,
  NAVIGATION_TIMEOUT: 10000,
  
  // Usuários de teste
  VALID_USER: {
    email: 'teste@example.com',
    password: 'Password123!',
  },
  
  INVALID_USER: {
    email: 'invalid@email.com',
    password: 'wrongpassword',
  },
  
  // Dados de teste
  NEW_USER: {
    email: 'newuser@example.com',
    password: 'NewPass123!',
  },
};