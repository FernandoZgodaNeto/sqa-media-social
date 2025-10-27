package com.demoapp.demo.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.demoapp.demo.dto.ErrorResponse;
import com.demoapp.demo.dto.UserDTO;
import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTests {

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthController authController;

    private UserDTO validUserDTO;
    private User existingUser;

    @BeforeEach
    void setUp() {
        validUserDTO = new UserDTO();
        validUserDTO.setEmail("user@example.com");
        validUserDTO.setPassword("Password123!");

        existingUser = new User();
        existingUser.setId(1L);
        existingUser.setEmail("user@example.com");
        existingUser.setPassword("Password123!");
    }

    @Test
    @DisplayName("Teste de Sucesso: Deve criar usuário quando dados válidos são fornecidos")
    void deveRetornarUsuarioCriadoQuandoDadosValidos() {
        // Arrange
        when(userService.isEmailValid(anyString())).thenReturn(true);
        when(userService.isPasswordValid(anyString())).thenReturn(true);
        when(userService.findByEmail(anyString())).thenReturn(null);
        when(userService.createUser(anyString(), anyString())).thenReturn(existingUser);

        // Act
        ResponseEntity<?> response = authController.signup(validUserDTO);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(existingUser, response.getBody());
    }

    @Test
    @DisplayName("Teste de Sucesso: Deve fazer login quando credenciais corretas são fornecidas")
    void deveRetornarUsuarioQuandoCredenciaisCorretas() {
        // Arrange
        when(userService.isEmailValid(anyString())).thenReturn(true);
        when(userService.isPasswordValid(anyString())).thenReturn(true);
        when(userService.findByEmail(anyString())).thenReturn(existingUser);

        // Act
        ResponseEntity<?> response = authController.signin(validUserDTO);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(existingUser, response.getBody());
    }

    @Test
    @DisplayName("Teste de Bug: Mensagem incorreta para email já em uso - deveria ser 'E-mail já cadastrado'")
    void deveRetornarMensagemIncorretaQuandoEmailJaExiste() {
        // Arrange
        when(userService.isEmailValid(anyString())).thenReturn(true);
        when(userService.isPasswordValid(anyString())).thenReturn(true);
        when(userService.findByEmail(anyString())).thenReturn(existingUser);

        // Act
        ResponseEntity<?> response = authController.signup(validUserDTO);

        // Assert
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertNotNull(errorResponse);
        
        // BUG: A mensagem deveria ser "E-mail já cadastrado" conforme requisito,
        // mas está retornando "E-mail já está em uso"
        assertEquals("E-mail já cadastrado", errorResponse.getMessage()); // Este teste VAI FALHAR
    }
}