Feature: Onboarding - Create Organization

  Scenario: Verify that Organization Attributes in onboarding flow are rendered and validated correctly
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "create_organization_with_attributes"
    And the User navigates to "/onboarding"
    And the intercepted requests have resolved
    And the User selects option with Cypress ID "mm-select-option-ESG" in the Select with Cypress ID "select-organization-industry"
    And the User selects option with Cypress ID "mm-select-option-51-200" in the Select with Cypress ID "select-organization-number-of-employees-range"
    When the User clicks on the Element with Cypress ID "button-continue"
    Then the Element with Cypress ID "mm-input-error-required-text" contains the text as "Address is required"
    And the User types "ad" in the Element with Cypress ID "form-onboarding-organization-details address"
    And the Element with Cypress ID "address mm-input-error-minLength-text" contains the text as "Address must be at least 3 characters long"
    And the User types "ddd" in the Element with Cypress ID "form-onboarding-organization-details address"
    And the Element with Cypress ID "form-onboarding-organization-details address mm-input-error-minLength-textP" should NOT exist
    And the Element with Cypress ID "enum1 mm-select-error-required-text" contains the text as "Enum 1 is required"
    And the Element with Cypress ID "datetime mm-datepicker-error-required-text" contains the text as "Datetime is required"
    And the Element with Cypress ID "gender-input" should have a class "mm-checkbox-fake-checkbox--checked"
    And the User clicks on the Element with Cypress ID "datetime"
    And the Element with Cypress ID "form-onboarding-organization-details datetime hours-cy" should exist
    And the Element with Cypress ID "form-onboarding-organization-details datetime minutes-cy" should exist

  Scenario: Missing Values

    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "create_organization"
    And the User navigates to "/onboarding"
    And the Element with selector "#next" should be visible
    And the Element with selector "#name" should have the value as ""
    And the Element with Cypress ID "select-organization-industry" should have the value as ""
    And the Element with Cypress ID "select-organization-number-of-employees-range" should have the value as ""
    When the User clicks on the Element with selector "#next"
    Then the Form Element "input" with Cypress ID "input-organization-name" should have a Form Error for validator "required"

  Scenario: Name is too Long

    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "create_organization"
    And the User navigates to "/onboarding"
    And the Element with selector "#next" should be visible
    And the Element with selector "#name" should have the value as ""
    And the Element with Cypress ID "select-organization-industry" should have the value as ""
    And the Element with Cypress ID "select-organization-number-of-employees-range" should have the value as ""
    And the User types "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567" in the Element with selector "#name"
    When the User clicks on the Element with selector "#next"
    Then the Form Element "input" with Cypress ID "input-organization-name" should have a Form Error for validator "maxLength"

  Scenario: Not finished onboarding - Edit organization
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "create_organization_before_update"
    And the Onboarding Update Organization request has been intercepted to return the Organization "001Updated"
    When the User navigates to "/onboarding"
    And the User selects option with Cypress ID "mm-select-option-ESG" in the Select with Cypress ID "select-organization-industry"
    And the User selects option with Cypress ID "mm-select-option-51-200" in the Select with Cypress ID "select-organization-number-of-employees-range"
    And the User clicks on the Element with selector "#next"
    And the Onboarding Flow request has been intercepted to return the Flow "create_organization_after_update"
    And the User navigates to "/onboarding"
    Then the Select with Cypress ID "select-organization-industry" should have the value as "ESG"
    And the Select with Cypress ID "select-organization-number-of-employees-range" should have the value as "51-200"
