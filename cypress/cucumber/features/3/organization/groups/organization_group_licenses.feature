Feature: Show - Organization Group Licenses

  Scenario: Licenses are displayed

    Given the User "005" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&cancelled=false&category=ACCESS"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Group "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    When the User clicks on the Element with Cypress ID "tab-item-access"
    Then the Element with Cypress ID "licenses-table" contains the text as "Service provider 1"
  
  Scenario: Organization Groups Licenses Table should display Manage Optional Policies for licenses with optional policies

    Given the User "005" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&cancelled=false&category=ACCESS"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&category=SUBSCRIPTION"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Group "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "tab-item-access"
    When the User clicks on the Element with Cypress ID "licenses-table actions-button-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    Then the Element with Cypress ID "licenses-dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1-item-manage-optional-policies" should be visible
    And the Element with Cypress ID "licenses-dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1-item-manage-optional-policies" contains the text as "Manage Optional Policies"  
  
  Scenario: Unassign button opens the confirm modal

    Given the User "005" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Group "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "tab-item-access"
    And the User clicks on the Element with Cypress ID "licenses-table actions-button-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    When the User clicks on the Element with Cypress ID "licenses-dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1-item-remove-license"
    Then the Element with Cypress ID "confirm-unassign" should be visible
    And the Element with Cypress ID "dialog-title" contains the text as "Remove Service provider 1"

  Scenario: Successfully disable assign license button in the organization group details licenses tab if there are no licenses to be assigned 

    Given the User "005" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&cancelled=false&category=ACCESS"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&cancelled=false&category=SUBSCRIPTION"
    And the Policies Service Agreements request has been intercepted to return no Licenses from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&category=ACCESS"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "no-licenses" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Group "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Policies Service Agreements request has been intercepted to return no Licenses from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "category=ACCESS&limit=10&offset=0"
    When the User clicks on the Element with Cypress ID "tab-item-access"
    And the policies service agreements request have been completed successfully
    Then the Element with Cypress ID "assign-license-button" should be disabled 

  Scenario: Assign license button opens the assign modal

    Given the User "005" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Group "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "tab-item-access"
    When the User clicks on the Element with Cypress ID "assign-license-button"
    Then the Element with Cypress ID "assign-license-dialog" should be visible
    And the Element with Cypress ID "dialog-title" contains the text as "Assign License to Group Group 1"
    And the Element with Cypress ID "create-group-submit-button" contains the text as "Assign License"

  Scenario: Assign modal form includes licenses and policies

    Given the User "005" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Group "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    When the User clicks on the Element with Cypress ID "tab-item-access"
    And the User clicks on the Element with Cypress ID "assign-license-button"
    And the User clicks on the Element with Cypress ID "assign-license-to-group-autocomplete autocomplete"
    And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "mm-autocomplete-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"
    And the license policies request has been completed
    Then the Element with Cypress ID "checkbox-label" contains the text as "Policy #1"

  Scenario: Successfully redirect to Users detailed view from group details
                
    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the IAM Organization User request has been intercepted to return the Group Users "001" from Organization "001"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    Then the User clicks on the Element with Cypress ID "row-0 name table-1edfc35c-e116-4c2e-8e35-8a28b68d5f6d"
    Then the User should be redirected to '/sc/users/1edfc35c-e116-4c2e-8e35-8a28b68d5f6d'

  Scenario: Successfully redirect to Access Licenses detailed view from group details
    Given the User "005" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Group "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "tab-item-access"
    Then the User clicks on the Element with Cypress ID "licenses-table license-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    Then the User should be redirected to '/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1'
