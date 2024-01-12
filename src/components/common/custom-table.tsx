import { useRef, useContext, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import ScrollContainer from "react-indiana-drag-scroll";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PrintIcon from "@mui/icons-material/Print";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

import { getCurrentDate } from "lib/utils/helpers";
import EmptyAlert from "./empty-alert";
import DeleteButton from "components/common/delete-button";
import { ModalContext } from "lib/context/modal";
import { useAppState } from "lib/context/app";
import { DataUsageTwoTone } from "@mui/icons-material";
import { calculateColumnsWidth } from "lib/utils/dynamic-columns-helper";

const CustomTable = ({
    columns,
    data,
    error,
    api,
    hasNew,
    hasUpdate,
    hasDelete,
    hasPrint = true,
    hasExcel = true,
    hasShow = true,
    id,
    listUrl,
    modalTitle,
    modalContent,
    excelName,
    search,
    pagination = true,
    datagrid = true,
}: any) => {
    const [state, dispatch]: any = useAppState();
    const [height, setHeight] = useState<any>(null);
    // const [excelColumns, setExcelColumns]: any = useState(null);
    const { handleModal }: any = useContext(ModalContext);
    const componentRef: any = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHeight(window.innerHeight - 240);
    }, [window.innerHeight]);

    const tempcolumns: any = columns
        .map((obj: any) => ({
            ...obj,
        }))
        .map((column: any, index: any) => {
            if (column.title) {
                column.headerName = column.title;
            }
            if (column.key) {
                column.field = column.key;
            }
            return column;
        });

    // const customizedColumns: any = [].concat(columns);

    // const customizedColumns: any = [columns];

    // customizedColumns.push({
    //     headerName: "Үйлдэл",
    //     field: "actionButtons",
    //     dataIndex: "actionButtons",
    //     width: 300,
    //     __ignore__: true,
    //     className: "hide-print",
    //     renderCell: (index: any) => {
    //         return (
    //             <Stack direction="row" spacing={1}>
    //                 {hasUpdate && (
    //                     <Button
    //                         size="small"
    //                         variant="outlined"
    //                         color="primary"
    //                         startIcon={<EditIcon />}
    //                         onClick={() => {
    //                             handleModal(
    //                                 true,
    //                                 `${modalTitle} засах`,
    //                                 modalContent,
    //                                 null,
    //                                 "large"
    //                             );
    //                             dispatch({
    //                                 type: "isShow",
    //                                 isShow: null,
    //                             });
    //                             dispatch({
    //                                 type: "editId",
    //                                 editId: index.id,
    //                             });
    //                         }}
    //                     >
    //                         Засах
    //                     </Button>
    //                 )}

    //                 {hasShow && (
    //                     <Button
    //                         size="small"
    //                         variant="outlined"
    //                         color="primary"
    //                         startIcon={<VisibilityIcon />}
    //                         onClick={() => {
    //                             handleModal(
    //                                 true,
    //                                 `${modalTitle} харах`,
    //                                 modalContent,
    //                                 null,
    //                                 "large"
    //                             );
    //                             dispatch({
    //                                 type: "isShow",
    //                                 isShow: true,
    //                             });
    //                             dispatch({
    //                                 type: "editId",
    //                                 editId: index.id,
    //                             });
    //                         }}
    //                     >
    //                         Харах
    //                     </Button>
    //                 )}

    //                 {hasDelete && (
    //                     <DeleteButton
    //                         api={api}
    //                         id={index.id}
    //                         listUrl={listUrl}
    //                     />
    //                 )}
    //             </Stack>
    //         );
    //     },
    // });

    (hasUpdate || hasShow || hasDelete) &&
        tempcolumns.push({
            headerName: "Үйлдэл",
            field: "actionButtons",
            dataIndex: "actionButtons",
            width: hasUpdate && hasShow && hasDelete ? 270 : 200,
            __ignore__: true,
            className: "hide-print",
            renderCell: (index: any) => {
                return (
                    <Stack direction="row" spacing={1}>
                        {hasUpdate && (
                            <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={() => {
                                    handleModal(
                                        true,
                                        `${modalTitle} засах`,
                                        modalContent,
                                        null,
                                        "large"
                                    );
                                    dispatch({
                                        type: "isShow",
                                        isShow: null,
                                    });
                                    dispatch({
                                        type: "editId",
                                        editId: index.id,
                                    });
                                }}
                            >
                                Засах
                            </Button>
                        )}

                        {hasShow && (
                            <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                startIcon={<VisibilityIcon />}
                                onClick={() => {
                                    handleModal(
                                        true,
                                        `${modalTitle} харах`,
                                        modalContent,
                                        null,
                                        "large"
                                    );
                                    dispatch({
                                        type: "isShow",
                                        isShow: true,
                                    });
                                    dispatch({
                                        type: "editId",
                                        editId: index.id,
                                    });
                                }}
                            >
                                Харах
                            </Button>
                        )}

                        {hasDelete && (
                            <DeleteButton
                                api={api}
                                id={index.id}
                                listUrl={listUrl}
                            />
                        )}
                    </Stack>
                );
            },
        });

    let customizedColumns: any = calculateColumnsWidth(tempcolumns, data, 300);

    customizedColumns = customizedColumns.columns;

    const excelColumns: any = customizedColumns
        .map((obj: any) => ({
            ...obj,
        }))
        .map((column: any, index: any) => {
            if (column.excelRenderPass) {
                delete column["render"];
            }
            return column;
        });

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const downloadExcel = async () => {
        const Excel = await import("antd-table-saveas-excel");
        const excel = new Excel.Excel();
        excel
            .addSheet("Жагсаалт")
            .addColumns(excelColumns)
            .addDataSource(data)
            .saveAs(
                `${
                    excelName ? excelName : "Жагсаалт"
                } - ${getCurrentDate()}.xlsx`
            );
    };

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
            </Box>
        );

    return (
        <>
            {(hasNew || hasPrint || hasExcel) && (
                <>
                    <Box sx={{ display: "flex" }}>
                        {hasNew && api && (
                            <Button
                                variant="contained"
                                className="mr-3"
                                onClick={() => {
                                    handleModal(
                                        true,
                                        `${modalTitle} нэмэх`,
                                        modalContent,
                                        null,
                                        "large"
                                    );
                                    dispatch({
                                        type: "editId",
                                        editId: null,
                                    });
                                    dispatch({
                                        type: "isShow",
                                        isShow: null,
                                    });
                                }}
                                startIcon={<Icon icon={plusFill} />}
                            >
                                Нэмэх
                            </Button>
                        )}

                        {hasPrint && (
                            <Button
                                variant="outlined"
                                onClick={handlePrint}
                                className="mr-3"
                                startIcon={<PrintIcon />}
                            >
                                Хэвлэх
                            </Button>
                        )}

                        {hasExcel && (
                            <Button
                                variant="outlined"
                                onClick={downloadExcel}
                                startIcon={<CloudDownloadIcon />}
                                className="mr-3"
                            >
                                Excel татах
                            </Button>
                        )}

                        {search && search}
                    </Box>
                    <Divider className="mt-3 mb-3" />
                </>
            )}

            {columns &&
                (data?.length > 0 ? (
                    <ScrollContainer
                        hideScrollbars={true}
                        nativeMobileScroll={true}
                        ref={componentRef}
                    >
                        {datagrid ? (
                            <DataGrid
                                checkboxSelection={false}
                                rows={data}
                                columns={customizedColumns}
                                initialState={
                                    pagination
                                        ? {
                                              pagination: {
                                                  paginationModel: {
                                                      page: 0,
                                                      pageSize: 15,
                                                  },
                                              },
                                          }
                                        : {
                                              pagination: {
                                                  paginationModel: {
                                                      pageSize: data.length, // Set the pageSize to the total number of rows
                                                      page: 1,
                                                  },
                                              },
                                          }
                                }
                                getRowId={(row) => (id ? row[id] : row["id"])}
                                pageSizeOptions={[5, 10, 15, 30]}
                                sx={{ maxHeight: height }}
                            />
                        ) : (
                            <TableContainer
                                component={Paper}
                                sx={{ maxHeight: height }}
                            >
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            {customizedColumns.map(
                                                (
                                                    column: any,
                                                    index: number
                                                ) => (
                                                    <TableCell
                                                        key={index}
                                                        className={
                                                            column.key ===
                                                            "actionButtons"
                                                                ? "print-hide-buttons"
                                                                : ""
                                                        }
                                                    >
                                                        {column.title}
                                                    </TableCell>
                                                )
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map(
                                            (
                                                element: any,
                                                dataIndex: number
                                            ) => (
                                                <TableRow key={dataIndex}>
                                                    {customizedColumns.map(
                                                        (
                                                            column: any,
                                                            index: number
                                                        ) => (
                                                            <TableCell
                                                                key={index}
                                                                className={
                                                                    column.key ===
                                                                    "actionButtons"
                                                                        ? "print-hide-buttons"
                                                                        : ""
                                                                }
                                                            >
                                                                {index == 0 ? (
                                                                    dataIndex +
                                                                    1
                                                                ) : column.key ===
                                                                      "actionButtons" &&
                                                                  (hasUpdate ||
                                                                      hasDelete) ? (
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={
                                                                            1
                                                                        }
                                                                    >
                                                                        {hasUpdate && (
                                                                            <Button
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="primary"
                                                                                startIcon={
                                                                                    <EditIcon />
                                                                                }
                                                                                onClick={() => {
                                                                                    handleModal(
                                                                                        true,
                                                                                        `${modalTitle} засах`,
                                                                                        modalContent,
                                                                                        null,
                                                                                        "large"
                                                                                    );
                                                                                    dispatch(
                                                                                        {
                                                                                            type: "isShow",
                                                                                            isShow: null,
                                                                                        }
                                                                                    );
                                                                                    dispatch(
                                                                                        {
                                                                                            type: "editId",
                                                                                            editId: element[
                                                                                                id
                                                                                            ],
                                                                                        }
                                                                                    );
                                                                                }}
                                                                            >
                                                                                Засах
                                                                            </Button>
                                                                        )}

                                                                        {hasShow && (
                                                                            <Button
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="primary"
                                                                                startIcon={
                                                                                    <VisibilityIcon />
                                                                                }
                                                                                onClick={() => {
                                                                                    handleModal(
                                                                                        true,
                                                                                        `${modalTitle} харах`,
                                                                                        modalContent,
                                                                                        null,
                                                                                        "large"
                                                                                    );
                                                                                    dispatch(
                                                                                        {
                                                                                            type: "isShow",
                                                                                            isShow: true,
                                                                                        }
                                                                                    );
                                                                                    dispatch(
                                                                                        {
                                                                                            type: "editId",
                                                                                            editId: element[
                                                                                                id
                                                                                            ],
                                                                                        }
                                                                                    );
                                                                                }}
                                                                            >
                                                                                Харах
                                                                            </Button>
                                                                        )}

                                                                        {hasDelete && (
                                                                            <DeleteButton
                                                                                api={
                                                                                    api
                                                                                }
                                                                                id={
                                                                                    element[
                                                                                        id
                                                                                    ]
                                                                                }
                                                                                listUrl={
                                                                                    listUrl
                                                                                }
                                                                            />
                                                                        )}
                                                                    </Stack>
                                                                ) : column.render ? (
                                                                    column.render(
                                                                        element[
                                                                            id
                                                                        ],
                                                                        element[
                                                                            column
                                                                                .key
                                                                        ],
                                                                        element,
                                                                        dataIndex
                                                                    )
                                                                ) : (
                                                                    element[
                                                                        column
                                                                            .key
                                                                    ]
                                                                )}
                                                            </TableCell>
                                                        )
                                                    )}
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </ScrollContainer>
                ) : (
                    <EmptyAlert />
                ))}
        </>
    );
};

export default CustomTable;
