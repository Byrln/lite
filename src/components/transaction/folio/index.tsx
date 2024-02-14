import { Box } from "@mui/material";

import CustomTable from "components/common/custom-table";
import { FolioItemSWR, FolioAPI, listUrl } from "lib/api/folio";
import NewEdit from "./new-edit";

const RoomCharge = ({ FolioID, TransactionID }: any) => {
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
            />
        </Box>
    );
};

export default RoomCharge;
