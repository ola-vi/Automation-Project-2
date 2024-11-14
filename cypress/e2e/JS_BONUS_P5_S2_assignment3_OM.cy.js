/*
 * P5 S2 Assignment 3 by ola-vi
 */
import NewIssueModal from '../pages/NewIssueModal';

describe('BONUS: Issue details editing', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project`)
      .then((url) => {
        cy.visit(url + '/board');
      });
  });

  //P5 S2 assignment 3 (bonus) task 1
  it('Should check and verify priority dropdown values', () => {
    const expectedLength = 5;
    const expectedValues = ['Lowest', 'Low', 'Medium', 'High', 'Highest'];
    let priorityArray = [];
    cy.contains('This is an issue of type: Task.').click();

    // Get initial option and push its text to the array
    cy.get('[data-testid="select:priority"]').within(() => {
      cy.get('[data-testid^="icon:"]')
        .siblings('div')
        .invoke('text')
        .then((initialValue) => {
          priorityArray.push(initialValue.trim()); // Push to array
          cy.log('Initial selected value:', initialValue.trim());
        });
    });

    cy.get('[data-testid="select:priority"]').click(); //.wait(2000);

    // Loop through all the dropdown options and push their text to the array
    cy.get('[data-testid="select:priority"]')
      .siblings()
      .find('div[data-testid^="select-option"]') // Find all priority options by partial selector
      .each(($el, index) => {
        // Extract text from each option
        cy.wrap($el)
          .invoke('text')
          .then((priorityValue) => {
            // Push each value to the array
            priorityArray.push(priorityValue.trim());
            // Print out the value and the length of the array
            cy.log(`Option ${index + 1}:`, priorityValue.trim());
            cy.log('Array length:', priorityArray.length);
          });
      });

    // Assert that array has expected length
    cy.wrap(priorityArray).should('have.length', expectedLength);

    // Assert that array contains expected values
    expectedValues.forEach((value) => {
      cy.wrap(priorityArray).should('include', value);
      cy.log(`Array contains: ${value}`); // This will log the current value
    });
  });

  //P5 S2 assignment 3 (bonus) task 2
  it('Should check and verify reporter name against regex', () => {
    cy.contains('This is an issue of type: Task.').click();

    cy.get('[data-testid="select:reporter"]')
      .find('[data-testid^="avatar:"]') // Find the element with the partial selector 'avatar:'
      .siblings() // Get all siblings
      .invoke('text') // Get the text content of the sibling
      .should('match', /^[A-Za-z\s]+$/); // Assert that the text matches the regex (only letters and spaces)
  });

  //P5 S2 assignment 3 (bonus) task 3
  // Its confusing assignment (trim removes only before and after sentence, not between words as stated in assignment
  //It was said that Jira page has changed and this assignment could be skipped
  //I have opinion that also the assignment is not very well stated by its description
  // Just did some tests

  it('Should check whitespaces removed in newly created issue title on board list', () => {
    //const issueTitle = 'Hello          world!'; // has 10 spaces between words total count 21 char // trim wont work
    
    const issueTitle = '     Hello world!     '; // has 5 spaces in front and after  words. Total count 22 char
    const expectedAmountIssues = '5';

    const issueDetails = {
      title: issueTitle,
      type: 'Bug',
      description: 'Once upon a time ...',
      assignee: 'Lord Gaben',
    };
    cy.visit('/project/board?modal-issue-create=true');
    NewIssueModal.createIssue(issueDetails);
    NewIssueModal.getIssueModal().should('not.exist');
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should('have.length', expectedAmountIssues)
          .first()
          .find('p')
          .invoke('text')
          .then((text) => {
            cy.log(
              'Actual title on board expected to equal title variable text (both containing spaces)'
            ).then(() => {
              expect(text).to.equal(issueTitle);
              cy.log('Title lenth with spaces is:' + text.length);
            });

            cy.log(
              'Actual title on board trimmed expected to equal trimmed title variable text (extra spaces removed before and after sentence inside the string)'
            ).then(() => {
              expect(text.trim()).to.equal(issueTitle.trim());
              cy.log('Title lenth without spaces' + text.trim().length);
            });

            cy.log(
              'This kind of trimming never removes spaces between words "Hello" and "world"'
            );
            cy.log(
              'If "Hello world" has 10 spaces between words, the length would still be 21, if trimmed'
            );
          });
      });
  });
});

// BELOW SOME PREVIOUS TESTS AND COMMANDS I WANT TO KEEP

// //P5 S2 assignment 3 (bonus) task 3 // my approach to understand it better
// it('Should check whitespaces  removed  in newly created issue title on board list', () => {
//   const issueTitle = ' This  is multi   spaced    title ';
//   //const issueTitle = ' This  is multi   spaced    title ';
//   const expectedIssueTitle = 'This is multi spaced title';
//   const expectedAmountIssues = '5';

//   const issueDetails = {
//     title: issueTitle,
//     type: 'Bug',
//     description: 'Once upon a time ...',
//     assignee: 'Lord Gaben',
//   };
//   cy.visit('/project/board?modal-issue-create=true');
//   NewIssueModal.createIssue(issueDetails);
//   //NewIssueModal.ensureIssueIsCreated(EXPECTED_AMOUNT_OF_ISSUES, issueDetails);

//   NewIssueModal.getIssueModal().should('not.exist');
//   cy.reload();
//   cy.contains('Issue has been successfully created.').should('not.exist');

//   cy.get('[data-testid="board-list:backlog"]')
//     .should('be.visible')
//     .and('have.length', '1')
//     .within(() => {
//       cy.get('[data-testid="list-issue"]')
//         .should('have.length', expectedAmountIssues)
//         .first()
//         .find('p')
//         .invoke('text')
//         .then((text) => {
//           // Trim and compare the text using expect

//           cy.log(
//             'Actual title on board expected to equal title variable text (both containing spaces)'
//           ).then(() => {
//             expect(text).to.equal(issueTitle);
//           });

//           cy.log(
//             'Actual trimmed title on board expected to equal trimmed title variable text (both with no paces)'
//           ).then(() => {
//             expect(text.trim()).to.equal(issueTitle.trim());
//           });

//           //expect(text).to.equal(issueTitle.trim());
//           cy.log(
//             'BELOW ACTUAL RESULTS FOR TEXT VALUES. "-marks added to front and end for better observing'
//           );
//           cy.log('Actual title text length from Jira: ' + text.length);
//           cy.log(
//             'Actual issue title variable text length: ' + issueTitle.length
//           );
//           cy.log(
//             'Length of actual title text (trimmed): ' + text.trim().length
//           );
//           cy.log(
//             'Length of issue title variable (trimmed): ' +
//               issueTitle.trim().length
//           );
//           cy.log(
//             '"' + text.trim() + '"' + ' Title retrieved from Jira and trimmed'
//           );
//           cy.log('"' + text + '"' + ' Title retrieved from Jira');
//           cy.log(
//             '"' +
//               issueTitle.trim() +
//               '"' +
//               ' Title variable with spaces trimmed'
//           );
//           cy.log('"' + issueTitle + '"' + ' Title variable with spaces');
//         });

//     });
// });

// If properties looked
//innerHTML: " This  is multi   spaced    title "
//innerText: "This is multi spaced title"

// Should I get property inner text??

///PREVIOUSLY TESTED

// //Actual title retrieved and compared in different forms
// cy.log(
//   JSON.stringify(text) +
//     ' -title retrieved from Jira has length ' +
//     JSON.stringify(text).length
// );
// cy.log(
//   text + ' -title retrieved from Jira has length ' + text.length
// );

// //Title variable compared in different forms
// cy.log(
//   JSON.stringify(issueTitle) +
//     ' -title from variable, used for issue creation has lenngth ' +
//     JSON.stringify(issueTitle).length
// );
// cy.log(
//   issueTitle +
//     ' -title from variable, used for issue creation has lenngth ' +
//     issueTitle.length
// );

// //Trimmed title variable
// cy.log(
//   issueTitle.trim() +
//     ' -TRIMMED title from variable, used for issue creation has length ' +
//     issueTitle.trim().length
// );

// //Trimmed title from jira
// cy.log(
//   text.trim() +
//     ' -TRIMMED title from  jira, used for issue creation has length ' +
//     text.trim().length
// );

// cy.log(`Trimmed title with quotes: "${trimmedTitle}"`);
// cy.log(`Length of trimmed title:`, trimmedTitle.length);
