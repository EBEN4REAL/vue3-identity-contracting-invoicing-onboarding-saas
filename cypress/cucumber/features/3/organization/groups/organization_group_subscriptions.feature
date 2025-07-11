Feature: Organization Group Subscriptions Table

  Background: Organization Group Subscriptions Table
    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the IAM Organization User request has been intercepted to return the Group Users "001" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"

  Scenario: Subscriptions are displayed
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Group "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1" with query params "?category=SUBSCRIPTION&limit=10&offset=0"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    When the User clicks on the Element with Cypress ID "tab-item-access"
    Then the Element with Cypress ID "subscriptions-table" contains the text as "Service provider 3"
  
  Scenario: Unassign button opens the confirm modal
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Group "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1" with query params "?category=SUBSCRIPTION&limit=10&offset=0"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "tab-item-access"
    And the User clicks on the Element with Cypress ID "subscriptions-table actions-button-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"
    When the User clicks on the Element with Cypress ID "dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3-item-remove-subscription"
    Then the Element with Cypress ID "confirm-unassign" should be visible
    And the Element with Cypress ID "dialog-title" contains the text as "Remove Service provider 3"

  Scenario: Assign subscription button should be disabled if there are no licenses to be assigned
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&cancelled=false&category=ACCESS"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&cancelled=false&category=SUBSCRIPTION"
    And the Policies Service Agreements request has been intercepted to return no Licenses from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&category=ACCESS"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "no-licenses" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Group "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Policies Service Agreements request has been intercepted to return no Licenses from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "category=SUBSCRIPTION&limit=10&offset=0"
    When the User clicks on the Element with Cypress ID "tab-item-access"
    And the policies service agreements request have been completed successfully
    Then the Element with Cypress ID "assign-subscription-button" should be disabled 

  Scenario: Assign subscription button opens the assign modal
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Group "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "tab-item-access"
    When the User clicks on the Element with Cypress ID "assign-subscription-button"
    Then the Element with Cypress ID "assign-license-dialog" should be visible
    And the Element with Cypress ID "dialog-title" contains the text as "Assign Subscription to Group Group 1"
    And the Element with Cypress ID "create-group-submit-button" contains the text as "Assign Subscription"

  Scenario: Assign modal form includes licenses and policies
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Group "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    When the User clicks on the Element with Cypress ID "tab-item-access"
    And the User clicks on the Element with Cypress ID "assign-subscription-button"
    And the User clicks on the Element with Cypress ID "assign-subscription-to-group-autocomplete autocomplete"
    And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "mm-autocomplete-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"
    And the license policies request has been completed
    Then the Element with Cypress ID "checkbox-label" contains the text as "Policy #1"

  Scenario: Successfully redirect to Subscriptions detailed view from group details
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Group "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "tab-item-access"
    Then the User clicks on the Element with Cypress ID "subscriptions-table license-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    Then the User should be redirected to '/sc/subscriptions/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1'
