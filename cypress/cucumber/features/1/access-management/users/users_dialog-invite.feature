Feature: Access Management - Users - Dialog Invite user

  Scenario: Show Invite User Dialog
    Given the User "003" is Signed In
    And the IAM Users request has been intercepted to return the Users "001,006"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the User navigates to "sc/users"
    When the User clicks on the Element with Cypress ID "button-open-dialog-invite-users"
    Then the Element with Cypress ID "dialog-invite-organization-users" should exist

  Scenario: Invite users Form in Invite User Dialog should be valid
    Given the User "003" is Signed In
    And the IAM Users request has been intercepted to return the Users "001,006"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the User navigates to "sc/users"
    And the User clicks on the Element with Cypress ID "button-open-dialog-invite-users"
    And the Element with Cypress ID "dialog-invite-organization-users" should exist
    When the User clicks on the Element with Cypress ID "invite-users-form-submit-button"
    Then the Element with Cypress ID "invite-users-form-emails" should have a class "mm-tags-input--error"

  Scenario: Invite User Dialog should have form alert
    Given the User "003" is Signed In
    And the IAM Users request has been intercepted to return the Users "001,006"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the User navigates to "sc/users"
    And the User clicks on the Element with Cypress ID "button-open-dialog-invite-users"
    And the Element with Cypress ID "dialog-invite-organization-users" should exist
    And the User enters text "test@test.com " in Input inside selector "[data-cy='invite-users-form-emails']"
    And the IAM Organization invite User request has been intercepted to return error from Organization "001"
    When the User clicks on the Element with Cypress ID "invite-users-form-submit-button"
    Then the Element with Cypress ID "invite-users-form-alert" should exist

  Scenario: Invite User

    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002" from Organization "001"
    And the IAM Organization units request has been intercepted to return Units for Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    And the User clicks on the Element with Cypress ID "tab-item-invites"
    And the User clicks on the Element with Cypress ID "button-open-dialog-invite-users"
    And the Element with Cypress ID "dialog-invite-organization-users" should exist
    And the User enters text "user008@email.com" in Input inside selector "[data-cy='invite-users-form-emails']"
    And the User selects option with Cypress ID "mm-select-option-01234567-89ab-cdef-0123-456789abcdef" in the Select with Cypress ID "invite-users-form-organizational-unit"
    And the User selects option with Cypress ID "mm-select-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1" in the Select with Cypress ID "invite-users-form-groups"
    And the IAM Organization invite User request has been intercepted to return invited users from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "008" from Organization "001"
    When the User clicks on the Element with Cypress ID "invite-users-form-submit-button"
    Then the Element with Cypress ID "row-0 email" should have the text as "user008@email.com"
