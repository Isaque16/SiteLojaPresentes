describe('Página de Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Deve preencher e enviar o formulário de login com dados válidos', () => {
    cy.get('input[name="nomeUsuario"]').type('usuarioTeste');
    cy.get('input[name="senha"]').type('senhaSegura');

    cy.get('button[type="submit"]').click();

    cy.url().should('not.include', '/login');
  });

  it('Deve exibir erro quando o usuário não é encontrado', () => {
    cy.get('input[name="nomeUsuario"]').type('usuarioInexistente');
    cy.get('input[name="senha"]').type('senhaSegura');

    cy.get('button[type="submit"]').click();

    cy.contains('Usuário ou senha incorreto').should('exist');
  });
});
