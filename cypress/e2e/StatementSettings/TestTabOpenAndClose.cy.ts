describe("Statement settings tabs change", () => {
    it("Adds Main and Rooms to tabs", () => {
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

        // Click on the settings tab and navigate to the settings page
        cy.get('[data-cy="statement-nav"]')
            .children()
            .eq(3)
            .click()
            .then(() => {
                cy.url().should("include", "/settings");
            });

        // Click on the tabs switch
        // Default chat, evaluations, voting and settings tabs should be checked
        cy.get("[data-cy=toggleSwitch-input-chat]").should("be.checked");
        cy.get("[data-cy=toggleSwitch-input-options]").should("be.checked");
        cy.get("[data-cy=toggleSwitch-input-vote]").should("be.checked");

        // Click on the Main and Rooms tabs
        cy.get("[data-cy=toggleSwitch-doc]").click();
        cy.get("[data-cy=toggleSwitch-groups]").click();

        // Main and Rooms tabs should be checked
        cy.get("[data-cy=toggleSwitch-input-doc]").should("be.checked");
        cy.get("[data-cy=toggleSwitch-input-groups]").should("be.checked");

        // Submit the form
        cy.get("[data-cy=settings-statement-submit-btn]").click().wait(500);

        // User should be redirected to the chat page
        cy.url().location("pathname").should("include", "/chat");

        // Header should contain the chat, evaluations, voting, settings, main and rooms tabs
        cy.get('[data-cy="statement-nav"]')
            .children()
            .should("have.length", 6)
            .eq(0)
            .should("contain", "Main");

        cy.get('[data-cy="statement-nav"]')
            .children()
            .eq(1)
            .should("contain", "Chat");

        cy.get('[data-cy="statement-nav"]')
            .children()
            .eq(2)
            .should("contain", "Evaluations");

        cy.get('[data-cy="statement-nav"]')
            .children()
            .eq(3)
            .should("contain", "Voting");

        cy.get('[data-cy="statement-nav"]')
            .children()
            .eq(4)
            .should("contain", "Rooms");

        cy.get('[data-cy="statement-nav"]')
            .children()
            .eq(5)
            .should("contain", "Settings");
    });
});
