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
    getNextButton().should("be.disabled");
    selectCategories(["ID"]);
    getNextButton().should("be.disabled");
    fillSSN("000-00-0000");
    getNextButton().should("be.enabled");
  });
});
