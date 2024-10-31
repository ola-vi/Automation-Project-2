beforeEach(() => {
  cy.viewport(1920, 1080);
});

const deleteButtonTextForDeleteIssue = 'Delete issue';
const deleteIssueConfirmationModalText =
  'Are you sure you want to delete this issue?';

let issueTitle = 'No title assigned yet';

const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');

const getConfirmationModal = () => cy.get('[data-testid="modal:confirm"]');
const getTrashIcon = () => cy.get('[data-testid="icon:trash"]');
const getCloseIcon = () => cy.get('[data-testid="icon:close"]');

function deleteUsingTrashIcon() {
  getTrashIcon().should('exist').click();
}

function closeUsingXIcon(iconIndex) {
  getCloseIcon()
    .eq(iconIndex - 1)  // using numbers from 1 up. For first index the value is 1-1=0
    .should('exist')
    .click();
}

function deleteFromConfirmationModal(expectedText) {
  getConfirmationModal()
    .should('be.visible')
    .within(() => {
      cy.contains('button', expectedText).should('be.visible').click();
    });
}

function cancelFromConfirmationModal(expectedText) {
  getConfirmationModal()
    .should('be.visible')
    .within(() => {
      cy.contains(expectedText).should('be.visible');
      cy.contains('button', /cancel/i) // Case-insensitive match for "cancel"
        .first()
        .should('be.visible')
        .click();
    });
}

// Function to check backlog if given title is 'in list' or 'not in list'
function assertBacklogTitles(issueTitle, assertionType) {
  let matchCount = 0;

  cy.get('[data-testid="board-list:backlog"] a')
    .each(($el) => {
      cy.wrap($el) // Wrap the current element for further commands
        .find('p') // Find the <p> element
        .invoke('text') // Get the text content of the <p> element
        .then((backlogTitle) => {
          // Compare the trimmed texts
          if (backlogTitle.trim() === issueTitle.trim()) {
            matchCount++; // Increment the match count if found
          }
        });
    })
    .then(() => {
      // Assert based on the assertion type
      if (assertionType === 'in list') {
        expect(
          matchCount,
          `Expected to find exactly 1 match for "${issueTitle}"`
        ).to.equal(1);
      } else if (assertionType === 'not in list') {
        expect(matchCount, `Expected no matches for "${issueTitle}"`).to.equal(
          0
        );
      } else {
        throw new Error(
          `Invalid assertion type: ${assertionType}. Use 'in list' or 'not in list'.`
        );
      }
    });
}

// SECTION 1

describe('Section 1: Delete issue', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project`)
      .then((url) => {
        cy.visit(url + '/board');

        //Before each test first issue title from backlog is saved to variable and issue details view is opened
        cy.get('[data-testid="board-list:backlog"] a') // Select all anchor elements
          .first() // Select the first anchor
          .find('p') // Find the <p> element within the anchor
          .invoke('text') // Get the text content of the <p> element
          .then((text) => {
            issueTitle = text; // Assign the text to the variable

            cy.log('First issue title from backlog: "' + issueTitle + '"');
            cy.get('[data-testid="board-list:backlog"] a').first().click();
          });

        getIssueDetailsModal().should('exist');
        getIssueDetailsModal().should('be.visible');
      });
  });

  it('Should delete first issue from backlog and assert successful deletion', () => {
    getIssueDetailsModal()
      .should('exist')
      .within(() => {
        deleteUsingTrashIcon();
      });

    deleteFromConfirmationModal(deleteButtonTextForDeleteIssue);

    getConfirmationModal().should('not.exist');
    getIssueDetailsModal().should('not.exist');

    cy.reload();

    // Shuffle through all backlog elements and assert that deleted issue title is not in backlog list.
    assertBacklogTitles(issueTitle, 'not in list');
  });

  it('Should initiate deleting backlog first issue, then cancel procedure and assert the issue was not deleted', () => {
    
    getIssueDetailsModal()
      .should('exist')
      .within(() => {
        deleteUsingTrashIcon();
      });

    cancelFromConfirmationModal(deleteIssueConfirmationModalText);

    getIssueDetailsModal()
      .should('exist')
      .within(() => {
        closeUsingXIcon(1);
      });

    getConfirmationModal().should('not.exist');
    getIssueDetailsModal().should('not.exist');

    cy.reload();
    assertBacklogTitles(issueTitle, 'in list');
  });
});
