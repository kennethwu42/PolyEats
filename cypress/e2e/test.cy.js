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
    cy.contains('.card-title', '1901 Marketplace', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.wait(4000);

    cy.url().should('include', '/complex');
    cy.wait(2000);

    // Step 5: Click Sort and Select "Name, A-Z"
    cy.get('button.dropdown-toggle')
      .should('be.visible')
      .click();
    cy.wait(2000);

    cy.contains('Name, A-Z')
      .should('be.visible')
      .click();
    cy.wait(2000);

    // Step 6: Click Filter and Apply Filter Settings
    cy.get('button.btn.btn-primary').contains('Filter').should('be.visible').click();
    cy.wait(2000);

    cy.get('#filterRating').clear().type('1');
    cy.wait(2000);
    cy.get('select[name="price"]').select('All');
    cy.wait(2000);
    cy.get('input[name="cuisine"]').type('Fast Food');
    cy.wait(2000);
    cy.get('input[name="delivery"]').check();
    cy.get('input[name="PolyCard"]').check();
    cy.get('input[name="Vegan"]').check();
    cy.get('input[name="M"]').check();
    cy.contains('button', 'Apply Filters').should('be.visible').click();
    cy.wait(2000);

    // Step 7: Navigate to a Restaurant's Reviews Page
    cy.contains('Panda Express').click();
    cy.wait(4000);
    cy.url().should('include', '/restaurant');
    cy.wait(2000);

    // Step 8: Check Details and Close
    cy.get('.toggle-overlay-button').should('be.visible').click();
    cy.wait(2000);
    cy.get('.close-overlay-button').should('be.visible').click();
    cy.wait(2000);

    // Step 9: Add to Favorites
    cy.get('.bookmark').should('be.visible').click();
    cy.wait(3000);
    cy.contains('Restaurant added to favorites').should('be.visible');
    cy.wait(300);

    // Add a review
    cy.contains('Add Review').should('be.visible').click();
    cy.wait(2000);
    cy.get('input[name="item"]').type('Beef and Broccoli');
    cy.wait(2000);
    cy.get('textarea[name="review"]').type('This is a great restaurant!');
    cy.wait(2000);
    cy.get('input[name="rating"]').type('5');
    cy.wait(2000);
    const imagePath = 'Orangechicken.jpg'; // File located in "cypress/fixtures"
    cy.get('input[type="file"]').attachFile(imagePath);
    cy.wait(2000);
    cy.get('button[type="submit"]').contains('Submit Review').should('be.visible').click();
    cy.contains('Beef and Broccoli').should('be.visible');
    cy.wait(2000);

    // Delete a review
    cy.contains('Beef and Broccoli').parents('.review-card').within(() => {
      cy.get('button.delete-review-button').should('exist').should('be.visible').click();
    });
    cy.wait(2000);
    cy.contains('Beef and Broccoli').should('not.exist');
    cy.wait(2000);

    // Step 10: Verify Favorites Page
    cy.contains('a', 'Favorites').should('be.visible').click();
    cy.wait(2000);
    cy.contains('.card', 'Panda Express').should('be.visible').within(() => {
      cy.get('button.btn.btn-danger').should('be.visible').click();
    });
    cy.wait(2000);
    cy.contains('.card', 'Panda Express').should('not.exist');
    cy.wait(2000);

    // Step 11: Verify Account Page
    cy.contains('a', 'Account').should('be.visible').click();
    cy.wait(2000);

    // Step 11.5: Change Profile Picture
    const profileImagePath = 'hanjosi-fragment3.jpg'; // File located in "cypress/fixtures"
    cy.get('input#profile-pic-upload').should('exist').attachFile(profileImagePath);
    cy.wait(2000);

    // Step 12: Log Out
    cy.contains('button', 'Sign Out').should('be.visible').click();
    cy.wait(2000);
    cy.url().should('include', '/');

    // Step 13: Log Back In
    cy.visit('/login');
    cy.wait(2000);
    cy.get('#calpoly_email').type(testUser.email);
    cy.wait(2000);
    cy.get('#password').type(testUser.password);
    cy.wait(2000);
    cy.get('input[type="button"][value="Log In"]').click();
    cy.wait(2000);
    cy.contains('a', 'Account').should('be.visible').click();
    cy.wait(2000);

    // Step 14: Delete Account
    cy.contains('button', 'Delete Account').should('be.visible').click();
    cy.wait(2000);
    cy.contains('button', 'Yes, Delete').should('be.visible').click();
    cy.wait(2000);

    // Step 15: Verify Account Deletion
    cy.visit('/login');
    cy.wait(2000);
    cy.get('#calpoly_email').type(testUser.email);
    cy.wait(2000);
    cy.get('#password').type(testUser.password);
    cy.wait(2000);
    cy.get('input[type="button"][value="Log In"]').click();
    cy.contains('User does not exist').should('be.visible');
  });
});
