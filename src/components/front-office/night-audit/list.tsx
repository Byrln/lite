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
        key: "GuestName",
        dataIndex: "GuestName",
    },
    {
        title: "Room",
        key: "RoomFullName",
        dataIndex: "RoomFullName",
    },
    {
        title: "Rate Type",
        key: "RateTypeName",
        dataIndex: "RateTypeName",
    },
    {
        title: "Reservation  Type",
        key: "ReservationTypeName",
        dataIndex: "ReservationTypeName",
    },
    {
        title: "Departure",
        key: "DepartureDate",
        dataIndex: "DepartureDate",
    },
    {
        title: "Total",
        key: "TotalAmount",
        dataIndex: "TotalAmount",
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
