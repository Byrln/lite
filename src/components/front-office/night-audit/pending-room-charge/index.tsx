import CustomTable from "components/common/custom-table";
import { PendingRoomChargeSWR, listUrl } from "lib/api/charge";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Зочин",
        key: "GuestName",
        dataIndex: "GuestName",
    },
    {
        title: "Өрөө",
        key: "RoomFullNo",
        dataIndex: "RoomFullNo",
    },
    {
        title: "Тарифын төрөл",
        key: "RoomChargeTypeName",
        dataIndex: "RoomChargeTypeName",
    },
    {
        title: "Үнэ",
        key: "Amount",
        dataIndex: "Amount",
    },
    {
        title: "Огноо",
        key: "ChargeDate",
        dataIndex: "ChargeDate",
    },
];

const PendingRoomChargeList = ({ title }: any) => {
    const { data, error } = PendingRoomChargeSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            // api={NightAuditAPI}
            hasNew={false}
            hasUpdate={false}
            hasDelete={false}
            id="RoomChargeID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
            hasPrint={false}
            hasExcel={false}
        />
    );
};

export default PendingRoomChargeList;
