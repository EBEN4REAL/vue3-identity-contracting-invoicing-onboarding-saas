Feature: Auth - Login Resize Window to Mobile View

  Scenario: Resize the browser window to simulate mobile and check that icons resized
  
    Given the IAM OAuth Authorize redirects to the Login page with sp "001"
    And the User navigates to "/"
    Then the User should be redirected to "/login"
    Then the browser window is resized to "390"
    Then the SVG with Cypress ID "right-square-element" should have a height of "70px" and a width of "70px"