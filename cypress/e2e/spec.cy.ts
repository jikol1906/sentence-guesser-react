/// <reference types="cypress" />
describe('My First Test', () => {
  it('It loads correctly',() => {
    cy.get("h1").contains("sentence guesser")
    cy.contains("Translate sentence")
    cy.contains("Help")
    cy.get("label").within(() => {
      cy.contains("Show empty letters")
    })
  })

})