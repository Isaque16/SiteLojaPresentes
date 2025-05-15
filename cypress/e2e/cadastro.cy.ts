describe('Página de Cadastro', () => {
  beforeEach(() => {
    cy.visit('/cadastro');
  });

  it('Deve exibir mensagem de erro para campos obrigatórios com entrada inválida', () => {
    cy.get('input[name="nomeCompleto"]').type('No');
    cy.contains('O nome precisa ter pelo menos 3 caracteres').should('exist');

    cy.get('input[name="nomeUsuario"]').type('No');
    cy.contains('O nome de usuário precisa ter pelo menos 3 caracteres').should(
      'exist'
    );

    cy.get('input[name="senha"]').type('No');
    cy.contains('A senha precisa ter pelo menos 6 caracteres').should('exist');

    cy.get('input[name="email"]').type('emailinválido');
    cy.contains('Email inválido').should('exist');

    cy.get('input[name="telefone"]').type('123456789');
    cy.contains('O telefone deve ter pelo menos 11 dígitos').should('exist');
  });

  it('Deve preencher e enviar o formulário com dados válidos', () => {
    cy.get('input[name="nomeCompleto"]').type('Nome Teste');
    cy.get('input[name="nomeUsuario"]').type('usuarioTeste');
    cy.get('input[name="senha"]').type('senhaSegura');
    cy.get('input[name="email"]').type('teste@exemplo.com');
    cy.get('input[name="telefone"]').type('12345678901');

    cy.get('button[type="submit"]').click();

    cy.url().should('not.include', '/cadastro');
  });

  it('Deve exibir erro quando nome de usuário já está em uso', () => {
    cy.get('input[name="nomeCompleto"]').type('Nome Teste');
    cy.get('input[name="nomeUsuario"]').type('usuarioJaExistente'); // Nome que gera o erro
    cy.get('input[name="senha"]').type('senhaSegura');
    cy.get('input[name="email"]').type('teste@exemplo.com');
    cy.get('input[name="telefone"]').type('12345678901');

    cy.get('button[type="submit"]').click();

    cy.contains('Este nome já está em uso').should('exist');
  });
});
