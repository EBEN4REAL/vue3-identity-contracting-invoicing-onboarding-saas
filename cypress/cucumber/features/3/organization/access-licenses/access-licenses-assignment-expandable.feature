Feature: Access License - Assignment Expandable

  Scenario: Dialog Assign License to Groups has correct title
    Given the User "MMAdmin001" is Signed In
    And the Policies Service Consumers Agreements request has been intercepted to return the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Users "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Groups "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Units "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "assignments-expandable"
    And the User clicks on the Element with Cypress ID "assignment-tab-groups"
    And the User clicks on the Element with Cypress ID "button-assign-license"
    Then the Element with Cypress ID "dialog-assign-license-to-group dialog-title" contains the text as "Assign Service provider 1 to Group(s)"

  Scenario: Dialog Assign License to Units has correct title
    Given the User "MMAdmin001" is Signed In
    And the Policies Service Consumers Agreements request has been intercepted to return the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Users "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Groups "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Units "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "assignments-expandable"
    And the User clicks on the Element with Cypress ID "assignment-tab-organization_units"
    And the User clicks on the Element with Cypress ID "button-assign-license"
    Then the Element with Cypress ID "dialog-assign-license-to-unit dialog-title" contains the text as "Assign Service provider 1 to Unit(s)"

  Scenario: Dialog Assign License to User has correct title
    Given the User "MMAdmin001" is Signed In
    And the Policies Service Consumers Agreements request has been intercepted to return the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Users "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM Organization User request has been intercepted to return the User "001" from Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Groups "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Units "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "assignments-expandable"
    And the User clicks on the Element with Cypress ID "assignment-tab-individuals"
    When the User clicks on the Element with Cypress ID "button-assign-license"
    Then the Element with Cypress ID "dialog-title" contains the text as "Assign Service provider 1 to User(s)"
