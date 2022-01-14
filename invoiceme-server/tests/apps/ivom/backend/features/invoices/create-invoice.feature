Feature: Create a new inovice
  In order to have invoices in the platform
  As a user with admin permissions
  I want to create a new invoice

  Scenario: A valid non existing invoice
    Given I send a PUT request to "/invoices/ef8ac118-8d7f-49cc-abec-78e0d05af80a" with body:
    """
    {
      "id": "ef8ac118-8d7f-49cc-abec-78e0d05af80a",
      "companyId": "ef8ac118-8d7f-49cc-abec-78e0d05af80a",
      "invoiceNumber": "INV-3456"
    }
    """
    Then the response status code should be 201
    And the response should be empty
