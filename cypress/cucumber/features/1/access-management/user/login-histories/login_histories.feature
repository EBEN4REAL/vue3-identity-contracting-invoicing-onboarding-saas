Feature: User Login Histories

  Scenario: User login histories fetched successfully

    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization user "ded35af8-c60c-4f98-b35b-64db59deb4a7" login histories request has been intercepted to return IP's "127.0.0.1" for Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the User clicks on the Element with Cypress ID "tab-item-login-history"
    And the Element with Cypress ID "user-login-histories" should exist
    And the Element with Cypress ID "user-login-histories" contains the text as "127.0.0.1"

  Scenario: Login history should be visible when feature flag is enabled

    Given the User "005" is Signed In
    And the feature flag "login_history" is enabled
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization user "ded35af8-c60c-4f98-b35b-64db59deb4a7" login histories request has been intercepted to return IP's "127.0.0.1" for Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the Element with Cypress ID "tab-item-login-history" should exist

  Scenario: Login history should NOT be visible when feature flag is disabled
  
    Given the User "005" is Signed In
    And the feature flag "login_history" is disabled
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization user "ded35af8-c60c-4f98-b35b-64db59deb4a7" login histories request has been intercepted to return IP's "127.0.0.1" for Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the Element with Cypress ID "tab-item-login-history" should NOT exist
