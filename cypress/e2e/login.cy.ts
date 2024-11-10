describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should display the form", () => {
    cy.get("form").should("be.visible");
  });

  it("should display an error message when the nome is not found", () => {
    cy.get('input[name="nome"]').type("user test");
    cy.get('input[name="senha"]').type("test123");
    cy.get('button[type="submit"]').click();

    cy.get("p.text-error").should("contain.text", "Nome ou senha incorreto");
  });

  it("should login successfully when the nome and password are correct", () => {
    cy.get('input[name="nome"]').type("Isaque");
    cy.get('input[name="senha"]').type("test123");
    cy.get('button[type="submit"]').click();

    cy.url().should("not.include", "/login");
  });
});
