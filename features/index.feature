Feature: src index.html testing

  Scenario: Loading src\index.html work
    When I open src index
    Then I should see "Tool to create fragmented paper backup of your bip39 mnemonic phrase."


    
  Scenario: Loading index.html work
    When I open index
    Then I should see "Tool to create fragmented paper backup of your bip39 mnemonic phrase."