describe('Cypress Smoke Test', () => {
  it('should load the homepage successfully', () => {
    // Vite dev 서버에 정상 접근 가능한지 확인
    cy.visit('/');

    // 페이지 로드 확인 (Vite 기본 타이틀)
    cy.title().should('not.be.empty');

    // 화면에 Vite 기본 로고가 있는지 확인
    cy.get('img[alt="Vite logo"]').should('be.visible');
    cy.get('img[alt="React logo"]').should('be.visible');
  });

  it('should display the counter button', () => {
    cy.visit('/');

    // Vite 기본 카운터 버튼 존재 확인
    cy.contains('button', /count is/i).should('be.visible');
  });

  it('should increment counter on click', () => {
    cy.visit('/');

    // 카운터 버튼 클릭
    cy.contains('button', /count is 0/i).click();

    // 카운터 값이 증가했는지 확인
    cy.contains('button', /count is 1/i).should('exist');
  });
});
