import { Statement } from "delib-npm";

describe("Statement Header Testing", () => {
    beforeEach(() => {
        cy.visit("/");

        // Click on the anonymous login button
        cy.get("[data-cy=anonymous-login]").click();

        const randomText = () => Math.random().toString(36).substring(7);

        // Type random text into the input and click the start button
        cy.getDataCy("anonymous-input").should("be.visible").type(randomText());
        cy.get("[data-cy=anonymous-start-btn]").click().wait(500);

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
            .type("Top statement title")
            .then(() => {
                cy.get("[data-cy=statement-settings-form]").submit();
            });

        // User should be redirected to the chat page
        cy.url().should("include", "/chat");
    });
    it("Check statement header for elements", () => {
        // Header should contain the chat, evaluations, voting and settings tabs
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

        cy.get("[data-cy=home-link-icon]").should("exist");

        cy.get("[data-cy=back-icon-header]").should("exist");

        cy.get("[data-cy=statement-header-title]").should(
            "contain",
            "Top statement title",
        );
    });

    it("Check statement header for back button", () => {
        // Click on the back button
        cy.get("[data-cy=back-icon-header]").click();

        // User should be redirected to the home page
        cy.url().should("include", "/home");
    });

    it("Check statement header for home button", () => {
        // Click on the home button
        cy.get("[data-cy=home-link-icon]").click();

        // User should be redirected to the home page
        cy.url().should("include", "/home");
    });

    it("Edit statement title in header", () => {
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
                        expect(statement.statement).to.equal("New title");
                    }
                });
            });
    });
});
