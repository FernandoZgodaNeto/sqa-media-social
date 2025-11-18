import { test, expect } from '@playwright/test';
import { E2EHelpers } from '../utils/e2e-helpers';
import { TEST_CONFIG } from '../utils/config';

test.describe('Fluxo de Autenticação E2E', () => {
  
  test('Deve realizar fluxo completo de cadastro e login com sucesso', async ({ page }) => {
    // Dados únicos para este teste
    const uniqueEmail = `teste${Date.now()}@example.com`;
    const password = TEST_CONFIG.NEW_USER.password;

    // Etapa 1: Tentar acessar página protegida sem estar logado
    await page.goto('/auth/liked');
    
    // Deve ser redirecionado para login ou mostrar conteúdo público
    await expect(page).toHaveURL(/\/(signin)?/);

    // Etapa 2: Ir para página de cadastro
    await page.goto('/signup');
    await expect(page.locator('h1')).toContainText('Criar Conta');

    // Etapa 3: Realizar cadastro
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Etapa 4: Verificar se foi redirecionado para home após cadastro
    await expect(page).toHaveURL('/');
    
    // Etapa 5: Verificar se usuário está logado (botões do header)
    await expect(page.locator('text=Posts Curtidos')).toBeVisible();
    await expect(page.locator('text=Sair')).toBeVisible();

    // Etapa 6: Fazer logout
    await page.click('text=Sair');
    
    // Etapa 7: Verificar se voltou ao estado não logado
    await expect(page.locator('text=Entrar')).toBeVisible();
    await expect(page.locator('text=Criar Conta')).toBeVisible();

    // Etapa 8: Fazer login novamente com as mesmas credenciais
    await page.goto('/signin');
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Etapa 9: Verificar se login foi bem-sucedido
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Posts Curtidos')).toBeVisible();
  });

  test('Deve mostrar erros de validação e falha no login com credenciais incorretas', async ({ page }) => {
    // Etapa 1: Ir para página de login
    await page.goto('/signin');

    // Etapa 2: Tentar enviar formulário vazio
    await page.click('button[type="submit"]');
    
    // Etapa 3: Verificar mensagens de erro de campos obrigatórios
    await expect(page.locator('text=Email é obrigatório')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Senha é obrigatória')).toBeVisible({ timeout: 5000 });

    // Etapa 4: Inserir email inválido
    await page.fill('input[type="email"]', 'email-invalido');
    await page.click('button[type="submit"]');
    
    // Etapa 5: Verificar erro de formato de email
    await expect(page.locator('text=Email inválido')).toBeVisible({ timeout: 5000 });

    // Etapa 6: Inserir credenciais incorretas mas válidas
    await page.fill('input[type="email"]', TEST_CONFIG.INVALID_USER.email);
    await page.fill('input[type="password"]', TEST_CONFIG.INVALID_USER.password);
    await page.click('button[type="submit"]');

    // Etapa 7: Verificar erro de credenciais inválidas
    await expect(page.locator('text=Credenciais inválidas')).toBeVisible({ timeout: 5000 });
    
    // Etapa 8: Verificar que ainda está na página de login
    await expect(page).toHaveURL('/signin');
    
    // Etapa 9: Verificar que não está logado
    await expect(page.locator('text=Entrar')).toBeVisible();
  });
});