Feature: Access Management - User - Details - Read

  Scenario: Forbidden with non-Org User

    Given the User "001OnboardingCompleted" is Signed In
    And the IAM User @me request has been intercepted to return the User "001OnboardingCompleted"
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    When the Element with Cypress ID "user-id user-detail-item-text" should NOT exist
    Then the Element with selector "#title" should have the text as "404"

  Scenario: Success with Organization Viewer from direct URL

    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    When the Element with Cypress ID "first-name user-detail-item-text" should exist
    Then the Element with Cypress ID "first-name user-detail-item-text" should have the text as "User"


  Scenario: Successfully redirect to detailed view
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    Then the User clicks on the Element with Cypress ID "row-0 name"
    Then the User should be redirected to '/sc/users/4a6f01d0-f3c6-4923-ad98-112d6d97355b'

  Scenario: User details has Inactive badge in title
    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the Element with Cypress ID "header-title badge" contains the text as "Inactive"
