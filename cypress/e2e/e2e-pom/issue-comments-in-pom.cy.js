/*
 * P5 S2 Assignment 1 by ola-vi
 */
import NewIssueModal from '../../pages/NewIssueModal';
describe('Issue comments creating, editing and deleting', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {
        cy.visit(url + '/board');
        cy.contains(issueTitle).click();
      });
  });

  const issueTitle = 'This is an issue of type: Task.';

  it.only('Should create, edit and delete same comment with assertions successfully', () => {
    const comment = 'Commented by ola-vi.';
    const editedComment = comment + ' Edited.';

    NewIssueModal.addIssueComment(comment);
    cy.reload();
    NewIssueModal.verifyCommentSuccessfullyAdded(comment);
    NewIssueModal.editFirstIssueComment(comment, editedComment);
    cy.reload();
    NewIssueModal.verifyCommentSuccessfullyAdded(editedComment);
    NewIssueModal.clickDeleteIssueComment(editedComment);
    NewIssueModal.confirmCommentDeletion();
    cy.reload();
    NewIssueModal.ensureCommentIsNotExisting(editedComment);
  });
});
