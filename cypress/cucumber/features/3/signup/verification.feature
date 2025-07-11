Feature: Signup - Verification

  Scenario: Signup Verification Page with Error Status
    Given the User navigates to "/signup/verification?status=ERROR&error=MISSING_OR_INVALID_TOKEN"
    Then the Element with Cypress ID "signup-form-alert" should be visible

  Scenario: Signup Verification Page without Status
    Given the User navigates to "/signup/verification"
    Then the User should be redirected to "/signup"

  @ignore
  Scenario: Signup Verification Page without Error Status
    Given the User navigates to "/signup/verification?status=SUCCESS"
    Then the User should be redirected to "/signup"

  Scenario: Authorized User accessing Signup Verification Page page without Next URL

    Given the User "001" is Signed In
    When the User navigates to "/signup/verification"
    Then the User should be redirected to "/"

  @ignore
  Scenario: Authorized User accessing Signup Verification Page with Next URL

    Given the User "001" is Signed In
    When the User navigates to "/signup/verification?next_url=/signup"
    Then the User should be redirected to "/signup"
