import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";

import { GroupDetailSWR, FolioAPI, listUrl } from "lib/api/folio";
import CustomTable from "components/common/custom-table";
import { ModalContext } from "lib/context/modal";
import NewEdit from "./new-edit";
import { useAppState } from "lib/context/app";

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
            render: function render(id: any, record: any, element: any) {
                return (
                    <>
                        <Button
                            variant={"text"}
                            size="small"
                            onClick={() => {
                                handleModal(
                                    true,
                                    "Засах",
                                    <NewEdit
                                        TransactionID={element.TransactionID}
                                        FolioID={element.FolioID}
                                        TypeID={element.TypeID}
                                    />
                                );
                                dispatch({
                                    type: "isShow",
                                    isShow: null,
                                });
                                dispatch({
                                    type: "editId",
                                    editId: [element.FolioID, element.TypeID],
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
                datagrid={false}
                hasPrint={true}
                hasExcel={true}
                hasNew={false}
                hasUpdate={true}
                hasShow={false}
                id="FolioID"
                id2="TypeID"
                api={FolioAPI}
                listUrl={listUrl}
            />
        </Box>
    );
};

export default RoomCharge;
