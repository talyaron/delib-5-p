describe("Create statement when login in for the first time", () => {
    it("passes", () => {
        cy.visit("http://localhost:5173/");

        cy.get("[data-cy=anonymous-login]").click();

        const anonymousName =
            Math.random().toString(36).substring(7) + "@test.com";

        cy.get("[data-cy=anonymous-input]")
            .should("be.visible")
            .type(anonymousName)
            .then(() => {
                // cy.wait(500);
                // cy.get("[data-cy=anonymous-start-btn]").click();
            });

        // Get user from redux
        cy.window()
            .its("store")
            .invoke("getState")
            .should("deep.include", {
                user: {
                    isAnonymous: true,
                },
            });

        // cy.get('[data-cy=termsOfUse]').should('be.visible')

        // cy.get('[data-cy=agree-btn]').click()

        cy.wait(500);

        cy.get("[data-cy=add-statement]").click();

        cy.get("[data-cy=statement-title]")
            .type("Top state 01")
            .then(() => {
                cy.get("[data-cy=statement-settings-form]").submit();
            });
    });
});
