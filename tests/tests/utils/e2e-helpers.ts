import { Page, expect } from '@playwright/test';
import { TEST_CONFIG } from './config';

/**
 * Helpers para testes E2E
 */
export class E2EHelpers {
  
  /**
   * Realiza login no sistema
   */
  static async login(page: Page, email: string, password: string) {
    await page.goto('/signin');
    await page.fill('[data-testid="email-input"]', email);
    await page.fill('[data-testid="password-input"]', password);
    await page.click('[data-testid="signin-button"]');
  }

  /**
   * Realiza cadastro no sistema
   */
  static async signup(page: Page, email: string, password: string) {
    await page.goto('/signup');
    await page.fill('[data-testid="email-input"]', email);
    await page.fill('[data-testid="password-input"]', password);
    await page.click('[data-testid="signup-button"]');
  }

  /**
   * Verifica se usuário está logado
   */
  static async isUserLoggedIn(page: Page): Promise<boolean> {
    try {
      await page.waitForSelector('[data-testid="logout-button"]', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Realiza logout do sistema
   */
  static async logout(page: Page) {
    await page.click('[data-testid="logout-button"]');
  }

  /**
   * Espera por um elemento aparecer na tela
   */
  static async waitForElement(page: Page, selector: string, timeout = TEST_CONFIG.DEFAULT_TIMEOUT) {
    await page.waitForSelector(selector, { timeout });
  }

  /**
   * Verifica se um alert foi exibido
   */
  static async expectAlert(page: Page, expectedMessage: string) {
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe(expectedMessage);
      await dialog.accept();
    });
  }
}