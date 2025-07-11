Feature: User Profile

  Scenario: Onboarding Uncompleted

    Given the User "001" is Signed In
    And the Onboarding Flow request has been intercepted to return the Flow "user_details_without_job_role"
    When the User navigates to "/user/profile"
    Then the User should be redirected to "/onboarding"

  Scenario: Success with direct URL as SC

    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    When the User navigates to "/user/profile"
    Then the Element with Cypress ID "user-profile-details" should be visible
    And the Element with Cypress ID "first-name" contains the text as "User"
    And the Element with Cypress ID "last-name" contains the text as "003"

  Scenario: Success with click from App Bar as SC

    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "profile-card-activator"
    And the User clicks on the Element with Cypress ID "profile-card-profile-link"
    Then the User should be redirected to "/user/profile"
    And the Element with Cypress ID "user-profile-details" should be visible
    And the Element with Cypress ID "first-name" contains the text as "User"
    And the Element with Cypress ID "last-name" contains the text as "003"

  Scenario: User sessions fetched successfully

    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM User @me sessions request has been intercepted to return IP's "127.0.0.1"
    When the User navigates to "/user/security"
    Then the Element with Cypress ID "user-sessions" contains the text as "127.0.0.1"
    And the Element with Cypress ID "row-0 create_date" should exist
    And the Element with Cypress ID "row-0 create_date" contains the text as "25 Jul 2024"

  Scenario: User sessions deleted successfully

    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM User @me sessions request has been intercepted to return IP's "127.0.0.1"
    And the User navigates to "/user/security"
    And the IAM User @me delete session by token "123" request has been intercepted
    And the IAM User @me sessions request has been intercepted to return IP's ""
    When the User clicks on the Element with Cypress ID "delete-session-123"
    Then the Element with Cypress ID "user-sessions" DOES NOT contain the text as "127.0.0.1"

  Scenario: Remove Social Account if single Social Account and User has password

    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM User @me sessions request has been intercepted to return IP's "127.0.0.1"
    And the IAM User @me social accounts request has been intercepted to return "G-user.003@example.com"
    And the User navigates to "/user/security"
    And the Element with Cypress ID "user-social-accounts" contains the text as "user.003@example.com"
    And the IAM Delete User @me Social Account request has been intercepted for Type "G"
    And the IAM User @me social accounts request has been intercepted to return ""
    And the User clicks on the Element with Cypress ID "remove-social-G"
    When the User clicks on the Element with Cypress ID "button-confirm-delete-sub-organization"
    Then the Element with Cypress ID "user-social-accounts" should NOT exist

  Scenario: Remove Social Account if multiple Social Accounts

    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM User @me sessions request has been intercepted to return IP's "127.0.0.1"
    And the IAM User @me social accounts request has been intercepted to return "G-user.003@example.com, M-user.003@example2.com"
    And the User navigates to "/user/security"
    And the User clicks on the Element with Cypress ID "remove-social-G"
    And the IAM Delete User @me Social Account request has been intercepted for Type "G"
    And the IAM User @me social accounts request has been intercepted to return "M-user.003@example.com"
    Then the Element with Cypress ID "user-social-accounts account-type-G" should NOT exist

  Scenario: Remove Social Account button does not exist if single Social Account and User has no password

    Given the User "003-without-password" is Signed In
    And the IAM User @me request has been intercepted to return the User "003-without-password"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM User @me sessions request has been intercepted to return IP's "127.0.0.1"
    And the IAM User @me social accounts request has been intercepted to return "G-user.003@example.com"
    When the User navigates to "/user/security"
    Then the Element with Cypress ID "user-social-accounts remove-social-G" should NOT exist

  Scenario: User Details Saved

    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM User @me sessions request has been intercepted to return IP's "127.0.0.1"
    And the IAM User @me social accounts request has been intercepted to return "test@gmail.com"
    And the IAM Update User @me request has been intercepted to return the User "003Updated"
    And the User navigates to "/user/profile"
    And the User clicks on the Element with Cypress ID "toggle-edit-form-button"
    And the Element with Cypress ID "user-details-form" should exist
    And the User enters text "U" in Input inside Element with Cypress ID "firstNameInput"
    And the User enters text "U" in Input inside Element with Cypress ID "secondNameInput"
    When the User clicks on the Element with Cypress ID "save-button"
    Then the Element with Cypress ID "first-name" contains the text as "UserU"
    And the Element with Cypress ID "last-name" contains the text as "003U"

  Scenario: User details don't save after dismissing the edit form

    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM User @me sessions request has been intercepted to return IP's "127.0.0.1"
    And the IAM User @me social accounts request has been intercepted to return "test@gmail.com"
    And the User navigates to "/user/profile"
    And the User clicks on the Element with Cypress ID "toggle-edit-form-button"
    And the Element with Cypress ID "user-details-form" should exist
    And the User enters text "updated" in Input inside Element with Cypress ID "firstNameInput"
    When the User clicks on the Element with Cypress ID "dismiss-button"
    Then the Element with Cypress ID "first-name" contains the text as "User"

  Scenario: User login histories fetched successfully

    Given the User "003" is Signed In
    And the IAM login histories @me request has been intercepted to return the User "003"
    And the IAM login histories @me request has been intercepted to return IP's "127.0.0.1"
    When the User navigates to "/user/security"
    Then the Element with Cypress ID "user-login-histories" contains the text as "127.0.0.1"

  Scenario: Login history should be visible when feature flag is enabled

    Given the User "003" is Signed In
    And the feature flag "login_history" is enabled
    And the IAM login histories @me request has been intercepted to return the User "003"
    And the IAM login histories @me request has been intercepted to return IP's "127.0.0.1"
    When the User navigates to "/user/security"
    Then the Element with Cypress ID "user-login-histories" should exist

  Scenario: Login history should NOT be visible when feature flag is disabled

    Given the User "003" is Signed In
    And the feature flag "login_history" is disabled
    And the IAM login histories @me request has been intercepted to return the User "003"
    And the IAM login histories @me request has been intercepted to return IP's "127.0.0.1"
    When the User navigates to "/user/profile"
    Then the Element with Cypress ID "user-login-histories" should NOT exist

  Scenario: Disabling change email button when social accounts are connected

    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM User @me sessions request has been intercepted to return IP's "127.0.0.1"
    And the IAM User @me social accounts request has been intercepted to return "test@gmail.com"
    And the User navigates to "/user/profile"
    When the User clicks on the Element with Cypress ID "toggle-edit-form-button"
    Then the Element with Cypress ID "emailInput appended-button" should be disabled

  Scenario: Show email change modal and change email

    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM User @me sessions request has been intercepted to return IP's "127.0.0.1"
    And the User navigates to "/user/profile"
    And the User clicks on the Element with Cypress ID "toggle-edit-form-button"
    And the User clicks on the Element with Cypress ID "emailInput appended-button"
    And the Element with Cypress ID "change-email-form" should be visible
    And the User enters text "12345678" in Input inside Element with Cypress ID "current-password"
    And the User enters text "test@metrics.com" in Input inside Element with Cypress ID "new-email"
    And the IAM POST Change Email Request with Success Status
    And the IAM GET Emails Request with Success Status
    And the User clicks on the Element with Cypress ID "change-email-form-submit-button"
    And the Element with Cypress ID "pendingEmailInput" should exist
    When the IAM POST Verify Confirmation redirects to the Email Confirmation page with Success Status for Email "test@metrics.com"
    Then the Element with Cypress ID "button-login" should exist
    And the Element with Cypress ID "emailInput appended-button" should NOT exist

  Scenario: Should be able to delete user account successfully

    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM User @me request has been intercepted to return the User "003"
    And the User navigates to "/user/profile"
    And the User clicks on the Element with Cypress ID "delete-account-button"
    And the Element with Cypress ID "dialog-delete-account" should exist
    And the User types "User003@email.com" in the Element with Cypress ID "account-delete-email"
    And the User types "DEL" in the Element with Cypress ID "input-account-delete-confirmation-text"
    And the Element with Cypress ID "button-delete-account" should be disabled 
    And the User types "DELETE" in the Element with Cypress ID "input-account-delete-confirmation-text"
    And the Element with Cypress ID "button-delete-account" should be NOT disabled 
    And the IAM DELETE request to delete user account has been intercepted
    And the IAM Logout redirects to "/"
    When the User clicks on the Element with Cypress ID "button-delete-account"
    And the intercepted requests have resolved
    Then the Element with Cypress ID "dialog-delete-account" should NOT exist

  Scenario: Remove User Email

    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM User @me sessions request has been intercepted to return IP's "127.0.0.1"
    And the IAM User @me social accounts request has been intercepted to return "G-user.003@example.com"
    And the IAM GET Emails Request with Success Status
    And the IAM DELETE Email Request with Success Status "123455"
    And the User navigates to "/user/profile"
    And the User clicks on the Element with Cypress ID "toggle-edit-form-button"
    And the User clicks on the Element with Cypress ID "pendingEmailInput appended-button"
    When the User clicks on the Element with Cypress ID "button-confirm-delete-pending-email"
    Then the Element with Cypress ID "pendingEmailInput" should NOT exist
