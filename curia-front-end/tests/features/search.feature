Feature: Search

  Scenario: Search sorted by maker
    Given maker is selected for sort order
    When the results are displayed
    Then the results are ordered by maker
