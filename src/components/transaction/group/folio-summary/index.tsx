import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";

import { GroupSummarySWR, FolioAPI, listUrl } from "lib/api/folio";
import CustomTable from "components/common/custom-table";
import { ModalContext } from "lib/context/modal";
import NewEdit from "./new-edit";
import { useAppState } from "lib/context/app";
import { FrontOfficeAPI } from "lib/api/front-office";
import { formatPrice } from "lib/utils/helpers";

const RoomCharge = ({ GroupID, TransactionID }: any) => {
    const intl = useIntl();
    const [workingDate, setWorkingDate] = useState(null);

    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = async () => {
        let response = await FrontOfficeAPI.workingDate();
        if (response.status == 200) {
            setWorkingDate(response.workingDate[0].WorkingDate);
        }
    };

    const [state, dispatch]: any = useAppState();
    const { handleModal }: any = useContext(ModalContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const handleClick = (event: any, row: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const { data, error } = GroupSummarySWR(GroupID);

    const columns = [
        {
            title: "№",
            key: "№",
            dataIndex: "№",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderFolioNo",
            }),
            key: "FolioNO",
            dataIndex: "FolioNO",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRoomNo",
            }),
            key: "RoomFullNo",
            dataIndex: "RoomFullNo",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderGuestName",
            }),
            key: "GuestName",
            dataIndex: "GuestName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRoomCharge",
            }),
            key: "RoomCharge",
            dataIndex: "RoomCharge",
            render: function render(id: any, record: any, entity: any) {
                return formatPrice(record);
            },
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderExtraCharge",
            }),
            key: "ExtraCharge",
            dataIndex: "ExtraCharge",
            render: function render(id: any, record: any, entity: any) {
                return formatPrice(record);
            },
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderPaid",
            }),
            key: "Paid",
            dataIndex: "Paid",
            render: function render(id: any, record: any, entity: any) {
                return formatPrice(record);
            },
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderBalance",
            }),
            key: "Balance",
            dataIndex: "Balance",
            render: function render(id: any, record: any, entity: any) {
                return formatPrice(record);
            },
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderAction",
            }),
            key: "Action",
            dataIndex: "Action",
            render: function render(id: any, record: any, entity: any) {
                return (
                    <>
                        <Button
                            aria-controls={`menu${entity.FolioID}`}
                            variant={"outlined"}
                            size="small"
                            onClick={(e) => handleClick(e, entity)}
                        >
                            {intl.formatMessage({
                                id: "RowHeaderAction",
                            })}
                        </Button>

                        <Menu
                            id={`menu${entity.FolioID}`}
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem
                                key={`neh${entity.FolioID}`}
                                onClick={() => {
                                    handleClose();
                                }}
                            >
                                {intl.formatMessage({
                                    id: "ButtonPrintInvoice",
                                })}
                            </MenuItem>
                            <MenuItem
                                key={`payment${entity.FolioID}`}
                                onClick={() => {
                                    handleModal(
                                        true,

                                        intl.formatMessage({
                                            id: "ButtonAddPayment",
                                        }),

                                        <NewEdit
                                            TransactionID={
                                                selectedRow &&
                                                selectedRow.TransactionID
                                            }
                                            FolioID={
                                                selectedRow &&
                                                selectedRow.FolioID
                                            }
                                            workingDate={
                                                workingDate && workingDate
                                            }
                                            Balance={
                                                selectedRow &&
                                                selectedRow.Balance
                                            }
                                        />
                                    );
                                    handleClose();
                                }}
                            >
                                {intl.formatMessage({
                                    id: "ButtonAddPayment",
                                })}
                            </MenuItem>
                        </Menu>
                    </>
                );
            },
        },
    ];

    const onChargeToOwner = async (GroupID: any) => {
        if (!confirm("Are you sure?")) {
            return;
        }
        var res = await FolioAPI.chargeToOwner(GroupID);
        await mutate("/api/Folio/Group/Summary");
        toast("Амжилттай");
    };

    return (
        <Box>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                modalTitle="Өрөөний тооцоо"
                excelName="Өрөөний тооцоо"
                pagination={false}
                datagrid={false}
                hasPrint={true}
                hasExcel={true}
                hasNew={false}
                hasUpdate={true}
                hasShow={false}
                id="FolioID"
                api={FolioAPI}
                listUrl={listUrl}
                additionalButtons={
                    <>
                        <Button
                            key={1}
                            onClick={() => {}}
                            variant={"outlined"}
                            className="mr-3"
                        >
                            Е-баримт хэвлэх
                        </Button>
                        <Button
                            key={2}
                            onClick={() => {}}
                            variant={"outlined"}
                            className="mr-3"
                        >
                            Нэх.хэвлэх
                        </Button>
                        <Button
                            key={3}
                            onClick={() => {
                                onChargeToOwner(GroupID);
                            }}
                            variant={"outlined"}
                            className="mr-3"
                        >
                            Тооцоог группын ахлагч руу
                        </Button>
                    </>
                }
            />
        </Box>
    );
};

export default RoomCharge;
