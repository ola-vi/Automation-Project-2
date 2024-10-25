beforeEach(() => {
  cy.viewport(1920, 1080);
});

const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');
const getConfirmationModal = () => cy.get('[data-testid="modal:confirm"]');

describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        //cy.contains('This is an issue of type: Task.').click();

        cy.get('[data-testid="board-list:backlog"] a').first().click();
        // cy.get('[data-testid="modal:issue-details"]').should("be.visible");
        getIssueDetailsModal().should("be.visible");
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').click();
      cy.wait(1000);
    });

    getConfirmationModal().within(() => {
      cy.contains("button", "Delete issue") // Find the button by its text
        .should("be.visible") // Optional: Ensure the button is visible
        .click(); // Click the button

      /*
      cy.get("button.sc-bwzfXH.dIxFno.sc-kGXeez.bLOzZQ") // Selects the button using its classes
        .should("be.visible") // Optional: Ensure the button is visible
        .click();
        */
    });

    return;

    cy.get('[data-testid="modal:confirm"]')
      .shadow()
      .find(".sc-kAzzGY")
      .should("contain.text", "Are you sure you want to delete this issue?");

    cy.get('[data-testid="modal:confirm"]') // Replace with your actual shadow host selector
      .shadow() // Access the shadow DOM
      .find("button") // Select all buttons within the shadow DOM
      .first() // Select the first button (Delete issue)
      .should("be.visible") // Ensure it is visible
      .click(); // Click the Delete button

    //cy.get('[data-testid="modal:confirm"]').shadow().find('#delete-button').should('be.visible').click(); // Adjust the selector as needed

    return;

    cy.frameLoaded("iframe-selector"); // Ensure iframe is loaded
    cy.iframe().find('[data-testid="modal:confirm"]').should("be.visible");

    cy.get('[data-testid="modal:confirm"] button').first().click();

    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.contains("Are you sure you want to delete this issue?");

    // Verify the main confirmation message
    cy.get('[data-testid="modal:confirm"] .sc-kAzzGY').should(
      "contain.text",
      "Are you sure you want to delete this issue?"
    );

    // Verify the additional description message
    cy.get('[data-testid="modal:confirm"] .sc-chPdSV').should(
      "contain.text",
      "Once you delete, it's gone for good."
    );

    // Verify the "Delete issue" button text
    cy.get('[data-testid="modal:confirm"] button')
      .first()
      .should("contain.text", "Delete issue");

    // Verify the "Cancel" button text
    cy.get('[data-testid="modal:confirm"] button')
      .last()
      .should("contain.text", "Cancel");

    //cy.get("button.sc-bwzfXH.dIxFno.sc-kGXeez.bLOzZQ").click();

    return;
    // .should("contain.text", "Delete issue")

    //This line does not work herw neither should be visible.
    //cy.get('[data-testid="modal:confirm"]').should("exist");
    /*
      cy.get('[data-testid="modal:confirm"]').within(() => {
        cy.contains("Are you sure you want to delete this issue?").should(
          "be.visible"
        );
        */
    //cy.contains("button", "Delete issue").click();
    //cy.get('[data-testid="delete-button"]').click();
    //cy.contains("Delete issue").parent().click();
    //cy.get("button").contains("Delete issue").click();
    //cy.get(".dIxFno").contains("Delete issue").click();
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.get("button.sc-bwzfXH.dIxFno.sc-kGXeez.bLOzZQ")
        // .should("contain.text", "Delete issue")
        .click();
      cy.get('[data-testid="modal:confirm"]').should("not.be.visible");
    });
  });
  /*
      return;
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should(
        "contain",
        "Lord Gaben"
      );

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        "have.text",
        "Pickle Rick"
      );

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });
  */
});
