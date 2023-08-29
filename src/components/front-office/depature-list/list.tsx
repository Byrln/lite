import { format } from "date-fns";

import CustomTable from "components/common/custom-table";
import { DepartureSWR, ReservationAPI, listUrl } from "lib/api/reservation";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Res No",
        key: "ReservationNo",
        dataIndex: "ReservationNo",
    },
    {
        title: "Arrival",
        key: "ArrivalDate",
        dataIndex: "ArrivalDate",
    },
    {
        title: "Departure",
        key: "DepartureDate",
        dataIndex: "DepartureDate",
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
        title: "company",
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
        key: "CurrentBalance",
        dataIndex: "CurrentBalance",
    },
    {
        title: "ResType",
        key: "ReservationTypeName",
        dataIndex: "ReservationTypeName",
    },
    {
        title: "User",
        key: "UserName",
        dataIndex: "UserName",
    },
];

const DeparturedListList = ({ title }: any) => {
    const { data, error } = DepartureSWR(1);

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={ReservationAPI}
            hasNew={false}
            hasUpdate={false}
            hasDelete={false}
            id="DeparturedListID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default DeparturedListList;
