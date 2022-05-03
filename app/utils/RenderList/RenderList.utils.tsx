import { Component } from "react";
import type { ReactNode } from "react";

interface IRenderListProps<DataType> {
  items: Array<DataType>;
  renderNoContent?: ReactNode | (() => ReactNode);
  renderItem(item: DataType, index: number, items: Array<DataType>): ReactNode;
}

/**
 * Renders a list of items
 */
export class RenderList<DataType> extends Component<
  IRenderListProps<DataType>
> {
  private renderListItem = (
    item: DataType,
    index: number,
    array: Array<DataType>
  ): ReactNode => {
    return this.props.renderItem(item, index, array);
  };

  render(): ReactNode {
    const { items, renderNoContent = <></> } = this.props;

    if (items.length === 0) {
      return typeof renderNoContent === `function`
        ? renderNoContent()
        : renderNoContent;
    }

    return items.map(this.renderListItem);
  }
}
