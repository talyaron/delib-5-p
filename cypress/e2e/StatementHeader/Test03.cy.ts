describe("Statement Header Testing", () => {
    it("Statement header home icon click", () => {
        cy.visit("/");

        // Click on the anonymous login button
        cy.get("[data-cy=anonymous-login]").click();

        const randomText = () => Math.random().toString(36).substring(7);

        // Type random text into the input and click the start button
        cy.getDataCy("anonymous-input").should("be.visible").type(randomText());
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

        // Create a new statement with a random title
        cy.get("[data-cy=statement-title]")
            .type("Top statement title")
            .then(() => {
                cy.get("[data-cy=statement-settings-form]").submit();
            });

        // User should be redirected to the chat page
        cy.url().should("include", "/chat");

        // Click on the home button
        cy.get("[data-cy=home-link-icon]").click();

        // User should be redirected to the home page
        cy.url().should("include", "/home");
    });
});
