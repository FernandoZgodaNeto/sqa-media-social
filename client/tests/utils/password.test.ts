import { isPasswordValid, getPasswordValidationMessage } from "@/utils/password";

describe("Utils - Password", () => {
  describe("function isPasswordValid", () => {
    test("Teste de Sucesso: deve retornar true para senha válida com todos os critérios", () => {
      const password = "Password123!";
      const isValid = isPasswordValid(password);
      expect(isValid).toBe(true);
    });

    test("Teste de Bug: deve falhar por usar <= 8 em vez de < 8 na validação", () => {
      const password = "Password1!"; // Exatamente 8 caracteres
      const isValid = isPasswordValid(password);
      
      // BUG: A validação usa <= 8 em vez de < 8, então senhas com exatamente 8 caracteres são rejeitadas
      // Segundo os requisitos, senha deve ter "mínimo 8 caracteres", então 8 deveria ser aceito
      expect(isValid).toBe(true); // Este teste VAI FALHAR devido ao bug
    });
  });

  describe("function getPasswordValidationMessage", () => {
    test("Teste de Sucesso: deve retornar string vazia para senha válida", () => {
      const password = "ValidPass123!";
      const message = getPasswordValidationMessage(password);
      expect(message).toBe("");
    });

    test("Teste de Sucesso: deve retornar mensagem detalhada para senha inválida", () => {
      const password = "weak";
      const message = getPasswordValidationMessage(password);
      expect(message).toContain("A senha deve conter:");
      expect(message).toContain("mínimo de 8 caracteres");
    });
  });
});