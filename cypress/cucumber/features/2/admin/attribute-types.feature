Feature: Admin - Attribute Types

  Scenario: Forbidden for non MMAdmin
    Given the User "002" is Signed In
    When the User navigates to "/sc/admin/attribute-types"
    Then the Element with selector "#title" should have the text as "404"

  Scenario: Correct data should be shown in table
    Given the User "MMAdmin001" is Signed In
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "all" attribute types
    And the User navigates to "/sc/admin/attribute-types"
    When the Onboarding Attribute Types request has been completed
    Then the Element with Cypress ID "table-attribute-types row-0 name" contains the text as "AttrType ENUM Name"
    And the Element with Cypress ID "table-attribute-types row-0 attribute_of" contains the text as "User"
    And the Element with Cypress ID "table-attribute-types row-0 enabled" contains the text as "Disabled"
    And the Element with Cypress ID "table-attribute-types row-0 restrictions" contains the text as "Option 1, Option 2"
    And the Element with Cypress ID "table-attribute-types row-0 organization_attribute" contains the text as "Yes"
    And the Element with Cypress ID "table-attribute-types row-1 name" contains the text as "AttrTypeName"
    And the Element with Cypress ID "table-attribute-types row-1 attribute_of" contains the text as "Organization"
    And the Element with Cypress ID "table-attribute-types row-1 enabled" contains the text as "Enabled"
    And the Element with Cypress ID "table-attribute-types row-1 restrictions" contains the text as "Min length: 10, Max length: 25"
    And the Element with Cypress ID "table-attribute-types row-2 name" contains the text as "AttrTypeName No restrictions"
    And the Element with Cypress ID "table-attribute-types row-2 attribute_of" contains the text as "User"
    And the Element with Cypress ID "table-attribute-types row-2 enabled" contains the text as "Enabled"
    And the Element with Cypress ID "table-attribute-types row-2 restrictions" contains the text as "-"
    And the Element with Cypress ID "table-attribute-types row-2 organization_attribute" contains the text as "No"

  Scenario: Successfully create attribute type without requirements
    Given the User "MMAdmin001" is Signed In
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "all" attribute types
    And the User navigates to "/sc/admin/attribute-types"
    And the Onboarding Attribute Types request has been completed
    And the User clicks on the Element with Cypress ID "button-create-attribute-type"
    And the User types "AttrTypeName No restrictions 001" in Input inside Element with Cypress ID "dialog-create-attribute-type input-name"
    And the User selects option with Cypress ID "mm-select-option-USER" in the Select with Cypress ID "dialog-create-attribute-type select-attribute-of"
    And the User selects option with Cypress ID "mm-select-option-uuid" in the Select with Cypress ID "dialog-create-attribute-type select-data-type"
    And the User selects option with Cypress ID "mm-select-option-true" in the Select with Cypress ID "dialog-create-attribute-type select-enabled"
    And the User clicks on the Element with Cypress ID "checkbox-organization-specific"
    And the Onboarding create Attribute Type request has been intercepted to create Attribute Type "001"
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "001" attribute types
    And the User clicks on the Element with Cypress ID "dialog-create-attribute-type button-submit"
    And the Onboarding Attribute Type create request has been completed
    When the Onboarding Attribute Types request has been completed
    Then the Element with Cypress ID "table-attribute-types row-0 name" contains the text as "AttrTypeName No restrictions 001"
    And the Element with Cypress ID "table-attribute-types row-0 attribute_of" contains the text as "User"
    And the Element with Cypress ID "table-attribute-types row-0 enabled" contains the text as "Enabled"
    And the Element with Cypress ID "table-attribute-types row-0 restrictions" contains the text as "-"
    And the Element with Cypress ID "table-attribute-types row-0 organization_attribute" contains the text as "Yes"

  Scenario: Successfully create attribute type with min length requirements
    Given the User "MMAdmin001" is Signed In
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "all" attribute types
    And the User navigates to "/sc/admin/attribute-types"
    And the Onboarding Attribute Types request has been completed
    And the User clicks on the Element with Cypress ID "button-create-attribute-type"
    And the User types "AttrTypeName No restrictions 001" in Input inside Element with Cypress ID "dialog-create-attribute-type input-name"
    And the User selects option with Cypress ID "mm-select-option-USER" in the Select with Cypress ID "dialog-create-attribute-type select-attribute-of"
    And the User selects option with Cypress ID "mm-select-option-string" in the Select with Cypress ID "dialog-create-attribute-type select-data-type"
    And the User types "10" in Input inside Element with Cypress ID "input-restrictions-min-length"
    And the User selects option with Cypress ID "mm-select-option-true" in the Select with Cypress ID "dialog-create-attribute-type select-enabled"
    And the Onboarding create Attribute Type request has been intercepted to create Attribute Type "002"
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "002" attribute types
    And the User clicks on the Element with Cypress ID "dialog-create-attribute-type button-submit"
    And the Onboarding Attribute Type create request has been completed
    When the Onboarding Attribute Types request has been completed
    Then the Element with Cypress ID "table-attribute-types row-0 name" contains the text as "AttrTypeName Min length 002"
    And the Element with Cypress ID "table-attribute-types row-0 attribute_of" contains the text as "User"
    And the Element with Cypress ID "table-attribute-types row-0 enabled" contains the text as "Enabled"
    And the Element with Cypress ID "table-attribute-types row-0 restrictions" contains the text as "Min length: 10"

  Scenario: Successfully create attribute type with max length requirements
    Given the User "MMAdmin001" is Signed In
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "all" attribute types
    And the User navigates to "/sc/admin/attribute-types"
    And the Onboarding Attribute Types request has been completed
    And the User clicks on the Element with Cypress ID "button-create-attribute-type"
    And the User types "AttrTypeName Max length 003" in Input inside Element with Cypress ID "dialog-create-attribute-type input-name"
    And the User selects option with Cypress ID "mm-select-option-USER" in the Select with Cypress ID "dialog-create-attribute-type select-attribute-of"
    And the User selects option with Cypress ID "mm-select-option-string" in the Select with Cypress ID "dialog-create-attribute-type select-data-type"
    And the User types "20" in Input inside Element with Cypress ID "input-restrictions-max-length"
    And the User selects option with Cypress ID "mm-select-option-true" in the Select with Cypress ID "dialog-create-attribute-type select-enabled"
    And the Onboarding create Attribute Type request has been intercepted to create Attribute Type "003"
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "003" attribute types
    And the User clicks on the Element with Cypress ID "dialog-create-attribute-type button-submit"
    And the Onboarding Attribute Type create request has been completed
    When the Onboarding Attribute Types request has been completed
    Then the Element with Cypress ID "table-attribute-types row-0 name" contains the text as "AttrTypeName Max length 003"
    And the Element with Cypress ID "table-attribute-types row-0 attribute_of" contains the text as "User"
    And the Element with Cypress ID "table-attribute-types row-0 enabled" contains the text as "Enabled"
    And the Element with Cypress ID "table-attribute-types row-0 restrictions" contains the text as "Max length: 20"

  Scenario: Successfully create attribute type with max length and max length requirements
    Given the User "MMAdmin001" is Signed In
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "all" attribute types
    And the User navigates to "/sc/admin/attribute-types"
    And the Onboarding Attribute Types request has been completed
    And the User clicks on the Element with Cypress ID "button-create-attribute-type"
    And the User types "AttrTypeName Min Length and Max length 004" in Input inside Element with Cypress ID "dialog-create-attribute-type input-name"
    And the User selects option with Cypress ID "mm-select-option-USER" in the Select with Cypress ID "dialog-create-attribute-type select-attribute-of"
    And the User selects option with Cypress ID "mm-select-option-string" in the Select with Cypress ID "dialog-create-attribute-type select-data-type"
    And the User types "10" in Input inside Element with Cypress ID "input-restrictions-min-length"
    And the User types "20" in Input inside Element with Cypress ID "input-restrictions-max-length"
    And the User selects option with Cypress ID "mm-select-option-true" in the Select with Cypress ID "dialog-create-attribute-type select-enabled"
    And the Onboarding create Attribute Type request has been intercepted to create Attribute Type "004"
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "004" attribute types
    And the User clicks on the Element with Cypress ID "dialog-create-attribute-type button-submit"
    And the Onboarding Attribute Type create request has been completed
    When the Onboarding Attribute Types request has been completed
    Then the Element with Cypress ID "table-attribute-types row-0 name" contains the text as "AttrTypeName Min Length and Max length 004"
    And the Element with Cypress ID "table-attribute-types row-0 attribute_of" contains the text as "User"
    And the Element with Cypress ID "table-attribute-types row-0 enabled" contains the text as "Enabled"
    And the Element with Cypress ID "table-attribute-types row-0 restrictions" contains the text as "Min length: 10, Max length: 20"

  Scenario: Successfully create attribute type with options requirements
    Given the User "MMAdmin001" is Signed In
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "all" attribute types
    And the User navigates to "/sc/admin/attribute-types"
    And the Onboarding Attribute Types request has been completed
    And the User clicks on the Element with Cypress ID "button-create-attribute-type"
    And the User types "AttrTypeName Options 005" in Input inside Element with Cypress ID "dialog-create-attribute-type input-name"
    And the User selects option with Cypress ID "mm-select-option-USER" in the Select with Cypress ID "dialog-create-attribute-type select-attribute-of"
    And the User selects option with Cypress ID "mm-select-option-enum" in the Select with Cypress ID "dialog-create-attribute-type select-data-type"
    And the User types "Option 1,Option 2,Option 3" in Tags Input inside Element with Cypress ID "tags-input-restrictions-options"
    And the User selects option with Cypress ID "mm-select-option-true" in the Select with Cypress ID "dialog-create-attribute-type select-enabled"
    And the Onboarding create Attribute Type request has been intercepted to create Attribute Type "005"
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "005" attribute types
    And the User clicks on the Element with Cypress ID "dialog-create-attribute-type button-submit"
    And the Onboarding Attribute Type create request has been completed
    When the Onboarding Attribute Types request has been completed
    Then the Element with Cypress ID "table-attribute-types row-0 name" contains the text as "AttrTypeName Options 005"
    And the Element with Cypress ID "table-attribute-types row-0 attribute_of" contains the text as "User"
    And the Element with Cypress ID "table-attribute-types row-0 enabled" contains the text as "Enabled"
    And the Element with Cypress ID "table-attribute-types row-0 restrictions" contains the text as "Option 1, Option 2, Option 3"

  Scenario: Successfully update attribute type
    Given the User "MMAdmin001" is Signed In
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "001" attribute types
    And the User navigates to "/sc/admin/attribute-types"
    And the Onboarding Attribute Types request has been completed
    And the User clicks on the Element with Cypress ID "actions-button-560b00da-89d4-4653-8079-aed361eab3c3"
    And the User clicks on the Element with Cypress ID "dropdown-560b00da-89d4-4653-8079-aed361eab3c3-item-edit"
    And the User types "AttrTypeName No restrictions 001-Updated" in Input inside Element with Cypress ID "dialog-update-attribute-type input-name"
    And the User selects option with Cypress ID "mm-select-option-false" in the Select with Cypress ID "dialog-update-attribute-type select-enabled"
    And the Onboarding update Attribute Type request has been intercepted to update Attribute Type "560b00da-89d4-4653-8079-aed361eab3c3" and return updated Attribute Type "001-Updated"
    And the User clicks on the Element with Cypress ID "checkbox-organization-specific"
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "001-Updated" attribute types
    And the User clicks on the Element with Cypress ID "dialog-update-attribute-type button-submit"
    And the Onboarding Attribute Types request has been completed
    When the Onboarding Attribute Type update request has been completed
    Then the Element with Cypress ID "table-attribute-types row-0 name" contains the text as "AttrTypeName No restrictions 001-Updated"
    And the Element with Cypress ID "table-attribute-types row-0 enabled" contains the text as "Disabled"
    And the Element with Cypress ID "table-attribute-types row-0 organization_attribute" contains the text as "No"

  Scenario: Successfully delete attribute type
    Given the User "MMAdmin001" is Signed In
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "001" attribute types
    And the User navigates to "/sc/admin/attribute-types"
    And the Onboarding Attribute Types request has been completed
    And the User clicks on the Element with Cypress ID "actions-button-560b00da-89d4-4653-8079-aed361eab3c3"
    And the User clicks on the Element with Cypress ID "dropdown-560b00da-89d4-4653-8079-aed361eab3c3-item-delete"
    And the Onboarding delete Attribute Type request has been intercepted to delete Attribute Type "560b00da-89d4-4653-8079-aed361eab3c3"
    And the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return "001-Deleted" attribute types
    And the User clicks on the Element with Cypress ID "dialog-delete-attribute-type button-submit"
    And the Onboarding Attribute Type delete request has been completed
    When the Onboarding Attribute Types request has been completed
    Then the Element with Cypress ID "table-attribute-types row-0" should NOT exist
