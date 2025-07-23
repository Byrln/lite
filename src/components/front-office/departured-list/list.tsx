import { format } from "date-fns";

import CustomTable from "components/common/custom-table";
import { DepartedListSWR, ReservationAPI, listUrl } from "lib/api/reservation";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Check In",
        key: "CheckIn",
        dataIndex: "CheckIn",
    },
    {
        title: "Arrival",
        key: "ArrivalDate",
        dataIndex: "ArrivalDate",
        render: function render(id: any, value: any) {
            return (value && format(
                new Date(value.replace(/ /g, "T")),
                "MM/dd/yyyy hh:mm:ss a"
            ));
        },
    },
    {
        title: "Departure",
        key: "DepartureDate",
        dataIndex: "DepartureDate",
        render: function render(id: any, value: any) {
            return (value && format(
                new Date(value.replace(/ /g, "T")),
                "MM/dd/yyyy hh:mm:ss a"
            ));
        },
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
        title: "Company",
        key: "CustomerName",
        dataIndex: "CustomerName",
    },
    {
        title: "Total",
        key: "TotalAmount",
        dataIndex: "TotalAmount",
    },
    {
        title: "Paid",
        key: "Deposit",
        dataIndex: "Deposit",
    },
    {
        title: "Balance",
        key: "CurrentBalance",
        dataIndex: "CurrentBalance",
    },
    {
        title: "User",
        key: "UserName",
        dataIndex: "UserName",
    },
];

const DeparturedListList = ({ title }: any) => {
    const { data, error } = DepartedListSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={ReservationAPI}
            hasNew={true}
            hasUpdate={true}
            //hasDelete={true}
            id="TransactionID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default DeparturedListList;
