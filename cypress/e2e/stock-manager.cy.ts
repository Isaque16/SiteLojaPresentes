describe("Stock Manager", () => {
  beforeEach(() => {
    cy.visit("/stock-manager");
  });

  it("should display all products", () => {
    cy.get("div[data-cy='products_container']").should("not.be.empty");
  });

  it("should register a new product", () => {
    cy.get("input[name='nome']").type("Test Product");
    cy.get("input[name='categoria']").type("Test Category");
    cy.get("input[name='preco']").clear().type("10");
    cy.get("input[name='quantidade']").clear().type("10");
    cy.get("input[name='descricao']").type("Test Description");
    cy.get("input[name='imagem']").type("https://picsum.photos/400/225");
    cy.get("input[name='nomeImagem']").type("Test Image");
    cy.get("button[type='submit']").click();

    cy.get("div.text-info").should(
      "contain.text",
      "Produto criado com sucesso!"
    );
    cy.contains("Test Product").should("exist"); // Verifica se o produto foi adicionado à lista
  });

  it("should update a product", () => {
    cy.get("button").contains("Editar").last().click();
    cy.get("input[name='descricao']").clear().type("Test Description Updated");
    cy.get("button[type='submit']").click();

    // Verifica se a descrição foi atualizada
    cy.contains("Test Description Updated").should("exist");
    cy.get("div.text-info").should(
      "contain.text",
      "Produto atualizado com sucesso!"
    );
  });

  it("should delete a product", () => {
    cy.get("button").contains("Deletar").last().click();
    cy.get("div.text-info").should(
      "contain.text",
      "Produto removido com sucesso!"
    );
  });
});
