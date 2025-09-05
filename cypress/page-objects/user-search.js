/**
 * Selects multiple categories from the category dropdown.
 * This function is designed to be modular and handle various dropdown behaviors
 * like delayed rendering and spinners, based on "behind the scenes QA knowledge".
 *
 * @param {string[]} categories - An array of category labels to select (e.g., ['ID', 'Personal Info']).
 */
export const selectCategories = (categories) => {
  if (!Array.isArray(categories) || categories.length === 0) {
    // Proper error handling with a custom message as requested.
    throw new Error(
      "selectCategories expects a non-empty array of category strings."
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
