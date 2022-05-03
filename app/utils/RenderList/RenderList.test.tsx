import { RenderList } from "./RenderList.utils.test";
import { render, screen } from "@testing-library/react";

describe(`RenderList`, () => {
  it(`correctly renders a list of items`, () => {
    const numberOfItems = 10;
    const items = Array(numberOfItems)
      .fill(null)
      .map((_: null, index: number) => index);

    render(
      <RenderList
        items={items}
        renderItem={(item) => <div key={item}>{item}</div>}
      />
    );

    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInstanceOf(HTMLDivElement);
    });
  });

  it(`correctly renders no content`, () => {
    const noContentText = `No Content`;

    render(
      <RenderList
        items={[]}
        renderItem={(item) => <div key={item}>{item}</div>}
        renderNoContent={<div>{noContentText}</div>}
      />
    );

    expect(screen.getByText(noContentText)).toBeInstanceOf(HTMLDivElement);
  });
});
