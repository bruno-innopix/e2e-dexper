
// likely want to do this in a support file
// so it's applied to all spec files
// cypress/support/index.js

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('My First Test', () => {
  let url = "https://genesys-xperience-development.web.app/";
    it('User should be able to be redirected to /landing-page after successful login', () => {
      
      cy.viewport('macbook-15')
      cy.wait(200)

      cy.visit(url);
      cy.get('input[name="email"]').type('bruno@dexper.io');
      cy.get('input[name="password"]').type('dexB#$%123');
      cy.get('button[type="submit"]').contains('Login').click();

      cy.url().should('include', '/landing-page')
    })
  })