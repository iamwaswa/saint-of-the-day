type Falsy = undefined | null | false | 0 | -0 | 0n | "";

interface IRenderEitherOrProps<Condition> {
  ifTrue: Condition | Falsy;
  thenRender: JSX.Element | ((condition: Condition) => JSX.Element);
  otherwiseRender?: JSX.Element | (() => JSX.Element);
}

/**
 * Renders one of two options
 * if the condition is true otherwise renders the other option
 */
export function RenderEitherOr<Condition>({
  ifTrue,
  thenRender,
  otherwiseRender = <></>,
}: IRenderEitherOrProps<Condition>): JSX.Element {
  if (ifTrue) {
    return typeof thenRender === `function` ? thenRender(ifTrue) : thenRender;
  }

  return typeof otherwiseRender === `function`
    ? otherwiseRender()
    : otherwiseRender;
}
