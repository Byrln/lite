import { Box, Button } from "@mui/material";
import { useContext } from "react";

import { FolioItemSWR, FolioAPI, listUrl } from "lib/api/folio";
import CustomTable from "components/common/custom-table";
import { ModalContext } from "lib/context/modal";
import NewEdit from "./new-edit";
import CutForm from "./cut";
import BillTo from "./bill-to";

const RoomCharge = ({ FolioID, TransactionID }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    const { data, error } = FolioItemSWR(FolioID);

    const columns = [
        {
            title: "№",
            key: "№",
            dataIndex: "№",
        },
        {
            title: "Огноо",
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
                hasPrint={false}
                hasExcel={false}
                hasNew={true}
                hasUpdate={true}
                id="CurrID"
                modalContent={
                    <NewEdit TransactionID={TransactionID} FolioID={FolioID} />
                }
                api={FolioAPI}
                listUrl={listUrl}
                additionalButtons={
                    <>
                        <Button
                            key={2}
                            onClick={() => {
                                handleModal(
                                    true,
                                    `Cut Folio`,
                                    <CutForm
                                        FolioID={FolioID}
                                        handleModal={handleModal}
                                    />,
                                    null,
                                    "small"
                                );
                            }}
                        >
                            Cut Folio
                        </Button>

                        <Button
                            key={2}
                            onClick={() => {
                                handleModal(
                                    true,
                                    `Cut Folio`,
                                    <BillTo
                                        TransactionID={TransactionID}
                                        FolioID={FolioID}
                                        handleModal={handleModal}
                                    />,
                                    null,
                                    "medium"
                                );
                            }}
                        >
                            Bill To
                        </Button>
                    </>
                }
            />
        </Box>
    );
};

export default RoomCharge;
