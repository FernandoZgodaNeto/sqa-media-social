import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { jest } from '@jest/globals';
import SignInPage from "@/app/signin/page";

// Mock do useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock do useAuth
const mockLogin = jest.fn();
const mockUseAuth = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock do authService
const mockAuthService = {
  signIn: jest.fn(),
};
jest.mock('@/service/auth/auth', () => ({
  authService: mockAuthService,
}));

describe("SignIn Page Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
    });
  });

  test("Teste de Integração: deve mostrar validação quando campos estão vazios", async () => {
    render(<SignInPage />);

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email é obrigatório")).toBeDefined();
      expect(screen.getByText("Senha é obrigatória")).toBeDefined();
    });

    expect(mockAuthService.signIn).not.toHaveBeenCalled();
  });

  test("Teste de Integração: deve validar formato de email", async () => {
    render(<SignInPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: "email_invalido" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email inválido")).toBeDefined();
    });

    expect(mockAuthService.signIn).not.toHaveBeenCalled();
  });
});