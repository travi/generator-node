Feature: Files

Scenario: manual prompt answers
  Given the user responds to all prompts
  When the generator is run
  Then the git generator was extended
  And the core files should be present
  And the required dependencies were installed
  And the user provided answers should be used

#Scenario: default prompt answers
#  Given the user leaves defaults in all prompts
#  When the generator is run
#  Then the core files should be present
#  And the default answers should be used
