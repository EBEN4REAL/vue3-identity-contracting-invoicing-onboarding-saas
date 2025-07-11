Feature: Access Management - Users - Licenses Type Subscriptions

  Scenario: Organization Users Subscriptions Table should exist and have the right content
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "004" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with pagination
    And the IAM Organization User request has been intercepted to return Groups "001" for the User "002" from Organization "001"
    When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Organization User "ded35af8-c60c-4f98-b35b-64db59deb4a7" with query params "&category=SUBSCRIPTION"
    Then the User clicks on the Element with Cypress ID "tab-item-access"
    And the Element with Cypress ID "user-details-subscriptions-table" should exist
    And the Element with Cypress ID "user-details-subscriptions-table page-subtitle" should have the text as "All Subscriptions directly assigned to User 002."
    And the Element with Cypress ID "user-details-subscriptions-table agreement_type_name" should have the text as "Service provider 3"

  Scenario: Successfully disable assign subscription button in the organization user details subscriptions tab if there are no subscriptions to be assigned 
     Given the User "003" is Signed In
     And the IAM User @me request has been intercepted to return the User "003"
     And the IAM Organization request has been intercepted to return the Organization "001"
     And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
     And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
     When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
     And the Policies Service Agreements request has been intercepted to return no Licenses from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&category=SUBSCRIPTION"
     And the User clicks on the Element with Cypress ID "tab-item-access"
     And the policies service agreements request have been completed successfully
     Then the Element with Cypress ID "user-details-subscriptions-table assign-subscription-button" should be disabled 

  Scenario: Successfully assign subscription to org user and disable already assigned subscriptions in Autocomplete dropdown
     Given the User "003" is Signed In
     And the IAM User @me request has been intercepted to return the User "003"
     And the IAM Organization request has been intercepted to return the Organization "001"
     And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
     And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
     And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002,003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Organization User "ded35af8-c60c-4f98-b35b-64db59deb4a7" with query params "&category=SUBSCRIPTION"
     When the User clicks on the Element with Cypress ID "tab-item-access"
     And the User clicks on the Element with Cypress ID "assign-subscription-button"
     Then the Element with Cypress ID "assign-subscription-dialog" should exist
     Then the Element with Cypress ID "dialog-title" should have the text as "Assign Subscription to User 002" 
     And the Element with Cypress ID "assign-subscription-to-user-submit-button" should have the text as " Assign Subscription"
     And the User clicks on the Element with Cypress ID "assign-subscription-to-user-autocomplete autocomplete"
     Then the Element with Cypress ID "mm-autocomplete-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1" should have a class "mm-autocomplete-option--disabled"
     And the User clicks on the Element with Cypress ID "mm-autocomplete-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"
     And the Policies Service Consumers Agreements request has been intercepted to assign the License "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3" to Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002,003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the User clicks on the Element with Cypress ID "assign-subscription-to-user-submit-button"
     And the Element with Cypress ID "column-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2" should have the text as "Service provider 2"

  Scenario: Successfully remove subscription to org user 
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003,004" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Organization User "ded35af8-c60c-4f98-b35b-64db59deb4a7" with query params "&category=SUBSCRIPTION"
    When the User clicks on the Element with Cypress ID "tab-item-access"
    And the User clicks on the Element with Cypress ID "user-details-subscriptions-table actions-button-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"
    And the User clicks on the Element with Cypress ID "dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3-item-remove-subscription"
    And the Element with Cypress ID "dialog-title" should have the text as "Remove Subscription"
    And the Element with Cypress ID "dialog-subtitle" should have the text as "Are you sure you want to remove this subscription assigned to User 002?"
    And the Policies Service Consumers Agreements request has been intercepted to unassign the License "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3" from the Organization User "ded35af8-c60c-4f98-b35b-64db59deb4a7" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "004" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Organization User "ded35af8-c60c-4f98-b35b-64db59deb4a7" with query params "&category=SUBSCRIPTION"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "004" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Organization User "ded35af8-c60c-4f98-b35b-64db59deb4a7" without sort with query params "&category=SUBSCRIPTION"
    And the User clicks on the Element with Cypress ID "button-confirm-unassign"
    And the organization user licenses request has been completed with query params "&category=SUBSCRIPTION"
    Then the Element with Cypress ID "user-details-subscriptions-table row-1" should NOT exist  

   Scenario: Successfully go to Subscription Details
     Given the User "003" is Signed In
     And the IAM User @me request has been intercepted to return the User "003"
     And the IAM Organization request has been intercepted to return the Organization "001"
     And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
     And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
     When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002,003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&category=SUBSCRIPTION"
     And the User clicks on the Element with Cypress ID "tab-item-access"
     And the User clicks on the Element with Cypress ID "user-details-subscriptions-table column-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"
     Then the User should be redirected to "sc/subscriptions/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"