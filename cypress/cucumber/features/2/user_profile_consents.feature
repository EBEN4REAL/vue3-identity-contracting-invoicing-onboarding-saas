Feature: User profile - Consents

  Scenario: Consents should be displayed in table
    Given the User "003" is Signed In
    And the feature flag "consents_user" is enabled
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization request has been intercepted to return Service Providers "001" from Organization "001"
    And the Onboarding User me GET consents "001" request has been intercepted
    When the User navigates to "/user/profile"
    Then the Element with Cypress ID "table-consents row-0 name" contains the text as "Service Provider 001"
    And the Element with Cypress ID "table-consents row-0 consent_date" should have the formatted date as "23 Sep 2024, 07:09 AM"
    And the Element with Cypress ID "consent-organizations-count" contains the text as "1"

  Scenario: Should delete consent
    Given the User "003" is Signed In
    And the feature flag "consents_user" is enabled
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization request has been intercepted to return Service Providers "001" from Organization "001"
    And the Onboarding User me GET consents "001" request has been intercepted
    And the User navigates to "/user/profile"
    And the User clicks on the Element with Cypress ID "table-consents row-0 actions"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-review-consent"
    And the Element with Cypress ID "dialog-review-consent" contains the text as "attr type #1"
    And the Onboarding User me DELETE consent from Service Provider "001" request has been intercepted
    And the Onboarding User me GET consents "000" request has been intercepted
    When the User clicks on the Element with Cypress ID "dialog-review-consent button-submit"
    Then the Element with Cypress ID "table-consents row-0" should NOT exist
    And the Element with Cypress ID "consent-organizations-count" contains the text as "0"

