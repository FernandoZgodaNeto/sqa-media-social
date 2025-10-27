import { AuthProvider } from "../../src/contexts/AuthContext";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { jest } from '@jest/globals';
import Home from "@/app/page";
import api from "../../src/service/api";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: "/",
  }),
  usePathname: () => "/",
}));

jest.mock("../../src/service/api");

const mockedApi = api as jest.Mocked<typeof api>;

// Mock para window.alert
const mockAlert = jest.fn();
Object.defineProperty(window, 'alert', {
  writable: true,
  value: mockAlert,
});

describe("App - Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve renderizar o número de posts corretamente de acordo com a quantidade de posts retornada pela API", async () => {
    const mockResponse = {
      data: {
        posts: [
          { id: 1, title: "Post 1", body: "Content 1", liked: false },
          { id: 2, title: "Post 2", body: "Content 2", liked: false },
        ],
      },
    };

    mockedApi.get.mockResolvedValueOnce(mockResponse);

    const { asFragment } = render(
      <AuthProvider>
        <Home />
      </AuthProvider>
    );

    await screen.findAllByRole("listitem");
    expect(screen.getAllByRole("listitem").length).toBe(2);
    expect(asFragment()).toMatchSnapshot();
  });

  test("Teste de Integração: usuário não autenticado deve ver alert ao tentar curtir post", async () => {
    const mockResponse = {
      data: {
        posts: [
          { id: 1, title: "Post 1", body: "Content 1", liked: false }
        ],
      },
    };

    mockedApi.get.mockResolvedValueOnce(mockResponse);

    render(
      <AuthProvider>
        <Home />
      </AuthProvider>
    );

    await screen.findAllByRole("listitem");
    
    const likeButtons = screen.getAllByText("Curtir");
    fireEvent.click(likeButtons[0]);

    expect(mockAlert).toHaveBeenCalledWith("Você precisa estar autenticado para curtir posts!");
  });

  test("Teste de Bug: deve falhar se a validação de posts curtidos for inconsistente", async () => {
    const mockResponse = {
      data: {
        posts: [
          { id: 1, title: "Post 1", body: "Content 1", liked: true }
        ],
      },
    };

    mockedApi.get.mockResolvedValueOnce(mockResponse);

    render(
      <AuthProvider>
        <Home />
      </AuthProvider>
    );

    await screen.findAllByRole("listitem");
    
    // BUG: Pode haver inconsistência no estado de posts curtidos
    // Este teste pode falhar se houver problemas na sincronização do estado liked
    const curtidoButtons = screen.queryAllByText("Curtido");
    expect(curtidoButtons.length).toBeGreaterThan(0); // Este teste pode falhar se o bug existir
  });
});
