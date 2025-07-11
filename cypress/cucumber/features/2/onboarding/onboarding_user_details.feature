Feature: Onboarding - User Details

  Scenario: Missing Job Role
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "user_details_without_job_role"
    And the User navigates to "/onboarding"
    And the Element with selector "#next" should be visible
    And the Element with selector "#first_name" should have the value as "User"
    And the Element with selector "#last_name" should have the value as "001"
    And the Select with Cypress ID "select-job-role" should have the value as ""
    When the User clicks on the Element with selector "#next"
    Then the Form Element "select" with Cypress ID "select-job-role" should have a Form Error for validator "required"

  Scenario: Verify that User Attributes in Onboarding Flow are dynamically rendered successfully
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "user_details_with_attribute_types"
    And the User navigates to "/onboarding"
    And the Element with Cypress ID "button-continue" should be visible
    And the Element with Cypress ID "address" should be visible
    And the Element with Cypress ID "enum1" should be visible
    And the Element with Cypress ID "datetime" should be visible
    And the Element with Cypress ID "gender" should be visible

  Scenario: Verify that User Attributes in onboarding flow are validated correctly
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "user_details_with_attribute_types"
    And the User navigates to "/onboarding"
    And the User selects option with Cypress ID "mm-select-option-SALES" in the Select with Cypress ID "select-job-role"
    And the User types "012345678901234567890123456789012345678901234567891" in the Element with Cypress ID "form-user-details-onboarding input-first-name"
    And the User types "012345678901234567890123456789012345678901234567891" in the Element with Cypress ID "form-user-details-onboarding input-last-name"
    When the User clicks on the Element with Cypress ID "button-continue"
    Then the Element with Cypress ID "mm-input-error-maxLength-text" contains the text as "Exceeds max length of 50 characters"
    And the Element with Cypress ID "mm-input-error-required-text" contains the text as "Address is required"
    And the User types "ad" in the Element with Cypress ID "form-user-details-onboarding address"
    And the Element with Cypress ID "form-user-details-onboarding address mm-input-error-minLength-text" contains the text as "Address must be at least 3 characters long"
    And the User types "ddd" in the Element with Cypress ID "form-user-details-onboarding address"
    And the Element with Cypress ID "form-user-details-onboarding address mm-input-error-minLength-textP" should NOT exist
    And the Element with Cypress ID "enum1 mm-select-error-required-text" contains the text as "Enum 1 is required"
    And the Element with Cypress ID "datetime mm-datepicker-error-required-text" contains the text as "Datetime is required"
    And the Element with Cypress ID "gender-input" should have a class "mm-checkbox-fake-checkbox--checked"
    And the User clicks on the Element with Cypress ID "datetime"
    And the Element with Cypress ID "form-user-details-onboarding datetime hours-cy" should exist
    And the Element with Cypress ID "form-user-details-onboarding datetime minutes-cy" should exist

  Scenario:  Verify that Selected Role Persists
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "user_details_with_attribute_types"
    And the User navigates to "/onboarding"
    And the Element with Cypress ID "button-continue" should be visible
    And the Select with Cypress ID "select-job-role" should have the value as ""
    And the User selects option with Cypress ID "mm-select-option-SALES" in the Select with Cypress ID "select-job-role"
    And the Onboarding Update User request has been intercepted to return the User "001WithUpdatedJobRole"
    And the Onboarding Flow request has been intercepted to return the Flow "user_details_with_job_role"
    When the User clicks on the Element with Cypress ID "button-continue"
    Then the Select with Cypress ID "select-job-role" should have the value as "SALES"