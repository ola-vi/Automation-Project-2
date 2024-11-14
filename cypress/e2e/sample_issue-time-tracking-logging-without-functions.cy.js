import {issueCreatedConfirmation, issueDescription, issueTitle} from '../constants';
import {backLogList, inputFieldTime, timeTrackingModal, timeTrackingButton} from '../pages/selectors';

const estimatedTime = '10';
const estimatedTimeUpdated = '20';
const loggedTime = '2';
const loggedTimeUpdated = '3';
const remainingTime = '5';
const remainingTimeUpdated = '4';

const estimatedTimeExpectedText = 'h estimated';
const loggedTimeExpectedText = 'h logged';
const remainingTimeExpectedText = 'h remaining';

describe('Time-tracking functionality tests of the issue', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');

            // Due to unknown Jira bug we need to create new issue to update time
            cy.get('[data-testid="modal:issue-create"]')
                .within(() => {
                    cy.get('[data-testid="select:type"]').click();
                    cy.get('[data-testid="select-option:Bug"]').click();
                    cy.get(".ql-editor").type(issueDescription);
                    cy.get('input[name="title"]').type(issueTitle);
                    cy.get('[data-testid="select:userIds"]').click();
                    cy.get('[data-testid="select-option:Lord Gaben"]').click();
                    cy.get('button[type="submit"]').click();
                });

            cy.contains(issueCreatedConfirmation).should('be.visible');
            cy.get(backLogList).should('be.visible').contains(issueTitle).click();
        });
    });

    it('Should add, update and remove estimated time in the issue', () => {
        cy.contains('No time logged').should('be.visible');

        cy.get(inputFieldTime).type(estimatedTime);
        cy.get(inputFieldTime).should('have.value', estimatedTime);
        cy.contains(`${estimatedTime}${estimatedTimeExpectedText}`).should('be.visible');

        cy.get(inputFieldTime).clear().type(estimatedTimeUpdated);
        cy.get(inputFieldTime).should('have.value', estimatedTimeUpdated);
        cy.contains(`${estimatedTimeUpdated}${estimatedTimeExpectedText}`).should('be.visible');

        cy.get(inputFieldTime).clear();

        cy.contains(`${estimatedTime}${estimatedTimeExpectedText}`).should('not.exist');
        cy.contains(`${estimatedTimeUpdated}${estimatedTimeExpectedText}`).should('not.exist');
        cy.contains('No time logged').should('be.visible');
    });

    it('Should add and remove logged time values', () => {
        cy.get(inputFieldTime).type(estimatedTime);
        cy.get(inputFieldTime).should('have.value', estimatedTime);
        cy.contains(`${estimatedTime}${estimatedTimeExpectedText}`).should('be.visible');

        cy.get(timeTrackingButton).click();
        cy.get(timeTrackingModal).should('be.visible')
            .within(() => {
                cy.get(inputFieldTime).eq(0).type(loggedTime);
                cy.get(inputFieldTime).eq(1).type(remainingTime);

                cy.contains('button', 'Done').click();
            });

        cy.get(timeTrackingModal).should('not.exist');

        cy.contains(`${loggedTime}${loggedTimeExpectedText}`).should('be.visible');
        cy.contains(`${remainingTime}${remainingTimeExpectedText}`).should('be.visible');
        cy.contains(`${estimatedTime}${estimatedTimeExpectedText}`).should('not.exist');

        // Add editing logged and remaining times
        cy.get(timeTrackingButton).click();
        cy.get(timeTrackingModal).should('be.visible')
            .within(() => {
                cy.get(inputFieldTime).eq(0).type(loggedTimeUpdated);
                cy.get(inputFieldTime).eq(1).type(remainingTimeUpdated);

                cy.contains('button', 'Done').click();
            });

        cy.get(timeTrackingModal).should('not.exist');

        cy.contains(`${loggedTimeUpdated}${loggedTimeExpectedText}`).should('be.visible');
        cy.contains(`${remainingTimeUpdated}${remainingTimeExpectedText}`).should('be.visible');
        cy.contains(`${estimatedTime}${estimatedTimeExpectedText}`).should('not.exist');

        cy.contains('No time logged').should('not.exist');

        cy.get(timeTrackingButton).click();
        cy.get(timeTrackingModal).should('be.visible')
            .within(() => {
                cy.get(inputFieldTime).eq(0).clear();
                cy.get(inputFieldTime).eq(1).clear();

                cy.contains('button', 'Done').click();
            });

        cy.contains('No time logged').should('be.visible');

        cy.contains(`${loggedTime}${loggedTimeExpectedText}`).should('not.exist');
        cy.contains(`${remainingTime}${remainingTimeExpectedText}`).should('not.exist');
        cy.contains(`${estimatedTime}${estimatedTimeExpectedText}`).should('be.visible');
    });
});

function validateTime(timeValue, remainingPartOfString, shouldBeVisible = true) {
    if (shouldBeVisible) {
        cy.contains(`${timeValue}${remainingPartOfString}`).should('be.visible');
    } else {
        cy.contains(`${timeValue}${remainingPartOfString}`).should('not.exist');
    }
}

function openTimeTrackingAndChangeLoggedTime(loggedTime, remainingTime, shouldClearTime = false) {
    cy.get(timeTrackingButton).click();
    cy.get(timeTrackingModal).should('be.visible')
        .within(() => {
            if (shouldClearTime) {
                cy.get(inputFieldTime).eq(0).clear();
                cy.get(inputFieldTime).eq(1).clear();
            } else {
                cy.get(inputFieldTime).eq(0).type(loggedTime);
                cy.get(inputFieldTime).eq(1).type(remainingTime);
            }

            cy.contains('button', 'Done').click();
        });
}

function validateNoTimeLogged(shouldShowNoTimeLogged = false) {
    if (shouldShowNoTimeLogged) {
        cy.contains('No time logged').should('be.visible');
    } else {
        cy.contains('No time logged').should('not.exist');
    }
}