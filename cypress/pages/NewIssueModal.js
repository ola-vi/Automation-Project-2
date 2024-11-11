/*
 * P5 S2 by ola-vi
 */

class NewIssueModal {
  constructor() {
    //New for time tracking
    this.IconStopwatch = '[data-testid="icon:stopwatch"]';
    this.issueTimeTrackingPopupIconStopwatch = '[data-testid="icon:stopwatch"]';
    this.numberInputPlaceholder = '[placeholder="Number"]';
    this.timeTrackingModal = '[data-testid="modal:tracking"]';
    this.closeTrackingModalButton = '[data-testid="icon:close"]';
    this.trackingModalTimeSpentElementText = 'Time spent (hours)';
    this.trackingModalTimeRemainingElementText = 'Time remaining (hours)';
    this.doneButtonName = 'Done';
    this.timeSpentText = 'h logged';
    this.timeRemainingText = 'h remaining';
    this.noTimeText = 'No time logged';
    this.timeEstimatedText = 'h estimated';

    //New for comments
    this.commentTextField = 'Add a comment...';
    this.commentTextFieldPlaceholder =
      'textarea[placeholder="Add a comment..."]';
    this.saveCommentButtonName = 'Save';
    this.editCommentButtonName = 'Edit';
    this.deleteCommentButtonName = 'Delete';
    this.issueComment = '[data-testid="issue-comment"]';
    this.deleteCommentConfirmationButtonName = 'Delete comment';

    //Old in use
    this.submitButton = 'button[type="submit"]';
    this.issueModal = '[data-testid="modal:issue-create"]';
    this.issueDetailModal = '[data-testid="modal:issue-details"]';
    this.title = 'input[name="title"]';
    this.issueType = '[data-testid="select:type"]';
    this.descriptionField = '.ql-editor';
    this.assignee = '[data-testid="select:userIds"]';
    this.backlogList = '[data-testid="board-list:backlog"]';
    this.issuesList = '[data-testid="list-issue"]';
    this.deleteButton = '[data-testid="icon:trash"]';
    this.deleteButtonName = 'Delete issue';
    //this.cancelDeletionButtonName = "Cancel";
    this.confirmationPopup = '[data-testid="modal:confirm"]';
    this.closeDetailModalButton = '[data-testid="icon:close"]';
  }

/////////////////////////////////////////////////////////////////////////////////////////////////////
//New for TIME TRACKING

  SetUpCleanIssueForTimetracking(issueTitle) {
    cy.visit('/project/board');
    cy.contains(issueTitle).click();

    this.clearTimeEstimation();

    this.getStopwatchIcon().click();
    this.getTimeTrackingModal().within(() => {
      cy.contains(this.trackingModalTimeSpentElementText)
        .next()
        .find('input')
        .should('have.attr', 'placeholder', 'Number')
        .clear();
      cy.wait(2000);
      cy.contains('button', this.doneButtonName).click();
    });
  }

  getStopwatchIcon() {
    return cy.get(this.IconStopwatch);
  }

  verifyNoTimeTextIssueDetailModal() {
    this.getIssueDetailModal().within(() => {
      this.getStopwatchIcon()
        .siblings()
        .should('contain', this.noTimeText)
        .and('be.visible');
    });
  }

  editTimeEstimation(timeEstimatedValue) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.numberInputPlaceholder)
        .click()
        .clear()
        .type(timeEstimatedValue)
        .wait(2000);

      this.getStopwatchIcon()
        .siblings()
        .should('contain', timeEstimatedValue + this.timeEstimatedText)
        .and('be.visible');
    });
  }

  clearTimeEstimation() {
    this.getIssueDetailModal()
      .should('be.visible')
      .within(() => {
        cy.get(this.numberInputPlaceholder).click().clear().wait(2000);
        this.getStopwatchIcon()
          .siblings()
          .should('not.contain', this.timeEstimatedText);
      });
  }

  verifyTimeEstimationValue(
    timeEstimatedValue = null,
    timeEstimatedText = null
  ) {
    this.getIssueDetailModal().within(() => {
      if (timeEstimatedText === 'estimated') {
        // Verify that the input has no value (i.e., is empty)
        cy.get(this.numberInputPlaceholder)
          .should('have.value', '')
          .and('have.attr', 'placeholder', 'Number')
          .and('be.visible');
        // Verify that estimation text is not displayed
        this.getStopwatchIcon()
          .siblings()
          .should('not.contain', timeEstimatedText); 
      } else {
        // Check the value if provided
        if (timeEstimatedValue !== null) {
          cy.get(this.numberInputPlaceholder)
            .should('have.value', timeEstimatedValue)
            .and('be.visible');
        }

        // Check the text if provided
        if (timeEstimatedText !== null) {
          this.getStopwatchIcon()
            .siblings()
            .should('contain', timeEstimatedText)
            .and('be.visible');
        }
      }
    });
  }

  verifyUrl(pathname) {
    cy.url().should('eq', Cypress.env('baseUrl') + pathname); // base url ends with /
  }

  openIssue(issueTitle) {
    this.verifyUrl('project/board');
    cy.contains(issueTitle).click();
  }

  openTimeTrackingSection() {
    this.getIssueDetailModal().within(() => {
      this.getStopwatchIcon().click();
    });
    this.getTimeTrackingModal().should('be.visible');
  }

  getTimeTrackingModal() {
    return cy.get(this.timeTrackingModal);
  }

  editTimeSpent(value = null) {
    this.getTimeTrackingModal().within(() => {
      const input = cy
        .contains(this.trackingModalTimeSpentElementText)
        .next()
        .find('input')
        .should('have.attr', 'placeholder', 'Number');

      if (value === null) {
        input.clear().should('have.value', '');
      } else {
        // If value is provided, type it into the input field
        input.clear().type(value).wait(2000).should('have.value', value);
      }
    });
  }

  editTimeRemaining(value = null) {
    this.getTimeTrackingModal().within(() => {
      const input = cy
        .contains(this.trackingModalTimeRemainingElementText)
        .next()
        .find('input')
        .should('have.attr', 'placeholder', 'Number');

      if (value === null) {
        input.clear().should('have.value', '');
      } else {
        // If value is provided, type it into the input field
        input.clear().type(value).wait(2000).should('have.value', value);
      }
    });
  }

  verifyTimeTrackerTexts(
    timeSpentValue = null,
    timeRemainingValue = null,
    timeEstimatedValue = null,
    trackingModal = false
  ) {
    const modal = trackingModal
      ? this.getTimeTrackingModal()
      : this.getIssueDetailModal();

    modal.should('be.visible').within(() => {
      // Check time spent if a value is provided
      if (timeSpentValue !== null) {
        cy.contains(timeSpentValue + this.timeSpentText).should('be.visible');
      }

      if (timeSpentValue === null) {
        cy.contains(this.timeSpentText).should('not.exist');
      }

      // Check time remaining if a value is provided
      if (timeRemainingValue !== null) {
        cy.contains(timeRemainingValue + this.timeRemainingText).should(
          'be.visible'
        );
        cy.contains(this.timeEstimatedText).should('not.exist');
      }

      if (timeRemainingValue === null) {
        cy.contains(this.timeRemainingText).should('not.exist');

        if (timeEstimatedValue !== null) {
          cy.contains(timeEstimatedValue + this.timeEstimatedText).should(
            'be.visible'
          );
        } else if (timeEstimatedValue === null) {
          cy.contains(this.timeEstimatedText).should('not.exist');
          cy.contains(this.noTimeText).should('be.visible');
        }
      }
    });
  }

  clickDoneButton() {
    this.getTimeTrackingModal().within(() => {
      cy.contains('button', this.doneButtonName).click();
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  //New for COMMENTS
  getIssueComment() {
    return cy.get(this.issueComment);
  }

  clickSaveCommentButton() {
    cy.contains('button', this.saveCommentButtonName)
      .click()
      .should('not.exist');
  }

  addIssueComment(comment) {
    cy.log('ADDING COMMENT');
    this.getIssueDetailModal().within(() => {
      cy.contains(this.commentTextField).click();
      cy.get(this.commentTextFieldPlaceholder).should('exist').type(comment);
      this.clickSaveCommentButton();
    });
  }

  verifyCommentSuccessfullyAdded(comment) {
    cy.log('ASSERTING COMMENT SUCCESSFULLY ADDED');
    this.getIssueComment()
      .first()
      .should('contain', comment)
      .should('be.visible');
  }

  editFirstIssueComment(comment, editedComment) {
    cy.log('EDITING COMMENT');
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
    cy.log('<DELETE> FROM ISSUE DETAIL MODAL');
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
    cy.log('<DELETE> FROM CONFIRMATION POPUP');
    cy.get(this.confirmationPopup).within(() => {
      cy.contains('button', this.deleteCommentConfirmationButtonName)
        .click()
        .should('not.exist');
    });
    cy.get(this.confirmationPopup).should('not.exist');
    cy.get(this.issueDetailModal).should('be.visible');
  }

  ensureCommentIsNotExisting(comment) {
    cy.log('ASSERTING COMMENT SUCCESSFULLY DELETED FROM LIST');
    this.getIssueDetailModal().within(() => {
      this.getIssueComment().contains('p', comment).should('not.exist');
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  //Old in use

  getIssueModal() {
    return cy.get(this.issueModal);
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailModal);
  }

  selectIssueType(issueType) {
    cy.get(this.issueType).click('bottomRight');
    cy.get(`[data-testid="select-option:${issueType}"]`)
      .trigger('mouseover')
      .trigger('click');
  }

  selectAssignee(assigneeName) {
    cy.get(this.assignee).click('bottomRight');
    cy.get(`[data-testid="select-option:${assigneeName}"]`).click();
  }

  editTitle(title) {
    cy.get(this.title).debounced('type', title); //why debounced in here??
  }

  editDescription(description) {
    cy.get(this.descriptionField).type(description);
  }

  createIssue(issueDetails) {
    this.getIssueModal().within(() => {
      this.editDescription(issueDetails.description); //Must be first otherwise ruins previous selections. (by ola-vi at 06.11.2024)
      this.selectIssueType(issueDetails.type);
      //this.editDescription(issueDetails.description);
      this.editTitle(issueDetails.title);
      this.selectAssignee(issueDetails.assignee);
      cy.get(this.submitButton).click();
    });
  }

  ensureIssueIsCreated(expectedAmountIssues, issueDetails) {
    this.getIssueModal().should('not.exist'); //Updated by ola-vi 06.11.2024
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    cy.get(this.backlogList)
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        cy.get(this.issuesList)
          .should('have.length', expectedAmountIssues)
          .first()
          .find('p')
          .contains(issueDetails.title);
        cy.get(`[data-testid="avatar:${issueDetails.assignee}"]`).should(
          'be.visible'
        );
      });
  }

  ensureIssueIsVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should('not.exist'); // Mistakenly thought to be incorrect but still correct to have .should('not.exist');
    cy.reload();
    cy.contains(issueTitle).should('be.visible');
  }
  ensureIssueIsNotVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should('not.exist');
    cy.reload();
    cy.contains(issueTitle).should('not.exist');
  }

  validateIssueVisibilityState(issueTitle, isVisible = true) {
    cy.get(this.issueDetailModal).should('not.exist');
    cy.reload();
    cy.get(this.backlogList).should('be.visible');
    if (isVisible) cy.contains(issueTitle).should('be.visible');
    if (!isVisible) cy.contains(issueTitle).should('not.exist');
  }

  clickDeleteButton() {
    cy.get(this.deleteButton).click();
    cy.get(this.confirmationPopup).should('be.visible');
  }

  confirmDeletion() {
    cy.get(this.confirmationPopup).within(() => {
      cy.contains(this.deleteButtonName).click();
    });
    cy.get(this.confirmationPopup).should('not.exist');
    cy.get(this.backlogList).should('be.visible');
  }

  closeDetailModal() {
    cy.get(this.issueDetailModal)
      .get(this.closeDetailModalButton)
      .first()
      .click();
    cy.get(this.issueDetailModal).should('not.exist');
  }
}

export default new NewIssueModal();
