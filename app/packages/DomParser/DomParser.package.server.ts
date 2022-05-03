import DomParser from "dom-parser";

export function parseDOMFromHtmlString(html: string): DomParser.Dom {
  const parser = new DomParser();
  return parser.parseFromString(html);
}
