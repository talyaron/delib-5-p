import { Statement } from "delib-npm";

describe("Statement Header Testing", () => {
    it("Edit statement title in header", () => {
        cy.visit("/");

        // Click on the anonymous login button
        cy.get("[data-cy=anonymous-login]").click();

        const randomText = () => Math.random().toString(36).substring(7);

        // Type random text into the input and click the start button
        cy.get("[data-cy=anonymous-input]").should("be.visible").type(randomText());
        cy.get("[data-cy=anonymous-start-btn]").click().wait(500);

        // User should be redirected to the home page
        cy.location("pathname").should("include", "/home");

        // Terms of use pop up should be visible
        cy.get("[data-cy=termsOfUse]")
            .should("be.visible")
            .then(() => {
                cy.get("[data-cy=agree-btn]").click();
            });

        // Click on the add statement button - + icon at the bottom of the page
        cy.get("[data-cy=add-statement]").click();

        const statementTitle = "Top statement title";

        // Create a new statement with a random title
        cy.get("[data-cy=statement-title]")
            .type(statementTitle)
            .then(() => {
                cy.get("[data-cy=statement-settings-form]").submit();
            });

        // User should be redirected to the chat page
        cy.url().should("include", "/chat");

        // Click on the title
        cy.get("[data-cy=statement-header-title]").click();

        // Check if the title is editable
        cy.get("[data-cy=edit-title-input]")
            .should("exist")
            .type("{selectall}New title{enter}");

        // Check if the new title is displayed
        cy.get("[data-cy=statement-header-title]").should(
            "contain",
            "New title",
        );

        // Check redux store for the new title
        cy.window()
            .its("store")
            .invoke("getState")
            .its("statements")
            .its("statements")
            .then((statements) => {
                statements.find((statement: Statement) => {
                    if (statement.parentId === "top") {
                        expect(statement.statement).to.contain("New title");
                    }
                });
            });
    });
});
