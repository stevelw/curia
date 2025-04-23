Feature: TanStack dev tools

  Scenario: Dev tools hidden in production
    Given the environment is production
    When the page is displayed
    Then the dev tools should not be visible
