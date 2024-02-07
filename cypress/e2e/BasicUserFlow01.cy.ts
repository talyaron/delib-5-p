import { Statement } from "delib-npm";

describe("Basic user flow", () => {
    it("Loads Start page and login anonymously", () => {
        cy.visit("/");

        cy.get("[data-cy=anonymous-login]").click();

        const randomText = () => Math.random().toString(36).substring(7);

        cy.getDataCy("anonymous-input")
            .should("be.visible")
            .type(randomText())
            .then(() => {
                cy.get("[data-cy=anonymous-start-btn]").click();
            });

        cy.url().should("include", "/home");

        cy.get("[data-cy=termsOfUse]")
            .should("be.visible")
            .then(() => {
                cy.get("[data-cy=agree-btn]").click();
            });

        // Get user from redux and check if it is anonymous
        cy.window()
            .its("store")
            .invoke("getState")
            .its("user")
            .its("user")
            .then((user) => {
                cy.log("user", user);
                expect(user.isAnonymous).to.equal(true);
            });

        cy.get("[data-cy=add-statement]").click();

        cy.get("[data-cy=statement-title]")
            .type(randomText())
            .then(() => {
                cy.get("[data-cy=statement-settings-form]").submit();
            });

        cy.url().should("include", "/chat");

        cy.get('[data-cy="statement-nav"]')
            .children()
            .should("have.length", 4)
            .eq(0)
            .should("contain", "Chat");
        cy.get('[data-cy="statement-nav"]')
            .children()
            .eq(1)
            .should("contain", "Evaluations");
        cy.get('[data-cy="statement-nav"]')
            .children()
            .eq(2)
            .should("contain", "Voting");
        cy.get('[data-cy="statement-nav"]')
            .children()
            .eq(3)
            .should("contain", "Settings");

        cy.get('[data-cy="statement-chat-input"]')
            .should("exist")
            .type("Option01");

        cy.get('[data-cy="statement-chat-send-btn"]').click();

        cy.get('[data-cy="enable-notifications-popup"]')
            .should("be.visible")
            .then(() => {
                cy.get('[data-cy="enable-notifications-popup-enable"]').click();
                cy.get('[data-cy="enable-notifications-popup"]').should(
                    "not.exist",
                );
            });

        cy.get('[data-cy="chat-more-icon"]')
            .click()
            .then(() => {
                cy.get('[data-cy="chat-option-lightbulb"]').click();
            })
            .wait(1000);

        // Wait a second for redux to update the store

        cy.window()
            .its("store")
            .invoke("getState")
            .its("statements")
            .its("statements")
            .then((statements) => {
                statements.find((statement: Statement) => {
                    if (statement.statement === "Option01") {
                        cy.log("statements", statement);
                    }
                });
            });

        //TODO: The currrent URL shows options -> need to change to evaluations
        cy.get('[data-cy="statement-nav"]')
            .children()
            .eq(1)
            .click()
            .then(() => {
                cy.url().should("include", "/options");
            });

        cy.get('[data-cy="bottom-nav-mid-icon"]').click().wait(500).click();

        cy.get('[data-cy="statement-title-simple"]').type(randomText());

        cy.get('[data-cy="add-statement-simple"]').click().wait(500);
    });
});
