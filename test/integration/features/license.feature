Feature: license

  Scenario: unlicensed
    Given the project should not be licensed
    When the generator is run
    Then the package is marked private
