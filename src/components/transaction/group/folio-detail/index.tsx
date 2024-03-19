import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { format } from "date-fns";

import { GroupDetailSWR, FolioAPI, listUrl } from "lib/api/folio";
import CustomTable from "components/common/custom-table";
import { ModalContext } from "lib/context/modal";
import NewEdit from "./new-edit";
import { useAppState } from "lib/context/app";
import { formatPrice } from "lib/utils/helpers";

const RoomCharge = ({ GroupID, TransactionID }: any) => {
    const [state, dispatch]: any = useAppState();
    const { handleModal }: any = useContext(ModalContext);

    const { data, error } = GroupDetailSWR(GroupID);

    const columns = [
        {
            title: "Тооцооны дугаар",
            key: "FolioNo",
            dataIndex: "FolioNo",
        },
        {
            title: "Өдөр",
            key: "CurrDate",
            dataIndex: "CurrDate",
            renderCell: (element: any) => {
                return format(
                    new Date(element.row.CurrDate.replace(/ /g, "T")),
                    "MM/dd/yyyy"
                );
            },
        },
        {
            title: "Өрөө",
            key: "RoomFullName",
            dataIndex: "RoomFullName",
        },
        {
            title: "Хэлбэр",
            key: "ItemName",
            dataIndex: "ItemName",
        },
        {
            title: "Дүн",
            key: "Amount1",
            dataIndex: "Amount1",
            renderCell: (element: any) => {
                return formatPrice(element.row.Amount1);
            },
        },
        {
            title: "Тайлбар",
            key: "Description",
            dataIndex: "Description",
        },
        {
            title: "Хэрэглэгч",
            key: "Username",
            dataIndex: "Username",
        },

        {
            title: "Үйлдэл",
            key: "Action",
            dataIndex: "Action",
            renderCell: (element: any) => {
                return (
                    <>
                        <Button
                            variant={"outlined"}
                            size="small"
                            onClick={() => {
                                handleModal(
                                    true,
                                    "Засах",
                                    <NewEdit
                                        TransactionID={
                                            element.row.TransactionID
                                        }
                                        FolioID={element.row.FolioID}
                                        TypeID={element.row.TypeID}
                                        CurrID={element.row.CurrID}
                                    />
                                );
                                dispatch({
                                    type: "isShow",
                                    isShow: null,
                                });
                                dispatch({
                                    type: "editId",
                                    editId: [
                                        element.row.FolioID,
                                        element.row.TypeID,
                                        element.row.CurrID,
                                    ],
                                });
                            }}
                        >
                            Засах
                        </Button>
                    </>
                );
            },
        },
    ];

    return (
        <Box>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                modalTitle="Өрөөний тооцоо"
                excelName="Өрөөний тооцоо"
                pagination={false}
                datagrid={true}
                hasPrint={true}
                hasExcel={true}
                hasNew={false}
                hasUpdate={false}
                hasShow={false}
                id="CurrID"
                api={FolioAPI}
                listUrl={listUrl}
            />
        </Box>
    );
};

export default RoomCharge;
