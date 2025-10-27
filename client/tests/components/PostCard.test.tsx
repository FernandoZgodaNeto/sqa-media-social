import { render, screen, fireEvent } from "@testing-library/react";
import { jest } from '@jest/globals';
import PostCard from "@/components/PostCard";
import { Post } from "@/service/types";

// Mock para window.alert
const mockAlert = jest.fn();
Object.defineProperty(window, 'alert', {
  writable: true,
  value: mockAlert,
});

describe("PostCard Component", () => {
  const mockPost: Post = {
    id: 1,
    title: "Post de Teste",
    body: "Este é o corpo do post de teste",
    liked: false
  };

  const mockOnLike = jest.fn() as jest.MockedFunction<(postId: number) => Promise<void>>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Teste de Sucesso: deve renderizar informações do post corretamente", () => {
    render(
      <PostCard 
        post={mockPost} 
        isAuthenticated={true} 
        onLike={mockOnLike} 
      />
    );

    expect(screen.getByText("Post de Teste")).toBeDefined();
    expect(screen.getByText("Este é o corpo do post de teste")).toBeDefined();
    expect(screen.getByText("Curtir")).toBeDefined();
  });

  test("Teste de Sucesso: deve mostrar alert quando usuário não autenticado tenta curtir", () => {
    render(
      <PostCard 
        post={mockPost} 
        isAuthenticated={false} 
        onLike={mockOnLike} 
      />
    );

    const likeButton = screen.getByText("Curtir");
    fireEvent.click(likeButton);

    expect(mockAlert).toHaveBeenCalledWith("Você precisa estar autenticado para curtir posts!");
    expect(mockOnLike).not.toHaveBeenCalled();
  });
});