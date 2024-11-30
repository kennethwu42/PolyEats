describe('Full App End-to-End Test', () => {
  const testUser = {
    email: `testuser+${Date.now()}@calpoly.edu`, // Unique email to prevent conflicts
    password: 'qwerty',
    firstname: 'Bob',
    lastname: 'Jones',
  };

  it('completes the full app flow', () => {
    // Step 1: Visit Signup Page and Sign Up a New User
    cy.visit('/signup');
    cy.wait(2000);
    cy.get('#firstname').type(testUser.firstname);
    cy.wait(2000);
    cy.get('#lastname').type(testUser.lastname);
    cy.wait(2000);
    cy.get('#calpoly_email').type(testUser.email);
    cy.wait(2000);
    cy.get('#password').type(testUser.password);
    cy.wait(2000);
    cy.get('input[type="button"][value="Sign Up"]').click();

    // Step 2: Mock Email Verification Response
    cy.intercept('GET', '**/auth/verify-email?token=mocked_token_123', {
      statusCode: 200,
      body: { message: 'Email successfully verified!' },
    }).as('verifyEmail');
    cy.wait(2000);

    // Simulate the email verification API call
    cy.request({
      method: 'GET',
      url: '/auth/verify-email?token=mocked_token_123',
    }).then((response) => {
      expect(response.status).to.eq(200);
      if (response.body.message) {
        expect(response.body.message).to.eq('Email successfully verified!');
      } else {
        cy.log('No `message` field found in response body.');
      }
    });
    cy.wait(2000);

    // Navigate to Login Page
    cy.visit('/login');
    cy.wait(2000);

    // Step 3: Log In the User
    cy.get('#calpoly_email').type(testUser.email);
    cy.wait(2000);
    cy.get('#password').type(testUser.password);
    cy.wait(2000);
    cy.get('input[type="button"][value="Log In"]').click();
    cy.wait(2000);

    // Ensure user is redirected to Complex Page
    cy.url().should('include', '/');
    cy.wait(2000);

    // Step 4: Navigate to a Complex Page
    cy.contains('.card-title', '1901 Marketplace', { timeout: 10000 }) // Targeting the specific class with the text
      .should('be.visible') // Ensure the element is visible
      .click(); // Click the complex
    cy.wait(4000);

    cy.url().should('include', '/complex'); // Verify the navigation
    cy.wait(2000);

    // Step 6: Navigate to a Restaurant's Reviews Page
    cy.contains('Panda Express').click(); // Replace with actual restaurant name
    cy.wait(4000);
    cy.url().should('include', '/restaurant');
    cy.wait(2000);

    // Step 7: Perform Actions on the Reviews Page
    // Add to Favorites
    cy.get('.bookmark') // Select the star icon with the 'bookmark' class
      .should('be.visible') // Ensure the star icon is visible
      .click(); // Click the star icon to favorite the restaurant
    cy.wait(3000);

    cy.contains('Restaurant added to favorites').should('be.visible'); // Verify the toast or confirmation message
    cy.wait(300);

    // Add a review
    cy.contains('Add Review') // Locate the "Add Review" button
      .should('be.visible') // Ensure it's visible
      .click(); // Click the "Add Review" button to open the review form
    cy.wait(2000);

    // Fill out the review form
    cy.get('input[name="item"]') // Locate the "Item" input field
      .type('Beef and Brocoli'); // Add the item name
    cy.wait(2000);

    cy.get('textarea[name="review"]') // Locate the "Review" textarea
      .type('This is a great restaurant!'); // Add the review text
    cy.wait(2000);

    cy.get('input[name="rating"]') // Locate the "Rating" input field
      .type('5'); // Add the rating (1-5)
    cy.wait(2000);

    // Submit the review
    cy.get('button[type="submit"]').contains('Submit Review') // Locate the "Submit Review" button
      .should('be.visible') // Ensure it's visible
      .click(); // Submit the review

    // Verify the review appears on the page
    cy.contains('Beef and Brocoli').should('be.visible'); // Ensure the item name is displayed
    cy.wait(2000);
    cy.contains('This is a great restaurant!').should('be.visible'); // Ensure the review text is displayed
    cy.wait(2000);
    cy.contains('Rating: 5').should('be.visible'); // Ensure the rating is displayed
    cy.wait(2000);

    // Delete a review
    cy.contains('Beef and Brocoli') // Find the specific review by the item name
      .parents('.review-card') // Locate its parent container with a unique class
      .within(() => {
        cy.get('button.delete-review-button') // Locate the delete button within the review card
          .should('exist') // Confirm it exists
          .should('be.visible') // Ensure it is visible
          .click(); // Click the delete button
      });
    cy.wait(2000);

    cy.contains('Beef and Brocoli') // Ensure the review is removed from the page
      .should('not.exist');
    cy.wait(2000);

    // Step 8: Verify Favorites Page
    cy.contains('a', 'Favorites') // Locate the "Favorites" link by its text
      .should('be.visible') // Ensure the link is visible
      .click(); // Click the link to navigate to Favorites Page
    cy.wait(2000);

    cy.contains('.card', "Panda Express") // Locate the card for the restaurant
      .should('be.visible') // Ensure the restaurant card is visible
      .within(() => {
        cy.get('button.btn.btn-danger') // Locate the remove button by its class
          .should('be.visible') // Ensure the button is visible
          .click(); // Click the button to remove the restaurant from Favorites
      });
    cy.wait(2000);

    cy.contains('.card', "Panda Express").should('not.exist'); // Verify the restaurant is removed
    cy.wait(2000);

    // Step 9: Verify Account Page
    cy.contains('a', 'Account') // Locate the "Account" link by its text
      .should('be.visible') // Ensure the link is visible
      .click(); // Click the link to navigate to Account Page
    cy.wait(2000);

    // Step 10: Log Out
    cy.contains('Sign Out') // Locate the "Sign Out" button by its text
      .should('be.visible') // Ensure the button is visible
      .click(); // Click the button to log out
    cy.wait(2000);

    cy.url().should('include', '/login'); // Ensure redirected back to login page
  });
});
