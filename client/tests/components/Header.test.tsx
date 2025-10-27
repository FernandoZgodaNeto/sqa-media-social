import { render, screen, fireEvent } from "@testing-library/react";
import { jest } from '@jest/globals';
import Header from "@/components/Header";

// Mock do useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock do useAuth
const mockLogout = jest.fn();
const mockUseAuth = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Teste de Sucesso: deve renderizar botões corretos para usuário autenticado", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
    });

    render(<Header />);

    expect(screen.getByText("SQA Social Media")).toBeDefined();
    expect(screen.getByText("Posts Curtidos")).toBeDefined();
    expect(screen.getByText("Sair")).toBeDefined();
    expect(screen.queryByText("Entrar")).toBeNull();
    expect(screen.queryByText("Criar Conta")).toBeNull();
  });

  test("Teste de Sucesso: deve renderizar botões corretos para usuário não autenticado", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      logout: mockLogout,
    });

    render(<Header />);

    expect(screen.getByText("SQA Social Media")).toBeDefined();
    expect(screen.getByText("Entrar")).toBeDefined();
    expect(screen.getByText("Criar Conta")).toBeDefined();
    expect(screen.queryByText("Posts Curtidos")).toBeNull();
    expect(screen.queryByText("Sair")).toBeNull();
  });
});