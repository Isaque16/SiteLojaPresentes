describe("Página de Login", () => {
  beforeEach(() => {
    cy.visit("/login"); // Substitua pela rota correta se necessário
  });

  it("Deve exibir mensagem de erro para campos inválidos", () => {
    cy.get('input[name="nomeUsuario"]').type("No");
    cy.contains("O nome de usuário precisa ter pelo menos 3 caracteres").should(
      "exist"
    );

    cy.get('input[name="senha"]').type("No");
    cy.contains("A senha precisa ter pelo menos 6 caracteres").should("exist");
  });

  it("Deve preencher e enviar o formulário de login com dados válidos", () => {
    cy.get('input[name="nomeUsuario"]').type("usuarioTeste");
    cy.get('input[name="senha"]').type("senhaSegura");

    cy.get('button[type="submit"]').click();

    cy.url().should("not.include", "/login");
  });

  it("Deve exibir erro quando o usuário não é encontrado", () => {
    cy.get('input[name="nomeUsuario"]').type("usuarioInexistente");
    cy.get('input[name="senha"]').type("senhaSegura");

    cy.get('button[type="submit"]').click();

    cy.contains("Usuário não encontrado").should("exist");
  });
});
