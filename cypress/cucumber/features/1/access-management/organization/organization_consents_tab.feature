Feature: Organization - Consents Tab

   Scenario: Organization Consents Table should have correct content
    Given the User "003" is Signed In
    And the feature flag "consents_organization" is enabled
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization request has been intercepted to return Service Providers "001" from Organization "001"
    And the Onboarding GET Consents "001" for Organization "001" request has been intercepted
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User clicks on the Element with Cypress ID "tab-item-consents"
    Then the Element with Cypress ID "table-consents row-0 name" contains the text as "Service Provider 001"
    And the Element with Cypress ID "table-consents row-0 consent_date" should have the formatted date as "23 Sep 2024, 07:09 AM"

  Scenario: Should delete consent
   Given the User "003" is Signed In
   And the feature flag "consents_organization" is enabled
   And the IAM Organization request has been intercepted to return the Organization "001"
   And the IAM Organization request has been intercepted to return Service Providers "001" from Organization "001"
   And the Onboarding GET Consents "001" for Organization "001" request has been intercepted
   And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
   And the User clicks on the Element with Cypress ID "tab-item-consents"
   And the User clicks on the Element with Cypress ID "table-consents row-0 actions"
   And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-review-consent"
   And the Element with Cypress ID "dialog-review-consent" contains the text as "attr type #1"
   And the Onboarding DELETE Consents for Service Provider "001" for Organization "001" has been intercepted
   And the Onboarding GET Consents "000" for Organization "001" request has been intercepted
   When the User clicks on the Element with Cypress ID "dialog-review-consent button-submit"
   Then the Element with Cypress ID "table-consents row-0" should NOT exist
