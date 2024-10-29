beforeEach(() => {
  cy.viewport(1920, 1080);
});

import { faker } from '@faker-js/faker';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + '/board?modal-issue-create=true');
      });
  });

  it.only('Should create a custom issue and validate it successfully (TC1)', () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Type value to description input field
      cy.get('.ql-editor').type('My bug description');
      cy.get('.ql-editor').should('have.text', 'My bug description');

      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('Bug');
      cy.get('input[name="title"]').should('have.value', 'Bug');

      // Open issue type dropdown and choose "Bug"
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]')
        .wait(1000)
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="icon:bug"]').should('be.visible');

      // Open priority dropdown and choose "Highest"
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]')
        .wait(1000)
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="icon:arrow-up"]')
        .should('be.visible')
        .should('have.css', 'color', 'rgb(205, 19, 23)');

      // Select reporter from dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      // Select assignee from dropdown
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('Bug')
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
            cy.get('[data-testid="icon:bug"]').should('be.visible');
          });
      });
    cy.get('[data-testid="board-list:backlog"]')
      .contains('Bug')
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
        cy.get('[data-testid="icon:bug"]').should('be.visible');
      });
  });

  it.only('Should create a custom issue, using faker for title and description, and validate it successfully  (TC2)', () => {
    const randomIssueTitle = faker.company.buzzNoun();
    const randomIssueDescription = `Bug: ${faker.lorem.sentence(
      5
    )}. Please fix this issue as soon as possible.`;

    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Type value to description input field using faker
      cy.get('.ql-editor').type(randomIssueDescription);
      cy.get('.ql-editor').should('have.text', randomIssueDescription);

      // Type value to title input field using faker and assert
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type(
        capitalizeFirstLetter(randomIssueTitle)
      );

      cy.get('input[name="title"]').should(
        'have.value',
        capitalizeFirstLetter(randomIssueTitle)
      );

      //For testing following block to be sure "if else" is functioning
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .trigger('mouseover')
        .trigger('click');

      //Selecting type: Task
      cy.get('[data-testid="select:type"]').then(($select) => {
        // Check if the text of the element is "Task"
        if ($select.text().trim() === 'Task') {
          // Continue with the regular test flow if it contains "Task"
          cy.get('[data-testid="icon:task"]').should('be.visible');
          cy.log('Select type is Task, continuing with test');
        } else {
          // Execute specific tasks if it does not contain "Task"
          cy.log('Select type is not Task. Selecting type Task');
          cy.get('[data-testid="select:type"]').click();
          cy.get('[data-testid="select-option:Task"]')
            .trigger('mouseover')
            .trigger('click');
          cy.get('[data-testid="icon:task"]').should('be.visible');
        }
      });

      // Open priority dropdown and choose priority level
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]')
        .wait(1000)
        .trigger('mouseover')
        .trigger('click');

      // Assert priority icon
      cy.get('[data-testid="icon:arrow-down"]')
        .should('be.visible')
        .should('have.css', 'color', 'rgb(45, 135, 56)');

      // Select reporter from dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      // Select assignee from dropdown   NOT REQUIRED BY ASSIGNMENT
      // cy.get('[data-testid="form-field:userIds"]').click();
      // cy.get('[data-testid="select-option:Lord Gaben"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains(capitalizeFirstLetter(randomIssueTitle))
          .siblings()
          .within(() => {
            //Assert that correct type icon is visible
            cy.get('[data-testid="icon:task"]').should('be.visible');
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains('Task')
      .within(() => {
        // Assert that correct type icon is visible
        cy.get('[data-testid="icon:task"]').should('be.visible');
      });
  });

  

  ///////SAMPLES/////
  //SAMPLE 1 FOR THIS ASSIGNMENT
  it('Should create an issue and validate it successfully', () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');
      cy.get('.ql-editor').should('have.text', 'TEST_DESCRIPTION');

      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');
      cy.get('input[name="title"]').should('have.value', 'TEST_TITLE');

      // Open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .wait(1000)
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="icon:story"]').should('be.visible');

      // Select Baby Yoda from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      // Select Baby Yoda from assignee dropdown
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE')
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
            cy.get('[data-testid="icon:story"]').should('be.visible');
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains('TEST_TITLE')
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
        cy.get('[data-testid="icon:story"]').should('be.visible');
      });
  });

  //SAMPLE 1 FOR THIS ASSIGNMENT
  it('Should validate title is required field if missing', () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      // Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should(
        'contain',
        'This field is required'
      );
    });
  });

  //////// SAMPLES END ///////
});
