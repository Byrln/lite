import { useRef, useContext } from "react";
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

import { getCurrentDate } from "lib/utils/helpers";
import EmptyAlert from "./empty-alert";
import DeleteButton from "components/common/delete-button";
import { ModalContext } from "lib/context/modal";

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
    id,
    listUrl,
    modalTitle,
    modalContent,
}: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const componentRef: any = useRef<HTMLDivElement>(null);
    const customizedColumns: any = [
        {
            title: "№",
            key: "id",
            dataIndex: "id",
            render: function renderAction(
                text: any,
                record: any,
                index: number
            ) {
                return index + 1;
            },
        },
    ].concat(columns);

    (hasUpdate || hasDelete) &&
        customizedColumns.push({
            title: "",
            key: "actionButtons",
            dataIndex: "actionButtons",
        });

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const downloadExcel = async () => {
        const Excel = await import("antd-table-saveas-excel");
        const excel = new Excel.Excel();
        excel
            .addSheet("Жагсаалт")
            .addColumns(customizedColumns)
            .addDataSource(data)
            .saveAs(`Excel - ${getCurrentDate()}.xlsx`);
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
                    {hasNew && api && (
                        <Button
                            variant="contained"
                            className="mr-3"
                            onClick={() => {
                                handleModal(
                                    true,
                                    `${modalTitle} нэмэх`,
                                    modalContent
                                );
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
                        >
                            Excel татах
                        </Button>
                    )}

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
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {customizedColumns.map(
                                            (column: any, index: number) => (
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
                                        (element: any, dataIndex: number) => (
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
                                                            {index == 0
                                                                ? dataIndex + 1
                                                                : column.key ===
                                                                  "actionButtons"
                                                                ? (hasUpdate &&
                                                                      hasDelete && (
                                                                          <Stack
                                                                              direction="row"
                                                                              spacing={
                                                                                  1
                                                                              }
                                                                          >
                                                                              <Button
                                                                                  variant="outlined"
                                                                                  color="secondary"
                                                                                  startIcon={
                                                                                      <EditIcon />
                                                                                  }
                                                                                  onClick={() => {
                                                                                      handleModal(
                                                                                          true,
                                                                                          `${modalTitle} засах`,
                                                                                          modalContent
                                                                                      );
                                                                                  }}
                                                                              >
                                                                                  Засах
                                                                              </Button>

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
                                                                          </Stack>
                                                                      )) ||
                                                                  (hasUpdate && (
                                                                      <Button
                                                                          variant="outlined"
                                                                          color="secondary"
                                                                          startIcon={
                                                                              <EditIcon />
                                                                          }
                                                                          onClick={() => {
                                                                              handleModal(
                                                                                  true,
                                                                                  `${modalTitle} засах`,
                                                                                  modalContent
                                                                              );
                                                                          }}
                                                                      >
                                                                          Засах
                                                                      </Button>
                                                                  )) ||
                                                                  (hasDelete && (
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
                                                                  ))
                                                                : element[
                                                                      column.key
                                                                  ]}
                                                        </TableCell>
                                                    )
                                                )}
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </ScrollContainer>
                ) : (
                    <EmptyAlert />
                ))}
        </>
    );
};

export default CustomTable;
