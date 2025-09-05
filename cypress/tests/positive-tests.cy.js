import {
  selectCategories,
  fillSSN,
  getNextButton,
} from "../page-objects/user-search";

describe("Positive User Search Scenarios", () => {
  beforeEach(() => {
    // This assumes the test page is at the root of the site.
    // Update if the page is on a different path.
    cy.visit("/");
  });

  it("enables the Next button when required fields for the ID category are filled", () => {
    // Per requirements, the next step is only available when fields are mapped.
    // We first assert the button is disabled.
    getNextButton().should("be.disabled");

    // Select the 'ID' category. This should reveal the SSN input.
    selectCategories(["ID"]);

    // The button should remain disabled because the required SSN field is empty.
    getNextButton().should("be.disabled");

    // Fill the required SSN field.
    fillSSN("000-00-0000");

    // Now that the required field for the 'ID' category is filled,
    // the Next button should become enabled.
    getNextButton().should("be.enabled");
  });
});
