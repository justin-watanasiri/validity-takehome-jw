import {
  selectCategories,
  fillSSN,
  getNextButton,
  fillFirstName,
  fillLastName,
  fillAddress,
  fillJob,
  fillPhone,
  fillEmail,
} from "../page-objects/user-search";

describe("Positive User Search Scenarios", () => {
  beforeEach(() => {
    // This assumes the test page is at the root of the site.
    // Update if the page is on a different path.
    cy.visit("/");
  });

    /**
     * selectCategories and the various fill functions contain dynamic waits before interacting with elements. 
     * This allows for clean looking tests and no hard-coded waits 
     * This also follows modular design principles by allowing sections of code to be reused in other tests.
     */


  it("enables the Next button when required fields for the ID category are filled", () => {
    selectCategories(["ID"]);
    getNextButton().should("be.disabled");
    fillSSN("000-00-0000");
    getNextButton().should("be.enabled");
  });

  it("enables the Next button when required fields for Personal Info are filled", () => {
    selectCategories(["Personal Info"]);
    getNextButton().should("be.disabled");
    fillFirstName("John");
    getNextButton().should("be.disabled");
    fillLastName("Doe");
    getNextButton().should("be.disabled");
    fillAddress("123 Main St");
    getNextButton().should("be.enabled");
  });

  it("enables the Next button when required fields for General Info are filled", () => {
    selectCategories(["General Info"]);
    getNextButton().should("be.disabled");
    fillFirstName("Jane");
    getNextButton().should("be.disabled");
    fillLastName("Smith");
    getNextButton().should("be.disabled");
    fillJob("Engineer");
    getNextButton().should("be.enabled");
  });

  it("enables the Next button when Phone is filled for Contact Info", () => {
    selectCategories(["Contact Info"]);
    getNextButton().should("be.disabled");
    fillPhone("555-555-5555");
    getNextButton().should("be.enabled");
  });

  it("enables the Next button when Email is filled for Contact Info", () => {
    selectCategories(["Contact Info"]);
    getNextButton().should("be.disabled");
    fillEmail("test@example.com");
    getNextButton().should("be.enabled");
  });
});
