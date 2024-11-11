/*
 * P5 S2 Assignment 2 by ola-vi
 */

//Fellow testers, PLEASE READ ME!!!
//this test file needs cypress.config.js be modified
//Please copy entire file or have this codeline ->> authToken: "will-be-set-by-testfile", <<-- IN env:{ }
//Example below
/*
env: {
  baseUrl: "https://jira.ivorreic.com/",
  authToken: "will-be-set-by-testfile", // Have this line as it is
}
  */

import NewIssueModal from '../../pages/NewIssueModal';
describe('Issue time tracking', () => {
  const issueTitle = 'This is an issue of type: Task.';

  before(() => {
    cy.viewport(1920, 1080);

    Cypress.session.clearAllSavedSessions();

    // Start a session for Jira auth, managing token explicitly
    cy.session('Issue timetracking', () => {
      // Visit the site to generate a new token
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`);

      // Retrieve the newly generated auth token from localStorage
      cy.window().then((window) => {
        const authToken = window.localStorage.getItem('authToken');
        Cypress.env('authToken', authToken);
      });

      // Verify token is set
      expect(Cypress.env('authToken')).to.exist; // it needs to compare token value from browser with env value
    }).then(() => {
      cy.log('Creating issue');
      //~CREATE ISSUE (modify the default issue to emulate the state of a newly created issue.)
      NewIssueModal.SetUpCleanIssueForTimetracking(issueTitle);
    });
  });

  beforeEach(() => {
    cy.viewport(1920, 1080);
    // Retrieve and apply the stored token to localStorage
    const authToken = Cypress.env('authToken');
    cy.window().then((window) => {
      window.localStorage.setItem('authToken', authToken);
    });
    cy.visit('/project/board');
    cy.contains(issueTitle).click();
  });

  after(() => {
    cy.log('Deleting tested issue');

    NewIssueModal.clickDeleteButton();
    NewIssueModal.confirmDeletion();
    NewIssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    NewIssueModal.validateIssueVisibilityState(issueTitle, false);
  });

  it('Should add and verify time estimation successfully', () => {
    
    const timeEstimatedValue = '10';
    const timeEstimatedText = timeEstimatedValue + 'h estimated';
   
    NewIssueModal.verifyNoTimeTextIssueDetailModal();
    NewIssueModal.editTimeEstimation(timeEstimatedValue);
    NewIssueModal.verifyTimeEstimationValue(
      timeEstimatedValue,
      timeEstimatedText
    );
    NewIssueModal.closeDetailModal();
    NewIssueModal.openIssue(issueTitle);
    NewIssueModal.verifyNoTimeTextIssueDetailModal();
    NewIssueModal.verifyTimeEstimationValue(
      timeEstimatedValue,
      timeEstimatedText
    );
  });

  it('Should update and verify time estimation successfully', () => {

    const timeEstimatedValue = '20';
    const timeEstimatedText = timeEstimatedValue + 'h estimated';



    NewIssueModal.editTimeEstimation(timeEstimatedValue);
    NewIssueModal.verifyTimeEstimationValue(
      timeEstimatedValue,
      timeEstimatedText
    );
    NewIssueModal.closeDetailModal();
    NewIssueModal.openIssue(issueTitle);
    NewIssueModal.verifyTimeEstimationValue(
      timeEstimatedValue,
      timeEstimatedText
    );
  });

  it('Should add values to "Time spent", "Time remaining" and verify success', () => {

    const timeSpentValue = '2';
    const timeRemainingValue = '5';
    const trackingModal = true;
    const timeEstimatedValue = '20';

    NewIssueModal.openTimeTrackingSection();
    NewIssueModal.editTimeSpent(timeSpentValue);
    NewIssueModal.editTimeRemaining(timeRemainingValue);
    NewIssueModal.verifyTimeTrackerTexts(
      timeSpentValue,
      timeRemainingValue,
      timeEstimatedValue,
      trackingModal
    );
    NewIssueModal.clickDoneButton();
    NewIssueModal.verifyTimeTrackerTexts(
      timeSpentValue,
      timeRemainingValue,
      timeEstimatedValue
    );
  });

  it('Should remove values from "Time spent", "Time remaining" and verify success', () => {

    const timeEstimatedValue = '20';
    const timeSpentValue = null;
    const timeRemainingValue = null;
    const trackingModal = true;


    NewIssueModal.openTimeTrackingSection();
    NewIssueModal.editTimeSpent(timeSpentValue);
    NewIssueModal.editTimeRemaining(timeRemainingValue);
    NewIssueModal.verifyTimeTrackerTexts(
      timeSpentValue,
      timeRemainingValue,
      timeEstimatedValue,
      trackingModal
    );
    NewIssueModal.clickDoneButton();
    NewIssueModal.verifyTimeTrackerTexts(
      timeSpentValue,
      timeRemainingValue,
      timeEstimatedValue
    );
  });

  it('Should remove and verify time estimation successfully', () => {

    const timeEstimatedValue = null;
    const timeEstimatedText = 'estimated'; 

    NewIssueModal.clearTimeEstimation();
    NewIssueModal.verifyTimeEstimationValue(
      timeEstimatedValue,
      timeEstimatedText
    );
    NewIssueModal.closeDetailModal();
    NewIssueModal.openIssue(issueTitle);
    NewIssueModal.verifyTimeEstimationValue(
      timeEstimatedValue,
      timeEstimatedText
    );
  });
});


