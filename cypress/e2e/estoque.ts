describe('Gerenciador de Estoque', () => {
  beforeEach(() => {
    cy.visit('/admin/estoque');
  });

  it('Deve carregar a página e exibir os produtos', () => {
    cy.get('#products_container').should('exist').and('not.be.empty');
  });

  it('Deve adicionar um produto com sucesso', () => {
    cy.get('input[name="nome"]').type('Produto Teste');
    cy.get('input[name="categoria"]').type('Categoria Teste');
    cy.get('input[name="preco"]').type('10');
    cy.get('input[name="quantidade"]').type('5');
    cy.get('input[name="descricao"]').type('Descrição do Produto Teste');
    cy.get('input[name="imagem"]').type('https://via.placeholder.com/150');
    cy.get('input[name="nomeImagem"]').type('Imagem Teste');

    cy.get('button[type="submit"]').click();

    cy.contains('Estoque atualizado com sucesso!').should('be.visible');
  });

  it('Deve editar um produto', () => {
    cy.get('#products_container button').contains('Editar').last().click();

    cy.get('input[name="nome"]').clear().type('Produto Editado');
    cy.get('button[type="submit"]').click();

    cy.contains('Estoque atualizado com sucesso!').should('be.visible');
  });

  it('Deve deletar um produto com sucesso', () => {
    cy.get('#products_container button').contains('Deletar').last().click();

    cy.contains('Produto removido com sucesso!').should('be.visible');
  });
});
