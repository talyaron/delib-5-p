import { Statement } from "delib-npm";

describe("Basic user flow", () => {
    it("Loads Start page and login anonymously", () => {
        cy.visit("/");

        // Click on the anonymous login button
        cy.get("[data-cy=anonymous-login]").click();

        const randomText = () => Math.random().toString(36).substring(7);

        // Type random text into the input and click the start button
        cy.get("[data-cy=anonymous-input]")
            .should("be.visible")
            .type(randomText())
            .then(() => {
                cy.get("[data-cy=anonymous-start-btn]").click();
            });

        // User should be redirected to the home page
        cy.url().should("include", "/home");

        // Terms of use pop up should be visible
        cy.get("[data-cy=termsOfUse]")
            .should("be.visible")
            .then(() => {
                cy.get("[data-cy=agree-btn]").click();
            });

        // Click on the add statement button - + icon at the bottom of the page
        cy.get("[data-cy=add-statement]").click();

        // Create a new statement with a random title
        cy.get("[data-cy=statement-title]")
            .type(randomText())
            .then(() => {
                cy.get("[data-cy=statement-settings-form]").submit();
            });

        // User should be redirected to the chat page
        cy.url().should("include", "/chat");
        
        //TODO: The currrent URL shows options -> need to change to evaluations
        // Click on the evaluations tab and navigate to the evaluations page
        cy.get('[data-cy="statement-nav"]')
            .children()
            .eq(1)
            .click()
            .then(() => {
                cy.url().should("include", "/options");
            });

        // click on the burger icon to open the bottom nav wait and then click again to open simple statement modal
        cy.get('[data-cy="bottom-nav-mid-icon"]').click().wait(500).click();

        // Create a simple statement by typing in the input and clicking on Enter
        const simpleStatement = "Simple statement";
        cy.get('[data-cy="statement-title-simple"]')
            .type(simpleStatement)
            .wait(500)
            .type("{enter}");

        // check if the statement is added to the store and is of type option
        cy.window()
            .its("store")
            .invoke("getState")
            .its("statements")
            .its("statements")
            .then((statements) => {
                statements.find((statement: Statement) => {
                    if (statement.statement === simpleStatement) {
                        expect(statement.statementType).to.equal("option");
                    }
                });
            });
    });
});
