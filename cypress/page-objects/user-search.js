const VALID_CATEGORIES = [
  "ID",
  "Personal Info",
  "General Info",
  "Contact Info",
];

/**
 * Selects multiple categories from the category dropdown.
 * This function is designed to be modular and handle various dropdown behaviors
 * like delayed rendering and spinners, based on "behind the scenes QA knowledge".
 *
 * @param {('ID'|'Personal Info'|'General Info'|'Contact Info')[]} categories - An array of category labels to select.
 */
export const selectCategories = (categories) => {
  if (!Array.isArray(categories) || categories.length === 0) {
    // Proper error handling with a custom message as requested.
    throw new Error(
      "selectCategories expects a non-empty array of category strings."
    );
  }

  const invalidCategories = categories.filter(
    (cat) => !VALID_CATEGORIES.includes(cat)
  );
  if (invalidCategories.length > 0) {
    throw new Error(
      `Invalid categories provided: ${invalidCategories.join(
        ", "
      )}. Valid categories are: ${VALID_CATEGORIES.join(", ")}.`
    );
  }

  // Using placeholder selectors. These should be updated to match the application's DOM.
  const dropdownTrigger = '[data-cy="categories-dropdown"]';
  const dropdownContent = '[data-cy="categories-dropdown-content"]';
  const dropdownOption = '[data-cy="category-option"]';
  const spinner = '[data-cy="spinner"]';

  // 1. Interact with the dropdown like a user would.
  cy.get(dropdownTrigger).click();

  // 2. Dynamically wait for the dropdown content to be ready.
  // This waits for the dropdown to open and for any network calls (via spinner) to complete.
  cy.get("body").then(($body) => {
    if ($body.find(spinner).length > 0) {
      cy.get(spinner, { timeout: 10000 }).should("not.exist");
    }
  });
  cy.get(dropdownContent).should("be.visible");

  // 3. Select each category from the provided array.
  categories.forEach((category) => {
    // Find the option by its text, ensure it's visible, then click.
    // This avoids issues with detached DOM elements during re-renders.
    cy.get(dropdownContent)
      .contains(dropdownOption, category)
      .should("be.visible")
      .click();
  });

  // 4. Close the dropdown to mimic a user finishing their selection.
  // Clicking the body is a common way to close a dropdown.
  cy.get("body").click(0, 0);
};

/**
 * Fills the SSN input field.
 * This function dynamically waits for the SSN field to become visible before typing.
 * No input validation is performed to allow for negative testing.
 *
 * @param {string | number} ssn - The value to enter into the SSN field.
 */
export const fillSSN = (ssn) => {
  // Using a placeholder selector. This should be updated to match the application's DOM.
  const ssnInput = '[data-cy="ssn-input"]';

  // Dynamically wait for the input to be visible, clear it, and then type.
  // This will wait up to 10 seconds for the element to appear and be visible.
  // If an invalid type is passed to .type() (e.g., null), Cypress will throw an error.
  // This is the desired behavior for negative testing, so no validation is added here.
  cy.get(ssnInput, { timeout: 10000 }).should("be.visible").clear().type(ssn);
};
