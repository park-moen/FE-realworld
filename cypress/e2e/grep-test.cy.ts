describe('Cypress Grep Plugin Test', () => {
  it('should run @smoke tagged test', { tags: '@smoke' }, () => {
    cy.visit('/');
    cy.contains('Vite + React').should('be.visible');
  });

  it('should run @functional tagged test', { tags: '@functional' }, () => {
    cy.visit('/');
    cy.get('button').should('have.length.greaterThan', 0);
  });

  it('should skip test without tags', () => {
    cy.log('This test has no tags');
  });
});
