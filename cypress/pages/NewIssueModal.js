/*
 * P5 S2 by ola-vi
 */

class NewIssueModal {
  constructor() {
    //New
    this.commentTextField = 'Add a comment...';
    this.commentTextFieldPlaceholder =
      'textarea[placeholder="Add a comment..."]';
    this.saveCommentButtonName = 'Save';
    this.editCommentButtonName = 'Edit';
    this.deleteCommentButtonName = 'Delete';
    this.issueComment = '[data-testid="issue-comment"]';
    this.deleteCommentConfirmationButtonName = 'Delete comment';

    //Old in use
    this.issueDetailModal = '[data-testid="modal:issue-details"]';
    this.confirmationPopup = '[data-testid="modal:confirm"]';
  }

  //New

  getIssueComment() {
    return cy.get(this.issueComment);
  }

  clickSaveCommentButton() {
    cy.contains('button', this.saveCommentButtonName)
      .click()
      .should('not.exist');
  }

  addIssueComment(comment) {
    cy.log('ADDING COMMENT')
    this.getIssueDetailModal().within(() => {
      cy.contains(this.commentTextField).click();
      cy.get(this.commentTextFieldPlaceholder).should('exist').type(comment);
      this.clickSaveCommentButton();
    });
  }

  verifyCommentSuccessfullyAdded(comment) {
    cy.log('ASSERTING COMMENT SUCCESSFULLY ADDED')
    this.getIssueComment()
      .first()
      .should('contain', comment)
      .should('be.visible');
  }

  editFirstIssueComment(comment, editedComment) {
    cy.log('EDITING COMMENT')
    this.getIssueDetailModal().within(() => {
      this.getIssueComment().first().should('contain', comment);

      cy.contains(this.editCommentButtonName).click().should('not.exist');

      cy.get(this.commentTextFieldPlaceholder)
        .should('contain', comment)
        .clear()
        .type(editedComment);

      this.clickSaveCommentButton();
    });
  }

  clickDeleteIssueComment(comment) {
    cy.log('<DELETE> FROM ISSUE DETAIL MODAL')
    this.getIssueDetailModal().within(() => {
      this.getIssueComment()
        .first()
        .should('contain', comment)
        .should('be.visible');

      cy.contains(this.deleteCommentButtonName)
        .click()
        .should('not.be.visible');
    });

    cy.get(this.confirmationPopup).should('be.visible');
  }

  confirmCommentDeletion() {
    cy.log('<DELETE> FROM CONFIRMATION POPUP')
    cy.get(this.confirmationPopup).within(() => {
      cy.contains('button', this.deleteCommentConfirmationButtonName)
        .click()
        .should('not.exist');
    });
    cy.get(this.confirmationPopup).should('not.exist');
    cy.get(this.issueDetailModal).should('be.visible');
  }

  ensureCommentIsNotExisting(comment) {
    cy.log('ASSERTING COMMENT SUCCESSFULLY DELETED FROM LIST')
    this.getIssueDetailModal().within(() => {
      this.getIssueComment().contains('p', comment).should('not.exist');
    });
  }

  //
  //Old IN USE
  //

  getIssueDetailModal() {
    return cy.get(this.issueDetailModal);
  }
}

export default new NewIssueModal();
