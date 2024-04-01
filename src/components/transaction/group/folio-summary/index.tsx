import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";

import { GroupSummarySWR, FolioAPI, listUrl } from "lib/api/folio";
import CustomTable from "components/common/custom-table";
import { ModalContext } from "lib/context/modal";
import NewEdit from "./new-edit";
import { useAppState } from "lib/context/app";
import { FrontOfficeAPI } from "lib/api/front-office";
import { formatPrice } from "lib/utils/helpers";
import PaymentFormArray from "components/transaction/folio/payment-from-array";

const RoomCharge = ({ GroupID, TransactionID }: any) => {
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
            title: "Тооцооны дугаар",
            key: "FolioNO",
            dataIndex: "FolioNO",
        },
        {
            title: "Өрөө",
            key: "RoomFullNo",
            dataIndex: "RoomFullNo",
        },
        {
            title: "Зочны нэр",
            key: "GuestName",
            dataIndex: "GuestName",
        },
        {
            title: "Өрөөний тооцоо",
            key: "RoomCharge",
            dataIndex: "RoomCharge",
            render: function render(id: any, record: any, entity: any) {
                return formatPrice(record);
            },
        },
        {
            title: "Нэмэлт үйлчилгээ",
            key: "ExtraCharge",
            dataIndex: "ExtraCharge",
            render: function render(id: any, record: any, entity: any) {
                return formatPrice(record);
            },
        },
        {
            title: "Төлсөн",
            key: "Paid",
            dataIndex: "Paid",
            render: function render(id: any, record: any, entity: any) {
                return formatPrice(record);
            },
        },
        {
            title: "Үлд.төлбөр",
            key: "Balance",
            dataIndex: "Balance",
            render: function render(id: any, record: any, entity: any) {
                return formatPrice(record);
            },
        },
        {
            title: "Үйлдэл",
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
                            Үйлдэл
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
                                Нэх.хэвлэх
                            </MenuItem>
                            <MenuItem
                                key={`payment${entity.FolioID}`}
                                onClick={() => {
                                    handleModal(
                                        true,
                                        "Төлбөр төлөх",
                                        // <PaymentFormArray
                                        //     FolioID={
                                        //         selectedRow &&
                                        //         selectedRow.FolioID
                                        //     }
                                        //     TransactionID={
                                        //         selectedRow &&
                                        //         selectedRow.TransactionID
                                        //     }
                                        //     Amount={
                                        //         selectedRow &&
                                        //         selectedRow.Balance
                                        //     }
                                        //     handleModal={handleModal}
                                        // />,
                                        // null,
                                        // "large"
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
                                Төлбөр төлөх
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
