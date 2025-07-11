Feature: Organization Users - Import Users

  Scenario: Should update data in table after successful import
    Given the User "003" is Signed In
    And the feature flag "import_organization_users" is enabled
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the User navigates to "sc/users"
    And the User clicks on the Element with Cypress ID "button-import-organization-users"
    And the User clicks on the Element with Cypress ID "button-click-to-upload"
    And the User selects file "users_import.csv" inside DragNDrop with Cypress ID "drag-n-drop-zone" via Click
    And the IAM Organization Users Imports has been intercepted to return Accepted for import "001" for Organization "001"
    And the IAM Organization Users Imports has been intercepted to return status for import "001-S" for Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,003" from Organization "001" with query params "sort=first_name:asc"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,003" from Organization "001" with query params "status=P"
    When the User clicks on the Element with Cypress ID "dialog-import-organization-users button-submit"
    And the intercepted requests have resolved
    Then the Element with Cypress ID "organization-users-table row-0 email" contains the text as "User001@email.com"
    And the intercepted requests have resolved
    And the Element with Cypress ID "organization-users-table row-0 created_date" should have the formatted date as "8 Aug 2024, 09:46"
    And the Element with Cypress ID "organization-users-table row-2 created_date" should have the formatted date as "6 May 2024, 12:55"

  Scenario: Show Correct file name and organization users count after file import via Click
    Given the User "003" is Signed In
    And the feature flag "import_organization_users" is enabled
    And the IAM Users request has been intercepted to return the Users "001,006"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the User navigates to "sc/users"
    And the User clicks on the Element with Cypress ID "button-import-organization-users"
    And the User clicks on the Element with Cypress ID "button-click-to-upload"
    When the User selects file "users_import.csv" inside DragNDrop with Cypress ID "drag-n-drop-zone" via Click
    Then the Element with Cypress ID "drag-n-drop-file" contains the text as "users_import.csv"
    And the Element with Cypress ID "about-to-import-organization-users" contains the text as "You are about to import 2 organization users"

  Scenario: Correct deleting uploaded file
    Given the User "003" is Signed In
    And the feature flag "import_organization_users" is enabled
    And the IAM Users request has been intercepted to return the Users "001,006"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the User navigates to "sc/users"
    And the User clicks on the Element with Cypress ID "button-import-organization-users"
    And the User clicks on the Element with Cypress ID "button-click-to-upload"
    And the User selects file "users_import.csv" inside DragNDrop with Cypress ID "drag-n-drop-zone" via Click
    When the User clicks on the Element with Cypress ID "button-delete-uploaded-file"
    Then the Element with Cypress ID "drag-n-drop-file" should NOT exist
    And the Element with Cypress ID "about-to-import-organization-users" should NOT exist

  Scenario: Should handle error 409 File exists
    Given the User "003" is Signed In
    And the feature flag "import_organization_users" is enabled
    And the IAM Users request has been intercepted to return the Users "001,006"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the User navigates to "sc/users"
    And the User clicks on the Element with Cypress ID "button-import-organization-users"
    And the User clicks on the Element with Cypress ID "button-click-to-upload"
    And the User selects file "users_import.csv" inside DragNDrop with Cypress ID "drag-n-drop-zone" via Click
    And the IAM Organization Users Imports has been intercepted to return error 409 for Organization "001"
    When the User clicks on the Element with Cypress ID "dialog-import-organization-users button-submit"
    And the intercepted requests have resolved
    Then the Element with Cypress ID "drag-n-drop-zone" contains the text as "This file has already been uploaded"
    And the Element with Cypress ID "drag-n-drop-zone" should have a class "mm-drag-n-drop--status-error"

  Scenario: Should handle error 400 Wrong format
    Given the User "003" is Signed In
    And the feature flag "import_organization_users" is enabled
    And the IAM Users request has been intercepted to return the Users "001,006"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the User navigates to "sc/users"
    And the User clicks on the Element with Cypress ID "button-import-organization-users"
    And the User clicks on the Element with Cypress ID "button-click-to-upload"
    And the User selects file "users_import.csv" inside DragNDrop with Cypress ID "drag-n-drop-zone" via Click
    And the IAM Organization Users Imports has been intercepted to return error 400 for Organization "001"
    When the User clicks on the Element with Cypress ID "dialog-import-organization-users button-submit"
    And the intercepted requests have resolved
    Then the Element with Cypress ID "drag-n-drop-zone" contains the text as "The formatting of the file looks different than the sample template."
    And the Element with Cypress ID "drag-n-drop-zone" should have a class "mm-drag-n-drop--status-error"

  Scenario: Should show loading state while importing organization users
    Given the User "003" is Signed In
    And the feature flag "import_organization_users" is enabled
    And the IAM Users request has been intercepted to return the Users "001,006"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the User navigates to "sc/users"
    And the User clicks on the Element with Cypress ID "button-import-organization-users"
    And the User clicks on the Element with Cypress ID "button-click-to-upload"
    And the User selects file "users_import.csv" inside DragNDrop with Cypress ID "drag-n-drop-zone" via Click
    And the IAM Organization Users Imports has been intercepted to return Accepted for import "001" for Organization "001"
    And the IAM Organization Users Imports has been intercepted to return status for import "001-P" for Organization "001"
    When the User clicks on the Element with Cypress ID "dialog-import-organization-users button-submit"
    And the intercepted requests have resolved
    Then the Element with Cypress ID "dialog-import-organization-users dialog-title" contains the text as "users_import.csv"
    And the Element with Cypress ID "dialog-import-organization-users dialog-subtitle" contains the text as "Import is in progress... Depending on the number of Organization Users, might take a couple of minutes. You can safely close this dialog and continue working in the Veriam portal, your import will continue to run on the background. When the import is completed, you will find the organization users on this page"

  Scenario: Should show success state after importing organization users
    Given the User "003" is Signed In
    And the feature flag "import_organization_users" is enabled
    And the IAM Users request has been intercepted to return the Users "001,006"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the User navigates to "sc/users"
    And the User clicks on the Element with Cypress ID "button-import-organization-users"
    And the User clicks on the Element with Cypress ID "button-click-to-upload"
    And the User selects file "users_import.csv" inside DragNDrop with Cypress ID "drag-n-drop-zone" via Click
    And the IAM Organization Users Imports has been intercepted to return Accepted for import "001" for Organization "001"
    And the IAM Organization Users Imports has been intercepted to return status for import "001-S" for Organization "001"
    When the User clicks on the Element with Cypress ID "dialog-import-organization-users button-submit"
    And the intercepted requests have resolved
    Then the Element with Cypress ID "dialog-import-organization-users dialog-title" contains the text as "Import Successful"

  Scenario: Should show failure state after importing organization import
    Given the User "003" is Signed In
    And the feature flag "import_organization_users" is enabled
    And the IAM Users request has been intercepted to return the Users "001,006"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the User navigates to "sc/users"
    And the User clicks on the Element with Cypress ID "button-import-organization-users"
    And the User clicks on the Element with Cypress ID "button-click-to-upload"
    And the User selects file "users_import.csv" inside DragNDrop with Cypress ID "drag-n-drop-zone" via Click
    And the IAM Organization Users Imports has been intercepted to return Accepted for import "001" for Organization "001"
    And the IAM Organization Users Imports has been intercepted to return status for import "001-F" for Organization "001"
    When the User clicks on the Element with Cypress ID "dialog-import-organization-users button-submit"
    And the intercepted requests have resolved
    Then the Element with Cypress ID "dialog-import-organization-users alert" contains the text as "Something went wrong while importing file"

  
