@ignore
Feature: Access Management - User - Dropdown

  Scenario: Reset User Passowrd Dialog Opens
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization User request has been intercepted to return Groups "001" for the User "002" from Organization "001"
    And the Policies Policy Types request has been intercepted to return the Policy Types "" for Service Provider "001"
    And the IAM Disable Organization User request has been intercepted to return the User "002" from Organization "001"
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    And the Element with Cypress ID "first-name user-detail-item-text" should exist
    When the User clicks on the Element with Cypress ID "user-details-actions"
    And the User clicks on the Element with Cypress ID "user-details-actions-item-reset-password"
    Then the Element with Cypress ID "dialog-confirm-reset-password" should exist

  Scenario: User should be redirected after Deletion
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization User request has been intercepted to return Groups "001" for the User "002" from Organization "001"
    And the Policies Policy Types request has been intercepted to return the Policy Types "" for Service Provider "001"
    And the IAM Disable Organization User request has been intercepted to return the User "002" from Organization "001"
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    And the Element with Cypress ID "first-name user-detail-item-text" should exist
    When the User clicks on the Element with Cypress ID "button"
    And the User clicks on the Element with Cypress ID "user-details-actions-item-delete-user"
    And the IAM Organization delete Organization User with ID "002" from Organization "001" request has been intercepted
    When the User clicks on the Element with Cypress ID "dialog-confirm-remove-user-from-organization button-submit"
    Then the User should be redirected to "/sc/users"
