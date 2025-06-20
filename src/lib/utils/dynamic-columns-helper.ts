import _ from "lodash";

const getTextWidth = (
    text: any,
    isValue = false,
    font = "12px -apple-system"
) => {
    const canvas = document.createElement("canvas");
    const context: any = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);

    return Math.round(metrics.width) + (isValue ? 0 : 80);
};

export const calculateColumnsWidth = (
    columns: any,
    source: any,
    maxWidthPerCell = 300
) => {
    const columnsWithWidth = columns.map((column: any) => {
        if (column.children) {
            column.children.map((child: any) =>
                Object.assign(child, {
                    width: child.width
                        ? child.width
                        : getTextWidth(child.title),
                })
            );
        }

        return Object.assign(column, {
            width: column.width ? column.width : getTextWidth(column.title),
        });
    });
    source &&
        source.length > 0 &&
        source?.map((entry: any) => {
            columnsWithWidth.map((column: any, indexColumn: number) => {
                const columnWidth = column.width;
                const cellValue = entry[column.dataIndex];

                let cellWidth = getTextWidth(cellValue, true);

                if (cellWidth < columnWidth) cellWidth = columnWidth;

                if (cellWidth > maxWidthPerCell) cellWidth = maxWidthPerCell;
                columnsWithWidth[indexColumn].width = cellWidth;
            });
        });
    const tableWidth = !_.isEmpty(columnsWithWidth)
        ? columnsWithWidth
              .map((column: any) => column.width)
              .reduce((a: any, b: any) => {
                  return a + b;
              })
        : 0;

    return {
        columns: columnsWithWidth,
        source,
        tableWidth,
    };
};
