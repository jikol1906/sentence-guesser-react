/// <reference types="cypress" />
describe('My First Test', () => {

  beforeEach(() => {
    cy.visit("http://localhost:8888/")
  })

  it('It loads correctly',() => {
    cy.get("h1").contains("sentence guesser")
    cy.contains("Translate sentence")
    cy.contains("Help")
    cy.get("label").within(() => {
      cy.contains("Show empty letters")
    })
  })
  it('Can\'t start without entering text',() => {
    cy.contains("Translate sentence").click()
    cy.get("input[placeholder='Enter sentence to translate...']").type("Test sentence")
    cy.contains("Translate sentence").click()
    cy.contains("You entered the sentence:")
      .next()
      .contains("Test sentence")
  })
  it('Should reveal random letter',() => {
    cy.startSentenceGuesser()
    cy.clickRevealButton(0)
    let count = 0;
    cy.get("div[data-test-letterinputcontainer='0']").within(() => {
      cy.get("input").each(i => {
        if(i.val() !== '') {
          count++
          expect(i.val()).to.eq(i.attr("data-correct-letter"))
        }
      }).then(() => {
        expect(count).to.eq(1)
      })
      
      
    }).then(() => {
      cy.clickRevealButton(0)
      cy.clickRevealButton(0)
    }).then(() => {
      count = 0;
      cy.get("input").each(i => {
        if(i.val() !== '') {
          expect(i.val()).to.equal(i.attr("data-correct-letter"))
          count++
        }
      }).then(() => {
        expect(count).to.eq(3)
      })
    })



    

  })

 
  it('Should disable letterinput once correct character entered',() => {
    const s = "ThisisaSentencewithsomeCapitalizedwords"
    let num =0;
    cy.startSentenceGuesser()
    cy.get("div[data-test-letterinputcontainer] input")
    .each((l,i) => {
      cy.wrap(l).type(s[i])
    }).each(i => {
      cy.wrap(i).should("be.disabled")
    })

  })

  it.only('Goes to next input on typing letter',() => {
    cy.startSentenceGuesser()
    cy.focused().type("T")
    cy.focused().prev().should("have.value","T")
    cy.focused().should("have.value","")
    cy.focused()
      .should("have.css","border-bottom-style","solid")
      .should("have.css","border-bottom-color","rgb(255, 255, 255)")
    cy.focused().type("T")
    cy.focused().should("have.value","")
    cy.focused().siblings().eq(0)
      .should("have.value","T")
      .should("have.css","border-bottom-style","solid")
      .should("have.css","border-bottom-color","rgb(34, 197, 94)")

      cy.focused().type("g")
      cy.focused().should("have.value","")
      cy.focused().type("{backspace}")

      cy.focused().siblings().eq(0)
      .should("have.value","T")
      .should("have.css","border-bottom-style","solid")
      .should("have.css","border-bottom-color","rgb(34, 197, 94)")

      cy.focused().type("h")
      cy.focused().type("i")
      cy.focused().type("s")
    })
})