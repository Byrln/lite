import { Grid, Box, Button } from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { format } from "date-fns";
import { mutate } from "swr";
import { useIntl } from "react-intl";
import CustomTable from "components/common/custom-table";
import {
    CashierSessionListSWR,
    CashierSessionDetailSWR,
    CashierSessionSummarySWR,
    CashierSessionAPI,
} from "lib/api/cashier-session";
import { styled } from "@mui/material/styles";
import { ModalContext } from "lib/context/modal";
import CashAddForm from "./actions/cash-add";
import StartForm from "./actions/start";
import EndForm from "./actions/end";

const CashierList = ({ title }: any) => {
    const intl = useIntl();
    const [activeSessionID, setActiveSessionID] = useState<any>(null);
    const [detailData, setDetailData] = useState(null);
    const [summary, setSummary] = useState(null);
    const { handleModal }: any = useContext(ModalContext);

    const { data: listData, error: listError } = CashierSessionListSWR({});
    const { data, error } = CashierSessionSummarySWR(244);
    const historyColumn = [
    
        {
            title: "№",
            key: "№",
            dataIndex: "№",
        },
        {
            title: intl.formatMessage({id:"TitleCashier"}), 
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: intl.formatMessage({id:"TStartDate"}), 
            key: "StartDate",
            dataIndex: "StartDate",
            render: function render(id: any, value: any) {
                return (value && format(
                    new Date(value.replace(/ /g, "T")),
                    "MM/dd/yyyy HH:mm:ss"
                ));
            },
        },
        {
            title: intl.formatMessage({id:"End Date"}), 
            key: "EndDate",
            dataIndex: "EndDate",
            render: function render(id: any, value: any) {
                return (value && format(
                    new Date(value.replace(/ /g, "T")),
                    "MM/dd/yyyy HH:mm:ss"
                ));
            },
        },
    ];
    
    const columns = [
        {
            title: "№",
            key: "№",
            dataIndex: "№",
        },
        {
            title: intl.formatMessage({id:"ReportQuickReview"}), 
            key: "name",
            dataIndex: "name",
        },
        {
            title: intl.formatMessage({id:"RowHeaderNoOfTransaction"}), 
            key: "CountTrans",
            dataIndex: "CountTrans",
        },
        {
            title: intl.formatMessage({id:"ReportAmount"}), 
            key: "Amount",
            dataIndex: "Amount",
        },
        {
            title: intl.formatMessage({id:"ReportAmount"}), 
            key: "TotalAmount",
            dataIndex: "TotalAmount",
        },
    ];
    
    const detailColumns = [
        {
            title: "№",
            key: "№",
            dataIndex: "№",
        },
        {
            title: intl.formatMessage({id:"RowHeaderDateTime"}), 
            key: "CurrDateTime",
            dataIndex: "CurrDateTime",
            render: function render(id: any, value: any) {
                return (value && format(
                    new Date(value.replace(/ /g, "T")),
                    "MM/dd/yyyy HH:mm:ss"
                ));
            },
        },
        {
            title: intl.formatMessage({id:"RowHeaderRoomandType"}), 
            key: "RoomName",
            dataIndex: "RoomName",
        },
        {
            title: intl.formatMessage({id:"RowHeaderGuestName"}), 
            key: "GuestName",
            dataIndex: "GuestName",
        },
        {
            title: intl.formatMessage({id:"RowHeaderNote"}), 
            key: "Description",
            dataIndex: "Description",
        },
        {
            title: intl.formatMessage({id:"AmountCalculated"}), 
            key: "AmountCalculated",
            dataIndex: "AmountCalculated",
            render: function render(id: any, value: any, entity: any) {
                return value + "₮";
            },
        },
    ];
    
    const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
        
        <Tooltip {...props} classes={{ popper: className }} />
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 500,
            background: "white",
            border: "rgba(0, 0, 0, .2) 1px solid",
            overflow: "scroll",
        },
    });
    // const { data: detailData, error: detailError } =
    //     CashierSessionDetailSWR(activeSessionID);

    const fetchTest = async () => {
        if (listData) {
            let filteredItemData = listData.filter(
                (event: any) => event.IsActive === true
            );
            if (filteredItemData && filteredItemData.length) {
                setActiveSessionID(listData[0].SessionID);
                const response = await CashierSessionAPI.detail(
                    listData[0].SessionID
                );
                const summaryResponse = await CashierSessionAPI.summary(
                    listData[0].SessionID
                );
                if (response) {
                    setDetailData(response);
                }
                if (summaryResponse) {
                    summaryResponse.forEach(async (summary: any) => {
                        summary.name =
                            summary.ActionID == 1
                                ? "Эхлэх дүн"
                                : summary.ActionID == 2
                                ? "Хүлээн авсан дүн"
                                : summary.ActionID == 3
                                ? "Төлбөрт гарсан дүн"
                                : summary.ActionID == 4
                                ? "Withdraw"
                                : summary.ActionID == 5
                                ? "End"
                                : summary.ActionID == 6
                                ? "Одоогийн дүн"
                                : summary.ActionID == 7
                                ? "Start Balance"
                                : summary.ActionID == 8
                                ? "End Balance"
                                : "";
                    });

                    setSummary(summaryResponse);
                }
            } else {
                setActiveSessionID("-1");
                const response = await CashierSessionAPI.detail("-1");
                const summaryResponse = await CashierSessionAPI.summary("-1");
                if (response) {
                    setDetailData(response);
                }
                if (summaryResponse) {
                    summaryResponse.forEach(async (summary: any) => {
                        summary.name =
                            summary.ActionID == 1
                                ? "Эхлэх дүн"
                                : summary.ActionID == 2
                                ? "Хүлээн авсан дүн"
                                : summary.ActionID == 3
                                ? "Төлбөрт гарсан дүн"
                                : summary.ActionID == 4
                                ? "Withdraw"
                                : summary.ActionID == 5
                                ? "End"
                                : summary.ActionID == 6
                                ? "Одоогийн дүн"
                                : summary.ActionID == 7
                                ? "Start Balance"
                                : summary.ActionID == 8
                                ? "End Balance"
                                : "";
                    });

                    setSummary(summaryResponse);
                }
            }
        }
    };

    useEffect(() => {
        fetchTest();
    }, [listData]);

    return (
        <Grid container spacing={1}>
            <Grid item sm={12} md={6}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        width: "100%",
                    }}
                >
                    <Button
                        variant="outlined"
                        className="mr-3 mb-3"
                        disabled={
                            activeSessionID && activeSessionID == "-1"
                                ? false
                                : true
                        }
                        onClick={() => {
                            handleModal(
                                true,
                                `Ээлж эхлэх`,
                                <StartForm
                                    setDetailData={setDetailData}
                                    setSummary={setSummary}
                                    setActiveSessionID={setActiveSessionID}
                                />,
                                null,
                                "medium"
                            );
                        }}
                    >
                        Ээлж эхлэх
                    </Button>
                    <Button
                        variant="outlined"
                        className="mr-3 mb-3"
                        disabled={
                            activeSessionID && activeSessionID != "-1"
                                ? false
                                : true
                        }
                        onClick={() => {
                            handleModal(
                                true,
                                `Ээлж эхлэх`,
                                <EndForm SessionID={activeSessionID} />,
                                null,
                                "medium"
                            );
                        }}
                    >
                        Ээлж дуусгах
                    </Button>
                    <CustomWidthTooltip
                        title={
                            <React.Fragment>
                                <div>
                                    <CustomTable
                                        columns={historyColumn}
                                        data={listData}
                                        hasNew={false}
                                        hasUpdate={false}
                                        hasDelete={false}
                                        hasShow={false}
                                        id="SessionID"
                                        datagrid={false}
                                        hasPrint={false}
                                        hasExcel={false}
                                    />
                                </div>
                            </React.Fragment>
                        }
                    >
                        <Button variant="outlined" className="mb-3">
                            Гарааны түүх
                        </Button>
                    </CustomWidthTooltip>
                </Box>
                {summary ? (
                    <CustomTable
                        columns={columns}
                        data={summary}
                        // api={NightAuditAPI}
                        hasNew={false}
                        hasUpdate={false}
                        hasDelete={false}
                        id="SessionID"
                        // listUrl={listUrl}
                        modalTitle={title}
                        // modalContent={<NewEdit />}
                        excelName={title}
                        datagrid={false}
                        hasExcel={false}
                        hasPrint={false}
                    />
                ) : (
                    <></>
                )}
            </Grid>
            <Grid item sm={12} md={6}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        width: "100%",
                    }}
                >
                    <Button
                        variant="outlined"
                        className="mr-3 mb-3"
                        disabled={activeSessionID ? false : true}
                        onClick={() => {
                            handleModal(
                                true,
                                `Мөнгө нэмэх`,
                                <CashAddForm
                                    SessionID={activeSessionID}
                                    isAdd={true}
                                    setDetailData={setDetailData}
                                    setSummary={setSummary}
                                />,
                                null,
                                "medium"
                            );
                        }}
                    >
                        Мөнгө нэмэх
                    </Button>
                    <Button
                        variant="outlined"
                        className="mb-3"
                        disabled={
                            activeSessionID && activeSessionID != "-1"
                                ? false
                                : true
                        }
                        onClick={() => {
                            handleModal(
                                true,
                                `Мөнгө нэмэх`,
                                <CashAddForm
                                    SessionID={activeSessionID}
                                    isAdd={false}
                                    setDetailData={setDetailData}
                                    setSummary={setSummary}
                                />,
                                null,
                                "medium"
                            );
                        }}
                    >
                        Мөнгө хасах
                    </Button>
                </Box>
                {listData ? (
                    <CustomTable
                        columns={detailColumns}
                        data={detailData}
                        // error={detailError}
                        // api={NightAuditAPI}
                        hasNew={false}
                        hasUpdate={false}
                        hasDelete={false}
                        id="SessionID"
                        // listUrl={listUrl}
                        modalTitle={title}
                        // modalContent={<NewEdit />}
                        excelName={title}
                        datagrid={false}
                        hasExcel={false}
                        hasPrint={false}
                    />
                ) : (
                    <></>
                )}
            </Grid>
        </Grid>
    );
};

export default CashierList;
