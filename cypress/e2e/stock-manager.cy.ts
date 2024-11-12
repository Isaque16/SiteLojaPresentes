describe("StoreManager Page Tests", () => {
  beforeEach(() => {
    cy.visit("/stock-manager");
  });

  it("Deve carregar a página e exibir o título", () => {
    cy.contains("Gerenciador de Estoque").should("be.visible");
  });

  it("Deve adicionar um novo produto com sucesso", () => {
    // Preenche os campos do formulário com dados válidos
    cy.get("input[name='nome']").type("Produto Teste");
    cy.get("input[name='categoria']").type("Categoria Teste");
    cy.get("input[name='preco']").type("10");
    cy.get("input[name='quantidade']").type("5");
    cy.get("input[name='descricao']").type("Descrição Teste");
    cy.get("input[name='imagem']").type("https://exemplo.com/imagem.jpg");
    cy.get("input[name='nomeImagem']").type("imagem_teste.jpg");

    // Envia o formulário
    cy.get("button[type='submit']").click();

    // Verifica se a mensagem de resposta está visível
    cy.get(".text-info").should("contain", "Produto criado com sucesso");
  });

  it("Deve editar um produto existente", () => {
    // Seleciona o primeiro produto e clica no botão Editar
    cy.get("#products_container").find(".btn-accent").last().click();

    // Altera o nome e salva
    cy.get("input[name='nome']").clear().type("Produto Editado");
    cy.get("button[type='submit']").click();

    // Verifica se a mensagem de resposta está visível
    cy.get(".text-info").should("contain", "Produto atualizado com sucesso");
  });

  it("Deve deletar um produto existente", () => {
    // Seleciona o primeiro produto e clica no botão Deletar
    cy.get("#products_container").find(".btn-error").last().click();

    // Verifica se a mensagem de resposta está visível
    cy.get(".text-info").should("contain", "Produto removido com sucesso");
  });
});
