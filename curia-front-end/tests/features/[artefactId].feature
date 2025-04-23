Feature: Stack navigation

  Scenario: Back button for deeplinks
    Given the user uses a deep link
    Then the stack back button is in the stack bar
    When the user clicks the back button
    Then the page navigates to root
