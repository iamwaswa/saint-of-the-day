describe(`Home Page Tests`, () => {
  beforeEach(() => {
    cy.visit(`/`);
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
    cy.findByRole(`link`)
      .should(`be.visible`)
      .should(`have.attr`, `target`, `_blank`)
      .should(`have.attr`, `rel`, `noopener noreferrer`)
      .should(`have.text`, `Read More`);
  });
});
