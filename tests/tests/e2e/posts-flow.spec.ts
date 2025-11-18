import { test, expect } from '@playwright/test';
import { TEST_CONFIG } from '../utils/config';

test.describe('Fluxo de Posts e Curtidas E2E', () => {
  
  test('Deve exibir posts e permitir curtidas para usuário logado', async ({ page }) => {
    // Dados únicos para este teste
    const uniqueEmail = `user${Date.now()}@example.com`;
    const password = TEST_CONFIG.NEW_USER.password;

    // Etapa 1: Cadastrar um novo usuário
    await page.goto('/signup');
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Etapa 2: Verificar se está na home e logado
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Posts Curtidos')).toBeVisible();

    // Etapa 3: Verificar se posts são carregados
    await expect(page.locator('text=Feed de Posts')).toBeVisible();
    
    // Aguardar posts carregarem
    await page.waitForSelector('[role="listitem"]', { timeout: 10000 });
    
    // Verificar se há pelo menos um post
    const posts = page.locator('[role="listitem"]');
    await expect(posts.first()).toBeVisible();

    // Etapa 4: Curtir o primeiro post
    const firstLikeButton = posts.first().locator('button:has-text("Curtir")');
    await expect(firstLikeButton).toBeVisible();
    await firstLikeButton.click();

    // Etapa 5: Verificar se o botão mudou para "Curtido"
    await expect(posts.first().locator('button:has-text("Curtido")')).toBeVisible({ timeout: 5000 });

    // Etapa 6: Ir para página de posts curtidos
    await page.click('text=Posts Curtidos');
    await expect(page).toHaveURL('/auth/liked');

    // Etapa 7: Verificar se o post curtido aparece na página
    await expect(page.locator('text=Posts Curtidos')).toBeVisible();
    
    // Aguardar posts curtidos carregarem
    await page.waitForSelector('[role="listitem"]', { timeout: 10000 });
    
    // Verificar se há pelo menos um post curtido
    const likedPosts = page.locator('[role="listitem"]');
    await expect(likedPosts.first()).toBeVisible();
    
    // Verificar se o post está marcado como curtido
    await expect(likedPosts.first().locator('button:has-text("Curtido")')).toBeVisible();

    // Etapa 8: Voltar para home
    await page.click('text=SQA Social Media');
    await expect(page).toHaveURL('/');

    // Etapa 9: Descurtir o post
    const curtidoButton = posts.first().locator('button:has-text("Curtido")');
    await expect(curtidoButton).toBeVisible();
    await curtidoButton.click();

    // Etapa 10: Verificar se voltou ao estado "Curtir"
    await expect(posts.first().locator('button:has-text("Curtir")')).toBeVisible({ timeout: 5000 });
  });

  test('Deve mostrar alert para usuário não logado ao tentar curtir post', async ({ page }) => {
    // Etapa 1: Ir para home sem estar logado
    await page.goto('/');

    // Etapa 2: Verificar se está deslogado
    await expect(page.locator('text=Entrar')).toBeVisible();
    await expect(page.locator('text=Criar Conta')).toBeVisible();

    // Etapa 3: Aguardar posts carregarem
    await page.waitForSelector('[role="listitem"]', { timeout: 10000 });
    
    // Etapa 4: Configurar listener para capturar alert
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Etapa 5: Tentar curtir um post
    const posts = page.locator('[role="listitem"]');
    const firstLikeButton = posts.first().locator('button:has-text("Curtir")');
    await expect(firstLikeButton).toBeVisible();
    await firstLikeButton.click();

    // Etapa 6: Verificar se o alert foi exibido com a mensagem correta
    await page.waitForTimeout(1000); // Aguardar o alert ser processado
    expect(alertMessage).toBe('Você precisa estar autenticado para curtir posts!');

    // Etapa 7: Verificar se o botão continua como "Curtir" (não curtiu)
    await expect(firstLikeButton).toBeVisible();
    
    // Etapa 8: Verificar que ainda está deslogado
    await expect(page.locator('text=Entrar')).toBeVisible();
  });
});