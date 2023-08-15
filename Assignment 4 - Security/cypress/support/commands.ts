/// <reference types="cypress" />
Cypress.Commands.add('login', (username: string, password: string) => {
    cy.visit('http://localhost:3000/login')
    cy.get('input[name=Username]').type(username)
    cy.get('input[name=Password]').type(password)
    cy.get('input[type=submit]').click()

})