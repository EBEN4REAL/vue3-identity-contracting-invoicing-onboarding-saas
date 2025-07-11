Feature: Responsive Layout

  Scenario: Mobile navigation and profile dropdown on tablet screens
    Given the User "005" is Signed In
    And the User is using an "ipad-2" device
    And the User navigates to "/"
    When the User clicks on the Element with Cypress ID "mobile-nav-link"
    Then the Element with Cypress ID "mm-app-navigation" should be visible
    And the Element with Cypress ID "close-mobile-nav" should be visible
    And the User clicks on the Element with Cypress ID "close-mobile-nav"
    And the Element with Cypress ID "mm-app-navigation" should NOT be visible
    When the User clicks on the Element with Cypress ID "profile-actions-dropdown"
    Then the Element with Cypress ID "profile-actions-dropdown-item-view-profile" should be visible
    And the Element with Cypress ID "profile-actions-dropdown-item-logout" should be visible

  Scenario: Mobile navigation and profile dropdown on mobile screens
    Given the User "005" is Signed In
    And the User is using an "iphone-x" device
    And the User navigates to "/"
    When the User clicks on the Element with Cypress ID "mobile-nav-link"
    Then the Element with Cypress ID "mm-app-navigation" should be visible
    And the Element with Cypress ID "close-mobile-nav" should be visible
    And the User clicks on the Element with Cypress ID "close-mobile-nav"
    And the Element with Cypress ID "mm-app-navigation" should NOT be visible
    When the User clicks on the Element with Cypress ID "profile-actions-dropdown"
    Then the Element with Cypress ID "profile-actions-dropdown-item-view-profile" should be visible
    And the Element with Cypress ID "profile-actions-dropdown-item-logout" should be visible
