import {
  selectCategories,
  getNextButton,
  fillAge,
  selectEducationLevel,
  fillFavoriteFood,
  fillFavoriteJob,
  fillSSN,
} from "../page-objects/user-search";

describe("Negative User Search Scenarios", () => {
  beforeEach(() => {
    // This assumes the test page is at the root of the site.
    // Update if the page is on a different path.
    cy.visit("/");
  });

  it("does not enable the Next button when only optional Personal Info fields are filled", () => {
    selectCategories(["Personal Info"]);
    getNextButton().should("be.disabled");

    // Fill only optional fields
    fillAge(30);
    selectEducationLevel("College");

    // The button should remain disabled because required fields are missing.
    getNextButton().should("be.disabled");
  });

  it("does not enable the Next button when only optional General Info fields are filled", () => {
    selectCategories(["General Info"]);
    getNextButton().should("be.disabled");

    // Fill only optional fields
    fillFavoriteFood("Pizza");
    fillFavoriteJob("QA Engineer");

    // The button should remain disabled because required fields are missing.
    getNextButton().should("be.disabled");
  });

  it("does not enable the Next button when a required field is incomplete", () => {
    selectCategories(["ID"]);
    getNextButton().should("be.disabled");

    // Fill SSN with incomplete data
    fillSSN("123-45");

    // The button should remain disabled.
    // This also covers scenarios where the form might have client-side validation
    // that prevents the button from being enabled with invalid data.
    getNextButton().should("be.disabled");
  });
});
