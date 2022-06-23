import CustomTable from "components/common/custom-table";
import { NightAuditSWR, NightAuditAPI, listUrl } from "lib/api/night-audit";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Reservation No",
        key: "ReservationNo",
        dataIndex: "ReservationNo",
    },
    {
        title: "Guest",
        key: "Guest",
        dataIndex: "Guest",
    },
    {
        title: "Room",
        key: "Room",
        dataIndex: "Room",
    },
    {
        title: "Rate Type",
        key: "RateType",
        dataIndex: "RateType",
    },
    {
        title: "Reservation  Type",
        key: "ReservationType",
        dataIndex: "ReservationType",
    },
    {
        title: "Departure",
        key: "Departure",
        dataIndex: "Departure",
    },
    {
        title: "Total",
        key: "Total",
        dataIndex: "Total",
    },
    {
        title: "Deposit",
        key: "Deposit",
        dataIndex: "Deposit",
    },
];

const NightAuditList = ({ title }: any) => {
    const { data, error } = NightAuditSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={NightAuditAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="NightAuditID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default NightAuditList;
