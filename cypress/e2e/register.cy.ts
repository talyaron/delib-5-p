describe("Create statement when login in for the first time", () => {
    it("Loads Start page and login anonymously", () => {
        cy.visit("https://delib-v3-dev.web.app/");
        
        // cy.visit("http://localhost:5173/");

        cy.get("[data-cy=anonymous-login]").click();

        const randomText = () => Math.random().toString(36).substring(7);

        cy.get("[data-cy=anonymous-input]")
            .should("be.visible")
            .type(randomText())
            .then(() => {
                cy.get("[data-cy=anonymous-start-btn]").click();
            });

        cy.url().should("include", "/home");

        // cy.get("[data-cy=termsOfUse]")
        //     .should("be.visible")
        //     .then(() => {
        //         cy.get("[data-cy=agree-btn]").click();
        //     });

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

        cy.get('[data-cy="statement-chat-input"]')
            .should("be.visible")
            .type("Option 01");

        cy.get('[data-cy="statement-chat-send-btn"]').click();
    });
});
