/// <reference types="cypress" />



Cypress.Commands.add("getByData",(selector) => {
    return cy.get(`[data-test=${selector}]`)
})
Cypress.Commands.add("getByData",(selector) => {
    return cy.get(`[data-test=${selector}]`)
})
Cypress.Commands.add("startSentenceGuesser",() => {
    cy.get("input[placeholder='Enter sentence to translate...']").type("Test sentence")
    cy.contains("Translate sentence").click()
})
Cypress.Commands.add("clickRevealButton",(num) => {
    cy.get(`button[data-test-reavealbutton='${num}']`).click()
})
Cypress.Commands.add("getLetterInputContainer",(num) => {
    return cy.get(`div[data-test-letterinputcontainer='${num}']`)
})








declare namespace Cypress {
    interface Chainable<Subject = any> {
      getByData(selector:string): Chainable<any>;
      startSentenceGuesser(): Chainable<void>;
      clickRevealButton(num:number): Chainable<void>;
      getLetterInputContainer(num:number): Chainable<JQuery<HTMLElement>>;
    }
  }