Feature: Auth - Reset Password

  Scenario: Authorized User accessing Reset Password page with Next URL
    Given the User "001" is Signed In
    When the User navigates to "/reset-password?next_url=http://nexturl.com"
    Then the User should be redirected to "http://nexturl.com"

  Scenario: Authorized User accessing Reset Password page without Next URL
    Given the User "001" is Signed In
    When the User navigates to "/reset-password"
    Then the User should be redirected to "/"

  Scenario: Reset Password Page from direct URL
    Given the IAM GET Password Forgotten redirects to the Forgotten Password page
    And the password requirements request has been intercepted to return the Password Requirement "all"
    When the User navigates to "/reset-password?token=TOKEN&csrf_token=CSRF_TOKEN"
    Then the Element with Cypress ID "password" should be visible
    And the Element with Cypress ID "continue" should be visible

  Scenario: Reset Password Page without CSRF Token from direct URL
    Given the IAM GET Reset Forgotten redirects to the Reset Password page
    And the password requirements request has been intercepted to return the Password Requirement "all"
    When the User navigates to "/reset-password?token=TOKEN"
    Then the Element with Cypress ID "continue" should be visible
    Then the User should be redirected to "/reset-password?token=TOKEN&csrf_token=CSRF_TOKEN"

  Scenario: Reset Password Page with Token Error in URL
    Given the User navigates to "/reset-password?status=ERROR&error=MISSING_OR_INVALID_TOKEN&token=TOKEN&csrf_token=CSRF_TOKEN&&next_url=http://localhost/csrf_token=CSRF_TOKEN&username=user@mail.com"
    And the Element with Cypress ID "alert" should be visible
    And the Element with Cypress ID "subtitle" contains the text as "You need to reset your password again"
    And the Element with Cypress ID "alert" contains the text as "Missing or Invalid Token"
    And the Element with Cypress ID "continue" should NOT exist
    When the User clicks on the Element with Cypress ID "reset"
    Then the User should be redirected to "/forgotten-password?csrf_token=CSRF_TOKEN&next_url=http%3A%2F%2Flocalhost%2Fcsrf_token%3DCSRF_TOKEN&username=user%40mail.com"
    And the Input inside Element with Cypress ID "username" should have the value as "user@mail.com"

  Scenario: Reset Password Page with Error Status after Submitting
    Given the IAM POST Reset Forgotten redirects to the Reset Password page with Error Status
    And the password requirements request has been intercepted to return the Password Requirement "all"
    And the User navigates to "/reset-password?token=TOKEN&csrf_token=CSRF_TOKEN"
    And the Element with Cypress ID "continue" should be visible
    And the User types "jz8mMUayuZhnAK47!" in Input inside Element with Cypress ID "password"
    And the User force clicks on the Element with Cypress ID "continue"
    Then the User should be redirected to "/reset-password"
    And the URL should contain the param "status" as "ERROR"
    And the Element with Cypress ID "alert" should be visible

  Scenario: Reset Password Page with Success Status
    Given the IAM POST Reset Forgotten redirects to the Reset Password page with Success Status
    And the password requirements request has been intercepted to return the Password Requirement "all"
    And the User navigates to "/reset-password?token=TOKEN&csrf_token=CSRF_TOKEN"
    And the Element with Cypress ID "continue" should be visible
    And the User types "jz8mMUayuZhnAK47!" in Input inside Element with Cypress ID "password"
    And the User clicks on the Element with Cypress ID "continue"
    Then the User should be redirected to "/reset-password"
    And the URL should contain the param "status" as "SUCCESS"
    And the Element with Cypress ID "subtitle" should be visible
    And the Element with Cypress ID "continue" should NOT exist
    And the Element with Cypress ID "login" should be visible

  Scenario: Toggle Reset Password Input type
    Given the IAM POST Reset Forgotten redirects to the Reset Password page with Success Status
    And the password requirements request has been intercepted to return the Password Requirement "all"
    And the User navigates to "/reset-password?token=TOKEN&csrf_token=CSRF_TOKEN"
    And the Element with Cypress ID "continue" should be visible
    And the Element with Cypress ID "password mm-password-requirement-MIN_PASSWORD_SCORE-text" should exist
    And the Element with Cypress ID "password mm-password-requirement-MIN_PASSWORD_LENGTH-text" should exist
    And the Element with Cypress ID "password mm-password-requirement-REQUIRED_CHARACTER_TYPES-text" should exist
    When the User types "password" in Input inside Element with Cypress ID "password"
    And the User clicks on the Element with Cypress ID "password appended-icon"
    Then the Element with Cypress ID "password input" should have the attribute "type" as "text"
    And the User clicks on the Element with Cypress ID "password appended-icon"
    And the Element with Cypress ID "password input" should have the attribute "type" as "password"
