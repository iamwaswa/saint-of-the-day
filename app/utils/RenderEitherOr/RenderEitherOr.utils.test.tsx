import { RenderEitherOr } from "./RenderEitherOr.utils";
import { render, screen } from "@testing-library/react";

describe(`RenderEitherOr`, () => {
  it(`correctly renders the either case`, () => {
    const textContent = `true`;

    render(
      <RenderEitherOr ifTrue={true} thenRender={<div>{textContent}</div>} />
    );

    expect(screen.getByText(textContent)).toBeInstanceOf(HTMLDivElement);
  });

  it(`correctly renders the or case`, () => {
    const trueTextContent = `true`;
    const falseTextContent = `false`;

    render(
      <RenderEitherOr
        ifTrue={false}
        thenRender={<div>{trueTextContent}</div>}
        otherwiseRender={<div>{falseTextContent}</div>}
      />
    );

    expect(screen.getByText(falseTextContent)).toBeInstanceOf(HTMLDivElement);
  });
});
