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

        // Click on textare to type in a new statement
        cy.get('[data-cy="statement-chat-input"]')
            .should("exist")
            .type("Option01");

        // Click on the send button
        cy.get('[data-cy="statement-chat-send-btn"]').click();

        // Enable notifications pop up should be visible
        cy.get('[data-cy="enable-notifications-popup"]')
            .should("be.visible")
            .then(() => {
                cy.get('[data-cy="enable-notifications-popup-enable"]').click();
                cy.get('[data-cy="enable-notifications-popup"]').should(
                    "not.exist",
                );
            });

    });
});
