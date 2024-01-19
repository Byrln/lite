import { Box } from "@mui/material";

import CustomTable from "components/common/custom-table";
import { RoomChargeSWR } from "lib/api/charge";

const RoomCharge = ({ TransactionID }: any) => {
    const { data, error } = RoomChargeSWR(TransactionID);

    console.log("RoomCharge", data);

    const columns = [
        {
            title: "№",
            key: "№",
            dataIndex: "№",
        },
        {
            title: "Огноо",
            key: "StayDate",
            dataIndex: "StayDate",
        },
        {
            title: "Өрөө",
            key: "RoomFullNo",
            dataIndex: "RoomFullNo",
        },
        {
            title: "Тарифын төрөл",
            key: "RateTypeName",
            dataIndex: "RateTypeName",
        },
        {
            title: "Хүний тоо",
            key: "Pax",
            dataIndex: "Pax",
        },
        {
            title: "Тооцоо",
            key: "Charge",
            dataIndex: "Charge",
        },
        {
            title: "Татвар",
            key: "Tax",
            dataIndex: "Tax",
        },
        {
            title: "Нийлбэр дүн",
            key: "RateAmount",
            dataIndex: "RateAmount",
        },
        {
            title: "Хэрэглэгч",
            key: "UserName",
            dataIndex: "UserName",
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
                hasPrint={false}
                hasExcel={false}
                id="RoomChargeID"
            />
        </Box>
    );
};

export default RoomCharge;
