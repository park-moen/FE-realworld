describe('Cypress Smoke Test', () => {
  it('should load the homepage successfully', () => {
    // Vite dev 서버에 정상 접근 가능한지 확인
    cy.visit('/');

    // 페이지 로드 확인 (Vite 기본 타이틀)
    cy.title().should('not.be.empty');
  });
});
