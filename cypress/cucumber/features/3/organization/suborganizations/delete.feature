Feature: Suborganization - Delete

  Scenario: Delete successful

    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM Organization request has been intercepted to return the Organization "001" for SP "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d"
    And the IAM User @me request has been intercepted to return the User "003"
    And the Suborganizations request has been intercepted to return the Suborganizations "011,002" for Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002,001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Service Consumers Policies request has been intercepted to return the Org PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "tab-item-sub-organizations"
    And the Element with Cypress ID "sub-organizations-table" contains the text as "Org 002"
    And the Element with Cypress ID "sub-organizations-table" contains the text as "Org 011"
    And the User clicks on the Element with Cypress ID "actions-4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Element with Cypress ID "actions-dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-delete" should exist
    And the User force clicks on the Element with Cypress ID "actions-dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-delete"
    And the Element with Cypress ID "confirm-delete-sub-organization" should exist
    And the Suborganizations request has been intercepted to return the Suborganizations "002" for Organization "001"
    And the Delete Suborganization "011" for Organization "001" request has been intercepted to return success
    When the User clicks on the Element with Cypress ID "button-confirm-delete-sub-organization"
    Then the Element with Cypress ID "sub-organizations-table" DOES NOT contain the text as "Org 011"
    And the Element with Cypress ID "sub-organizations-table" contains the text as "Org 002"

  Scenario: Delete failed

    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM Organization request has been intercepted to return the Organization "001" for SP "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d"
    And the IAM User @me request has been intercepted to return the User "003"
    And the Suborganizations request has been intercepted to return the Suborganizations "011,002" for Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002,001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Service Consumers Policies request has been intercepted to return the Org PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "tab-item-sub-organizations"
    And the Element with Cypress ID "sub-organizations-table" contains the text as "Org 002"
    And the Element with Cypress ID "sub-organizations-table" contains the text as "Org 011"
    And the User clicks on the Element with Cypress ID "actions-4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the Element with Cypress ID "actions-dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-delete" should exist
    And the User force clicks on the Element with Cypress ID "actions-dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-delete"
    And the Element with Cypress ID "confirm-delete-sub-organization" should exist
    And the Suborganizations request has been intercepted to return the Suborganizations "011,002" for Organization "001"
    And the Delete Suborganization "011" for Organization "001" request has been intercepted to return failure
    When the User clicks on the Element with Cypress ID "button-confirm-delete-sub-organization"
    Then the Element with Cypress ID "sub-organizations-table" contains the text as "Org 011"
    And the Element with Cypress ID "sub-organizations-table" contains the text as "Org 002"
    And the Element with Cypress ID "error-message" contains the text as "Error deleting sub-organization"
