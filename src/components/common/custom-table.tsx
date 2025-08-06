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
import Checkbox from "@mui/material/Checkbox";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PrintIcon from "@mui/icons-material/Print";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { alpha, useTheme } from "@mui/material/styles";

import { getCurrentDate } from "lib/utils/helpers";

const StyledEmptyAlert = () => {
  const theme = useTheme();
  return (
    <Alert
      severity="info"
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
        bgcolor: alpha(theme.palette.info.main, 0.05),
        '& .MuiAlert-icon': {
          mt: 0.3,
          color: theme.palette.info.main
        },
        '& .MuiAlert-message': {
          fontWeight: 500,
          color: theme.palette.info.dark
        }
      }}
    >
      Мэдээлэл олдсонгүй
    </Alert>
  );
};
import DeleteButton from "components/common/delete-button";
import { ModalContext } from "lib/context/modal";
import { useAppState } from "lib/context/app";
import { DataUsageTwoTone } from "@mui/icons-material";
import { calculateColumnsWidth } from "lib/utils/dynamic-columns-helper";
import DateRangePicker from "../ui/date-range-picker";
import { Sheet } from "lucide-react";

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
  hasAddFloors = false,
  hasDateRangePicker = false,
  onDateRangeChange,
  defaultStartDate,
  defaultEndDate,
  id,
  listUrl,
  modalTitle,
  modalContent,
  excelName,
  search,
  pagination = true,
  datagrid = true,
  additionalButtons,
  rowColor,
  functionAfterSubmit,
  customHeight,
  modalsize = "small",
  iconSelector,
  showRowNumbers = true,
}: any) => {
  const intl = useIntl();
  const theme = useTheme();
  const [state, dispatch]: any = useAppState();
  const [height, setHeight] = useState<any>(null);
  // const [excelColumns, setExcelColumns]: any = useState(null);
  const { handleModal }: any = useContext(ModalContext);
  const componentRef: any = useRef<HTMLDivElement>(null);

  // Add Floors Modal state
  const [openFloorsModal, setOpenFloorsModal] = useState(false);
  const [floorRange, setFloorRange] = useState<number[]>([1, 5]);

  // Date Range Picker state
  const [dateRange, setDateRange] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined
  });

  useEffect(() => {
    setHeight(window.innerHeight - 240);
  }, [window.innerHeight]);

  // Handler functions for Add Floors modal
  const handleFloorsModalOpen = () => {
    setOpenFloorsModal(true);
  };

  const handleFloorsModalClose = () => {
    setOpenFloorsModal(false);
  };

  const handleFloorRangeChange = (event: Event, newValue: number | number[]) => {
    setFloorRange(newValue as number[]);
  };

  const valuetext = (value: number) => {
    return `${value}`;
  };

  const handleAddFloors = async () => {
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const success = Math.random() > 0.3;
          if (success) {
            resolve('success');
          } else {
            reject(new Error('Failed to add floors'));
          }
        }, 1000);
      });

      toast(intl.formatMessage({ id: "TextSuccess" }) || "Амжилттай.");
      handleFloorsModalClose();
    } catch (error) {
      toast("Алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setDateRange(prev => ({ ...prev, startDate: date }));
    if (onDateRangeChange) {
      onDateRangeChange({ startDate: date, endDate: dateRange.endDate });
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setDateRange(prev => ({ ...prev, endDate: date }));
    if (onDateRangeChange) {
      onDateRangeChange({ startDate: dateRange.startDate, endDate: date });
    }
  };

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

  (hasUpdate || hasShow || hasDelete) &&
    tempcolumns.push({
      headerName: intl.formatMessage({
        id: "RowHeaderAction",
      }),
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
                    `${modalTitle || ''} ${intl.formatMessage({
                      id: "ButtonEdit",
                    })}`.trim(),
                    modalContent,
                    null,
                    modalsize
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
                {intl.formatMessage({
                  id: "ButtonEdit",
                })}
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
                    `${modalTitle || ''} ${intl.formatMessage({
                      id: "ButtonView",
                    })}`.trim(),
                    modalContent,
                    null,
                    modalsize
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
                {intl.formatMessage({
                  id: "ButtonView",
                })}
              </Button>
            )}

            {hasDelete && (
              <DeleteButton
                api={api}
                id={index.id}
                listUrl={listUrl}
                functionAfterSubmit={functionAfterSubmit}
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
    // Validate data before processing
    if (!data || !Array.isArray(data) || data.length === 0) {
      toast.error("No data available for export");
      return;
    }

    // Validate columns
    if (!excelColumns || !Array.isArray(excelColumns) || excelColumns.length === 0) {
      toast.error("No columns configured for export");
      return;
    }

    try {
      // Sanitize columns for Excel export
      const sanitizedColumns = excelColumns.map((column: any) => {
        const { render, renderCell, ...cleanColumn } = column;
        return {
          title: cleanColumn.title || cleanColumn.headerName || cleanColumn.field,
          dataIndex: cleanColumn.dataIndex || cleanColumn.field,
          key: cleanColumn.key || cleanColumn.field,
          width: cleanColumn.width
        };
      }).filter((column: any) => column.dataIndex); // Only include columns with valid dataIndex

      // Sanitize data for Excel export
      const sanitizedData = data.map((row: any, index: number) => {
        const cleanRow: any = { ...row };
        // Ensure each row has an id for Excel processing
        if (!cleanRow.id) {
          cleanRow.id = index + 1;
        }
        return cleanRow;
      });

      const Excel = await import("antd-table-saveas-excel");
      const excel = new Excel.Excel();
      excel
        .addSheet("Жагсаалт")
        .addColumns(sanitizedColumns)
        .addDataSource(sanitizedData)
        .saveAs(
          `${excelName ? excelName : "Жагсаалт"
          } - ${getCurrentDate()}.xlsx`
        );
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Failed to export Excel file");
    }
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
      {/* Add Floors Modal */}
      <Modal
        open={openFloorsModal}
        onClose={handleFloorsModalClose}
        aria-labelledby="add-floors-modal-title"
        aria-describedby="add-floors-modal-description"
        closeAfterTransition
      >
        <Fade in={openFloorsModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 450 },
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[24],
            borderRadius: 3,
            p: 4,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            backdropFilter: 'blur(10px)',
          }}>
            <Typography
              id="add-floors-modal-title"
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                mb: 3
              }}
            >
              {intl.formatMessage({
                id: "ButtonAddFloors",
              })}
            </Typography>
            <Box sx={{ mt: 2, mb: 4 }}>
              <Slider
                getAriaLabel={() => 'Floor range'}
                value={floorRange}
                onChange={handleFloorRangeChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                min={1}
                max={20}
                sx={{
                  '& .MuiSlider-thumb': {
                    boxShadow: theme.shadows[4],
                  },
                  '& .MuiSlider-track': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }
                }}
              />
              <Box sx={{
                mt: 3,
                p: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}>
                <Typography
                  id="add-floors-modal-description"
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary
                  }}
                >
                  {intl.formatMessage({ id: 'TextNumber' })}:
                  <Chip
                    label={`${floorRange[0]} - ${floorRange[1]}`}
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 1, fontWeight: 600 }}
                  />
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={handleFloorsModalClose}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3
                }}
              >
                {intl.formatMessage({ id: 'ButtonCancel' })}
              </Button>
              <Button
                onClick={handleAddFloors}
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                  }
                }}
              >
                {intl.formatMessage({ id: 'ButtonSave' })}
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      {(hasNew || hasPrint || hasExcel || hasAddFloors || hasDateRangePicker || additionalButtons || search) && (
        <>
          <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            mb: 3,
            p: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backdropFilter: 'blur(10px)',
            boxShadow: theme.shadows[1]
          }}>
            {hasNew && api && (
              <Tooltip title={intl.formatMessage({ id: "ButtonAddNew" })} arrow>
                <Button
                  variant="contained"
                  className="capitalize"
                  onClick={() => {
                    handleModal(
                      true,
                      `${modalTitle || ''} ${intl.formatMessage({
                        id: "ButtonAddNew",
                      })}`.trim(),
                      modalContent,
                      null,
                      modalsize
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
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: theme.shadows[3],
                    '&:hover': {
                      boxShadow: theme.shadows[6],
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {intl.formatMessage({
                    id: "ButtonAddNew",
                  })}
                </Button>
              </Tooltip>
            )}
            {hasAddFloors && (
              <Tooltip title={intl.formatMessage({ id: "ButtonAddFloors" })} arrow>
                <Button
                  variant="outlined"
                  onClick={handleFloorsModalOpen}
                  startIcon={<Icon icon={plusFill} />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3,
                    py: 1,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {intl.formatMessage({
                    id: "ButtonAddFloors",
                  })}
                </Button>
              </Tooltip>
            )}
            {iconSelector && iconSelector}
            {hasPrint && (
              <Tooltip title={intl.formatMessage({ id: "ButtonPrint" })} arrow>
                <Button
                  variant="outlined"
                  onClick={handlePrint}
                  startIcon={<PrintIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3,
                    py: 1,
                    borderColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.main,
                    '&:hover': {
                      borderColor: theme.palette.secondary.dark,
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {intl.formatMessage({
                    id: "ButtonPrint",
                  })}
                </Button>
              </Tooltip>
            )}
            {hasExcel && (
              <Tooltip title={intl.formatMessage({ id: "ButtonExcel" })} arrow>
                <Button
                  variant="outlined"
                  onClick={downloadExcel}
                  startIcon={<Sheet />}
                  disabled={!data || !Array.isArray(data) || data.length === 0}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3,
                    py: 1,
                    borderColor: theme.palette.success.main,
                    color: theme.palette.success.main,
                    '&:hover': {
                      borderColor: theme.palette.success.dark,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      borderColor: theme.palette.action.disabled,
                      color: theme.palette.action.disabled,
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {intl.formatMessage({
                    id: "ButtonExcel",
                  })}
                </Button>
              </Tooltip>
            )}
            {hasDateRangePicker && (
              <DateRangePicker
                className="rounded-lg text-primary bg-transparent hover:bg-purple-100 border-1.5 border-primary-light"
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                onSearch={(startDate, endDate) => {
                  if (onDateRangeChange) {
                    onDateRangeChange({
                      startDate: startDate,
                      endDate: endDate,
                    });
                  }
                }}
                onClear={() => {
                  setDateRange({
                    startDate: defaultStartDate,
                    endDate: defaultEndDate,
                  });
                  if (onDateRangeChange) {
                    onDateRangeChange({
                      startDate: defaultStartDate,
                      endDate: defaultEndDate,
                    });
                  }
                }}
                startLabel="Start Date"
                endLabel="End Date"
              />
            )}
            {additionalButtons && additionalButtons}
            {search && search}
          </Box>
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
                density="compact"
                columns={customizedColumns}
                initialState={
                  pagination
                    ? {
                      pagination: {
                        paginationModel: {
                          page: 0,
                          pageSize: 30,
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
                pageSizeOptions={[5, 10, 15, 30, 100]}
                sx={{
                  maxHeight: height,
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: theme.shadows[2],
                  '& .MuiDataGrid-main': {
                    borderRadius: 1,
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: theme.palette.primary.main,
                    borderBottom: '2px solid theme.palette.primary.main',
                    '& .MuiDataGrid-columnHeader': {
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: "white",
                    }
                  },
                  '& .MuiDataGrid-row': {
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'scale(1.001)',
                      transition: 'all 0.3s ease-in'
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    }
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                    fontSize: '0.875rem'
                  },
                  '& .MuiDataGrid-footerContainer': {
                    backgroundColor: theme.palette.primary.main
                  }
                }}
                getRowClassName={(params) => {
                  return params.indexRelativeToCurrentPage %
                    2 ===
                    0
                    ? "even"
                    : "odd";
                }}
              />
            ) : (
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: customHeight ? customHeight : height,
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: theme.shadows[2],
                  overflow: 'hidden'
                }}
              >
                <Table size="small" stickyHeader sx={{
                  '& .MuiTableHead-root': {
                    '& .MuiTableCell-head': {
                      backgroundColor: "#884ce4",
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: "white",
                    }
                  },
                  '& .MuiTableBody-root': {
                    '& .MuiTableRow-root': {
                      '&:hover': {
                        backgroundColor: alpha("#884ce4", 0.1),
                        transform: 'scale(1.001)',
                        transition: 'all 0.3s ease-in'
                      }
                    },
                    '& .MuiTableCell-root': {
                      fontSize: '0.875rem',
                      padding: '12px 16px'
                    }
                  }
                }}>
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
                            {column.withCheckBox && (
                              <Checkbox
                                onChange={(
                                  e: any
                                ) => {
                                  column.onChange
                                    ? column.onChange(
                                      e
                                    )
                                    : null;
                                }}
                              />
                            )}{" "}
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
                        <TableRow
                          key={dataIndex}
                          sx={
                            rowColor
                              ? {
                                backgroundColor: `#${element[rowColor]}50`,
                              }
                              : {
                                backgroundColor:
                                  dataIndex %
                                    2 ===
                                    0
                                    ? "#f9f9f9"
                                    : "#ffffff",
                              }
                          }
                        >
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
                                {column.key ===
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
                                      <Tooltip title="Засах" arrow>
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
                                              `${modalTitle || ''} засах`.trim(),
                                              modalContent,
                                              null,
                                              modalsize
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
                                          sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 500,
                                            borderColor: theme.palette.primary.main,
                                            color: theme.palette.primary.main,
                                            '&:hover': {
                                              borderColor: theme.palette.primary.dark,
                                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                                              transform: 'translateY(-1px)'
                                            },
                                            transition: 'all 0.2s ease-in-out'
                                          }}
                                        >
                                          Засах
                                        </Button>
                                      </Tooltip>
                                    )}

                                    {hasShow && (
                                      <Tooltip title="Харах" arrow>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          color="secondary"
                                          startIcon={
                                            <VisibilityIcon />
                                          }
                                          onClick={() => {
                                            handleModal(
                                              true,
                                              `${modalTitle || ''} харах`.trim(),
                                              modalContent,
                                              null,
                                              modalsize
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
                                          sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 500,
                                            borderColor: theme.palette.secondary.main,
                                            color: theme.palette.secondary.main,
                                            '&:hover': {
                                              borderColor: theme.palette.secondary.dark,
                                              bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                              transform: 'translateY(-1px)'
                                            },
                                            transition: 'all 0.2s ease-in-out'
                                          }}
                                        >
                                          Харах
                                        </Button>
                                      </Tooltip>
                                    )}

                                    {hasDelete && (
                                      <Box sx={{ display: 'inline-block' }}>
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
                                      </Box>
                                    )}
                                  </Stack>
                                ) : showRowNumbers && index === 0 ? (
                                  dataIndex + 1
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
          <StyledEmptyAlert />
        ))}
    </>
  );
};

export default CustomTable;
