const VALID_CATEGORIES = [
  "ID",
  "Personal Info",
  "General Info",
  "Contact Info",
];
const VALID_EDUCATION_LEVELS = ["High School", "College", "Advanced Degree"];

// Using placeholder selectors. These should be updated to match the application's DOM.
const dropdownTrigger = '[data-cy="categories-dropdown"]';
const dropdownContent = '[data-cy="categories-dropdown-content"]';
const dropdownOption = '[data-cy="category-option"]';
const spinner = '[data-cy="spinner"]';
const ssnInput = '[data-cy="ssn-input"]';
const firstNameInput = '[data-cy="first-name-input"]';
const lastNameInput = '[data-cy="last-name-input"]';
const addressInput = '[data-cy="address-input"]';
const ageInput = '[data-cy="age-input"]';
const jobInput = '[data-cy="job-input"]';
const favoriteFoodInput = '[data-cy="favorite-food-input"]';
const favoriteBookInput = '[data-cy="favorite-book-input"]';
const phoneInput = '[data-cy="phone-input"]';
const emailInput = '[data-cy="email-input"]';
const educationLevelDropdown = '[data-cy="education-level-dropdown"]';
const educationLevelDropdownContent = '[data-cy="education-level-dropdown-content"]';
const educationLevelOption = '[data-cy="education-level-option"]';
const nextButton = '[data-cy="next-button"]';
const selectedCategoryBadge = '[data-cy="selected-category-badge"]';

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

  // Intercept network calls to handle dynamic content and avoid flakiness.
  // Using placeholder endpoints. These should be updated to match the application's API.
  cy.intercept("GET", "**/api/categories/options").as("getCategoryOptions");

  // 1. Interact with the dropdown like a user would.
  cy.get(dropdownTrigger).click();

  // 2. Wait for the dropdown options to load.
  cy.wait("@getCategoryOptions");
  cy.get(dropdownContent).should("be.visible");

  // 3. Select each category from the provided array.
  categories.forEach((category) => {
    // Intercept the call that updates the form fields after a selection.
    cy.intercept("POST", "**/api/fields").as("updateFields");

    // Find the option by its text, ensure it's visible, then click.
    // This avoids issues with detached DOM elements during re-renders.
    cy.get(dropdownContent)
      .contains(dropdownOption, category)
      .should("be.visible")
      .click();

    // Wait for the fields to be updated before proceeding.
    cy.wait("@updateFields");
  });

  // 4. Close the dropdown to mimic a user finishing their selection.
  // Clicking the body is a common way to close a dropdown.
  cy.get("body").click(0, 0);
};

/**
 * Deselects multiple categories from the category dropdown.
 * This function is designed to be modular and handle various dropdown behaviors.
 * It will throw an error if attempting to deselect a category that is not currently selected.
 *
 * @param {('ID'|'Personal Info'|'General Info'|'Contact Info')[]} categories - An array of category labels to deselect.
 */
export const deselectCategories = (categories) => {
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error(
      "deselectCategories expects a non-empty array of category strings."
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

  // Verify categories are selected before attempting to deselect.
  categories.forEach((category) => {
    cy.get("body").then(($body) => {
      if (
        $body.find(`${selectedCategoryBadge}:contains("${category}")`).length ===
        0
      ) {
        throw new Error(
          `Category "${category}" is not selected and cannot be deselected.`
        );
      }
    });
  });

  // Intercept network calls to handle dynamic content and avoid flakiness.
  // Using placeholder endpoints. These should be updated to match the application's API.
  cy.intercept("GET", "**/api/categories/options").as("getCategoryOptions");

  // 1. Interact with the dropdown like a user would.
  cy.get(dropdownTrigger).click();

  // 2. Wait for the dropdown options to load.
  cy.wait("@getCategoryOptions");
  cy.get(dropdownContent).should("be.visible");

  // 3. Deselect each category from the provided array.
  categories.forEach((category) => {
    // Intercept the call that updates the form fields after a deselection.
    cy.intercept("POST", "**/api/fields").as("updateFields");

    cy.get(dropdownContent)
      .contains(dropdownOption, category)
      .should("be.visible")
      .click();

    // Wait for the fields to be updated before proceeding.
    cy.wait("@updateFields");
  });

  // 4. Close the dropdown to mimic a user finishing their selection.
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
  // Dynamically wait for the input to be visible, clear it, and then type.
  // This will wait up to 10 seconds for the element to appear and be visible.
  // If an invalid type is passed to .type() (e.g., null), Cypress will throw an error.
  cy.get(ssnInput, { timeout: 10000 }).should("be.visible").clear().type(ssn);
};

/**
 * Fills the First Name input field.
 * @param {string | number} firstName - The value to enter.
 */
export const fillFirstName = (firstName) => {
  cy.get(firstNameInput, { timeout: 10000 })
    .should("be.visible")
    .clear()
    .type(firstName);
};

/**
 * Fills the Last Name input field.
 * @param {string | number} lastName - The value to enter.
 */
export const fillLastName = (lastName) => {
  cy.get(lastNameInput, { timeout: 10000 })
    .should("be.visible")
    .clear()
    .type(lastName);
};

/**
 * Fills the Address input field.
 * @param {string | number} address - The value to enter.
 */
export const fillAddress = (address) => {
  cy.get(addressInput, { timeout: 10000 })
    .should("be.visible")
    .clear()
    .type(address);
};

/**
 * Fills the Age input field.
 * @param {string | number} age - The value to enter.
 */
export const fillAge = (age) => {
  cy.get(ageInput, { timeout: 10000 }).should("be.visible").clear().type(age);
};

/**
 * Fills the Job input field.
 * @param {string | number} job - The value to enter.
 */
export const fillJob = (job) => {
  cy.get(jobInput, { timeout: 10000 }).should("be.visible").clear().type(job);
};

/**
 * Fills the Favorite Food input field.
 * @param {string | number} food - The value to enter.
 */
export const fillFavoriteFood = (food) => {
  cy.get(favoriteFoodInput, { timeout: 10000 })
    .should("be.visible")
    .clear()
    .type(food);
};

/**
 * Fills the Favorite Book input field.
 * @param {string | number} book - The value to enter.
 */
export const fillFavoriteBook = (book) => {
  cy.get(favoriteBookInput, { timeout: 10000 })
    .should("be.visible")
    .clear()
    .type(book);
};

/**
 * Fills the Phone input field.
 * @param {string | number} phone - The value to enter.
 */
export const fillPhone = (phone) => {
  cy.get(phoneInput, { timeout: 10000 })
    .should("be.visible")
    .clear()
    .type(phone);
};

/**
 * Fills the Email input field.
 * @param {string | number} email - The value to enter.
 */
export const fillEmail = (email) => {
  cy.get(emailInput, { timeout: 10000 })
    .should("be.visible")
    .clear()
    .type(email);
};

/**
 * Selects an education level from the dropdown.
 * @param {('High School'|'College'|'Advanced Degree')} level - The education level to select.
 */
export const selectEducationLevel = (level) => {
  if (!VALID_EDUCATION_LEVELS.includes(level)) {
    throw new Error(
      `Invalid education level: ${level}. Valid options are: ${VALID_EDUCATION_LEVELS.join(
        ", "
      )}.`
    );
  }

  cy.get(educationLevelDropdown).click();
  cy.get(educationLevelDropdownContent)
    .contains(educationLevelOption, level)
    .should("be.visible")
    .click();
};

/**
 * Gets the Next button element.
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export const getNextButton = () => {
  return cy.get(nextButton);
};

/**
 * Gets the SSN input element.
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export const getSsnInput = () => {
  return cy.get(ssnInput);
};

/**
 * Gets the First Name input element.
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export const getFirstNameInput = () => {
  return cy.get(firstNameInput);
};

/**
 * Gets the Last Name input element.
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export const getLastNameInput = () => {
  return cy.get(lastNameInput);
};

/**
 * Gets the Address input element.
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export const getAddressInput = () => {
  return cy.get(addressInput);
};

/**
 * Gets the Age input element.
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export const getAgeInput = () => {
  return cy.get(ageInput);
};

/**
 * Gets the Job input element.
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export const getJobInput = () => {
  return cy.get(jobInput);
};

/**
 * Gets the Favorite Food input element.
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export const getFavoriteFoodInput = () => {
  return cy.get(favoriteFoodInput);
};

/**
 * Gets the Favorite Book input element.
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export const getFavoriteBookInput = () => {
  return cy.get(favoriteBookInput);
};

/**
 * Gets the Education Level dropdown element.
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export const getEducationLevelDropdown = () => {
  return cy.get(educationLevelDropdown);
};
