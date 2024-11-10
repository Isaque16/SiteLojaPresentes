describe("Cadastro", () => {
  beforeEach(() => {
    cy.visit("/cadastro");
  });

  it("should display the form", () => {
    cy.get("form").should("be.visible");
  });

  it("should display an error message when the name is duplicated", () => {
    cy.get("input[name='nome']").type("Isaque");
    cy.get("input[name='senha']").type("test123");
    cy.get("input[name='email']").type("test@example.com");
    cy.get("input[name='telefone']").type("123456789");
    cy.get("input[name='CEP']").type("12345678");

    cy.get("button[type='submit']").click();

    cy.get("p.text-error").should("contain", "Este nome já está em uso");
  });

  it("should regist a new user", () => {
    cy.get("input[name='nome']").type("user test");
    cy.get("input[name='senha']").type("test123");
    cy.get("input[name='email']").type("test@example.com");
    cy.get("input[name='telefone']").type("123456789");
    cy.get("input[name='CEP']").type("12345678");

    cy.get("button[type='submit']").click();

    cy.url().should("not.include", "/cadastro");
  });
});
