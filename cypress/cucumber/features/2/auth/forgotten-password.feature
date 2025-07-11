Feature: Auth - Forgotten Password

  Scenario: Forgotten Password Page from Login

    Given the IAM OAuth Authorize redirects to the Login page
    And the IAM OAuth Authorize redirects to the Login page with username "user@example.com"
    And the IAM GET Password Forgotten redirects to the Forgotten Password page
    And the User navigates to "/"
    And the User should be redirected to "/login"
    When the User clicks on the Element with Cypress ID "forgot-password"
    Then the User should be redirected to "/forgotten-password"
    And the URL should contain the param "next_url"
    And the Element with Cypress ID "username" should be visible
    And the Element with Cypress ID "send-recovery-email" should be visible
    And the Element with Cypress ID "back-to" should be visible

  Scenario: Forgotten Password Page from direct URL

    Given the IAM GET Password Forgotten redirects to the Forgotten Password page
    When the User navigates to "/forgotten-password?username=user@email.com&csrf_token=CSRF_TOKEN"
    Then the Element with Cypress ID "username" should be visible
    And the Element with Cypress ID "send-recovery-email" should be visible
    And the User types "user@email.com" in Input inside Element with Cypress ID "username"

  Scenario: Forgotten Password Page from direct URL without CSRF Token

    Given the IAM GET Password Forgotten redirects to the Forgotten Password page
    When the User navigates to "/forgotten-password"
    Then the User should be redirected to "/forgotten-password"
    And the URL should contain the param "csrf_token"

  Scenario: Forgotten Password Page with Error Status

    Given the IAM POST Password Forgotten redirects to the Forgotten Password page with Error Status
    When the User navigates to "/forgotten-password?username=user@email.com&csrf_token=CSRF_TOKEN"
    And the User types "username@email.com" in Input inside Element with Cypress ID "username"
    And the User clicks on the Element with Cypress ID "send-recovery-email"
    Then the User should be redirected to "/forgotten-password"
    And the URL should contain the param "status" as "ERROR"
    And the Element with Cypress ID "alert" should be visible

  Scenario: Forgotten Password Page with Success Status

    Given the IAM POST Password Forgotten redirects to the Forgotten Password page with Success Status
    When the User navigates to "/forgotten-password?username=user@email.com&csrf_token=CSRF_TOKEN"
    And the User types "username@email.com" in Input inside Element with Cypress ID "username"
    And the User clicks on the Element with Cypress ID "send-recovery-email"
    Then the User should be redirected to "/forgotten-password"
    And the URL should contain the param "status" as "SUCCESS"
    And the Element with Cypress ID "button-back-to-login" should be visible
    And the Element with Cypress ID "send-recovery-email" should NOT exist

  Scenario: Authorized User accessing Forgotten Password page with Next URL

    Given the User "001" is Signed In
    When the User navigates to "/forgotten-password?next_url=http://nexturl.com"
    Then the User should be redirected to "http://nexturl.com"

  Scenario: Authorized User accessing Forgotten Password page without Next URL

    Given the User "001" is Signed In
    When the User navigates to "/forgotten-password"
    Then the User should be redirected to "/"
