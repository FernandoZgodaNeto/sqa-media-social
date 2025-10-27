import { isEmailValid, getEmailValidationMessage } from "@/utils/email";

describe("Utils - Email", () => {
  describe("function isEmailValid", () => {
    test("deve retornar true se o email possui nome de usuário, símbolo @ e domínio com extensão", () => {
      expect(isEmailValid("test@test.com")).toBe(true);
    });

    test("deve retornar false se o email não possui extensão no domínio (falta .com, .br, etc)", () => {
      expect(isEmailValid("test@test")).toBe(false);
    });
  });

  describe("function getEmailValidationMessage", () => {
    test("Teste de Sucesso: deve retornar string vazia para email válido", () => {
      const email = "usuario@dominio.com";
      const message = getEmailValidationMessage(email);
      expect(message).toBe("");
    });

    test("Teste de Sucesso: deve retornar mensagem apropriada para email vazio", () => {
      const email = "";
      const message = getEmailValidationMessage(email);
      expect(message).toBe("Email é obrigatório");
    });
  });
});
