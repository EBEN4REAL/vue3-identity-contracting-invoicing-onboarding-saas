Feature: Login to Organization

  Scenario: Should Show login organizations on Appbar and successfully login to Organization

    Given the User "003With2Orgs" is Signed In
    And the IAM User @me request has been intercepted to return the User "003With2Orgs"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the Service Consumers Policies request has been intercepted to return the Org PolicyType "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM Organization request has been intercepted to return the Organization "000" for SP "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Element with Cypress ID "organizations-dropdown-items" should be visible
    And the User clicks on the Element with Cypress ID "organizations-dropdown-items"
    And the Element with Cypress ID "organizations-dropdown-items-item-org-002" should be visible
    And the POST request for login to organization has been intercepted with id "8b2e7a85-a1d9-4f6c-b7e2-8d3f9c24e591"
    And the User clicks on the Element with Cypress ID "organizations-dropdown-items-item-org-002"
    Then check that the user is currently logged in the organization dashboard with the id "8b2e7a85-a1d9-4f6c-b7e2-8d3f9c24e591"

  Scenario: Dropdown icon and clickable area for organization selection should toggle popup successfully
  
    Given the User "003With2Orgs" is Signed In
    And the IAM User @me request has been intercepted to return the User "003With2Orgs"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the Service Consumers Policies request has been intercepted to return the Org PolicyType "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM Organization request has been intercepted to return the Organization "000" for SP "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Element with Cypress ID "organizations-dropdown-items" should be visible
    When the User clicks on the Element with Cypress ID "org-selection-dropdown-down-icon"
    Then the Element with Cypress ID "organizations-dropdown-items-item-org-002" should be visible
    And the User clicks on the Element with Cypress ID "org-selection-dropdown-up-icon"
    And the Element with Cypress ID "organizations-dropdown-items-item-org-002" should NOT be visible
