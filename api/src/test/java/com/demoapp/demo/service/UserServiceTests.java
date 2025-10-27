package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserServiceTests {

  @Test
  @DisplayName("Aceita senha válida: possui ao menos 8 caracteres, uma maiúscula, uma minúscula, um dígito e um caractere especial")
  void deveAceitarSenhaValidaQuandoAtendeTodosOsRequisitos() {
    String password = "Password123!";
    UserService userService = new UserService(null);
    boolean isValid = userService.isPasswordValid(password);
    assertTrue(isValid, "Esperava que 'Password123!' fosse considerada válida (>=8 caracteres, 1 maiúscula, 1 minúscula, 1 dígito e 1 caractere especial).");
  }

  @Test
  @DisplayName("Rejeita senha inválida: não contém letra maiúscula (apenas minúsculas e dígitos), portanto não atende à política")
  void deveRejeitarSenhaQuandoNaoContemMaiuscula() {
    String password = "password123";
    UserService userService = new UserService(null);
    boolean isValid = userService.isPasswordValid(password);
    assertFalse(isValid, "Esperava rejeitar 'password123' porque falta ao menos uma letra maiúscula e/ou caractere especial conforme a política.");
  }

  @Test
  @DisplayName("Teste de Sucesso: Deve aceitar email válido com formato correto")
  void deveAceitarEmailValidoComFormatoCorreto() {
    String email = "usuario@dominio.com";
    UserService userService = new UserService(null);
    boolean isValid = userService.isEmailValid(email);
    assertTrue(isValid, "Esperava que email válido fosse aceito");
  }

  @Test
  @DisplayName("Teste de Bug: Validação de email muito simplista - aceita emails inválidos")
  void deveRejeitarEmailInvalidoMasAceitaPorCausaDoBug() {
    String email = "email_invalido@";
    UserService userService = new UserService(null);
    boolean isValid = userService.isEmailValid(email);
    
    // BUG: A validação atual apenas verifica se contém "@", 
    // mas deveria validar o formato completo do email
    // Este teste demonstra que emails inválidos são aceitos
    assertTrue(isValid, "BUG: Email inválido é aceito pela validação simplista"); // Este vai PASSAR, mostrando o bug
  }

  @Test
  @DisplayName("Teste de Sucesso: Deve rejeitar senha com menos de 8 caracteres")
  void deveRejeitarSenhaComMenosDe8Caracteres() {
    String password = "Pass1!";
    UserService userService = new UserService(null);
    boolean isValid = userService.isPasswordValid(password);
    assertFalse(isValid, "Esperava rejeitar senha com menos de 8 caracteres");
  }
}
