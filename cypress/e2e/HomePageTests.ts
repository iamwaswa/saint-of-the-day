describe(`Home Page Tests`, () => {
  before(() => {
    cy.visit(`/`);
  });

  it(`should be in light mode by default`, () => {
    cy.get(`html`).should(`have.attr`, `class`, `min-h-full`);
  });

  it(`should have a toggle dark mode action`, () => {
    cy.get(`button[role='switch']`).should(`be.visible`);
  });

  it(`should toggle to dark mode when dark mode action is clicked`, () => {
    cy.get(`html`).should(`have.attr`, `class`, `min-h-full`);
    cy.get(`button[role='switch']`).click();
    cy.get(`html`).should(`have.attr`, `class`, `dark min-h-full`);
  });

  it(`should have a title "Saint Of The Day"`, () => {
    cy.title().should(`eq`, `Saint Of The Day`);
  });

  it(`should have a level 1 heading`, () => {
    cy.get(`h1`).should(`be.visible`);
  });

  it(`should have an image with alt text`, () => {
    cy.findByRole(`img`).should(`be.visible`).should(`have.attr`, `alt`);
  });

  it(`should have an introduction`, () => {
    cy.findByTitle(`introduction`).should(`be.visible`);
  });

  it(`should have an external link without tracking with the text "Read More"`, () => {
    cy.findAllByTitle(`Read more`)
      .should(`be.visible`)
      .should(`have.attr`, `target`, `_blank`)
      .should(`have.attr`, `rel`, `noopener noreferrer`)
      .should(`have.text`, `Read More`);
  });
});
