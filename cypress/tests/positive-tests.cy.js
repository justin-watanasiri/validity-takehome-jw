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
  deselectCategories,
  getFirstNameInput,
  getLastNameInput,
  getAddressInput,
  getAgeInput,
  getEducationLevelDropdown,
  getJobInput,
  getFavoriteFoodInput,
  getFavoriteJobInput,
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

  it("retains shared fields when a category with overlapping fields is deselected", () => {
    // Select two categories that share fields (First Name, Last Name)
    selectCategories(["Personal Info", "General Info"]);

    // Verify all fields from both categories are visible.
    // Note: 'Favorite Book' from requirements is represented by 'Favorite Job' in the current implementation.
    getFirstNameInput().should("be.visible");
    getLastNameInput().should("be.visible");
    getAddressInput().should("be.visible");
    getEducationLevelDropdown().should("be.visible");
    getAgeInput().should("be.visible");
    getJobInput().should("be.visible");
    getFavoriteFoodInput().should("be.visible");
    getFavoriteJobInput().should("be.visible");

    // Deselect one category
    deselectCategories(["General Info"]);

    // Assert that fields from the remaining category ('Personal Info') are still visible
    getFirstNameInput().should("be.visible");
    getLastNameInput().should("be.visible");
    getAddressInput().should("be.visible");
    getEducationLevelDropdown().should("be.visible");
    getAgeInput().should("be.visible");
  });
});
