Feature: Signup - Confirmation

  Scenario: Signup Confirmation Page from direct URL
    Given the password requirements request has been intercepted to return the Password Requirement "all"
    When the User navigates to "/signup/confirmation?token=TOKEN&csrf_token=CSRF_TOKEN"
    Then the Element with Cypress ID "password" should be visible
    And the Element with Cypress ID "continue" should be visible

  Scenario: Signup Confirmation Page with Error Status

    Given the IAM POST Signup Confirmation redirects to the Signup Confirmation page with Error Status
    And the password requirements request has been intercepted to return the Password Requirement "all"
    When the User navigates to "/signup/confirmation?token=TOKEN&csrf_token=CSRF_TOKEN"
    And the User types "jz8mMUayuZhnAK47!" in Input inside Element with Cypress ID "password"
    And the User clicks on the Element with Cypress ID "continue"
    Then the User should be redirected to "/signup/confirmation"
    And the URL should contain the param "status" as "ERROR"
    And the Element with Cypress ID "signup-form-alert" should be visible

  Scenario: Signup Confirmation Page with Success Status

    Given the IAM POST Signup Confirmation redirects to the Signup Confirmation page with Success Status
    And the password requirements request has been intercepted to return the Password Requirement "all"
    When the User navigates to "/signup/confirmation?token=TOKEN&csrf_token=CSRF_TOKEN"
    And the User types "jz8mMUayuZhnAK47!" in Input inside Element with Cypress ID "password"
    And the User clicks on the Element with Cypress ID "continue"
    Then the User should be redirected to "/signup/confirmation"
    And the URL should contain the param "status" as "SUCCESS"
    And the Element with Cypress ID "success" should be visible
    And the Element with Cypress ID "continue" should NOT exist
    And the Element with Cypress ID "login" should be visible

  Scenario: Toggle Signup Confirmation Password Input type

    When the User navigates to "/signup/confirmation?token=TOKEN&csrf_token=CSRF_TOKEN"
    And the User types "password" in Input inside Element with Cypress ID "password"
    When the User clicks on the Element with Cypress ID "appended-icon"
    Then the Element with Cypress ID "password input" should have the attribute "type" as "text"
    And the User clicks on the Element with Cypress ID "appended-icon"
    And the Element with Cypress ID "password input" should have the attribute "type" as "password"

  @ignore
  Scenario: Authorized User accessing Signup Confirmation Page page without Next URL

    Given the User "001" is Signed In
    When the User navigates to "/signup/confirmation"
    Then the User should be redirected to "/"
  
  @ignore
  Scenario: Authorized User accessing Signup Confirmation Page with Next URL

    Given the User "001" is Signed In
    When the User navigates to "/signup/confirmation?next_url=/signup"
    Then the User should be redirected to "/signup"
