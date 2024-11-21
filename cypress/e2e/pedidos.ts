describe("Gerenciamento de Pedidos", () => {
  beforeEach(() => {
    cy.visit("/admin/pedidos");
  });

  it("Deve carregar a página e exibir os pedidos", () => {
    cy.get("#orders_container").should("exist").and("not.be.empty");
  });

  it("Deve exibir os detalhes de um pedido corretamente", () => {
    cy.get("#orders_container")
      .find(".card")
      .first()
      .within(() => {
        cy.contains("Pedido feito por").should("be.visible");
        cy.contains("Subtotal da compra").should("be.visible");
        cy.contains("Status atual").should("be.visible");
      });
  });

  it("Deve atualizar o status de um pedido", () => {
    cy.get("#orders_container")
      .find(".card")
      .first()
      .within(() => {
        cy.contains("Atualizar status").click();
      });

    cy.contains("Pendente").should("not.exist");
  });
});
