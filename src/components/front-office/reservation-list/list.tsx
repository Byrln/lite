import { format } from "date-fns";

import CustomTable from "components/common/custom-table";
import { ReservationSWR, ReservationAPI, listUrl } from "lib/api/reservation";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Start Date",
        key: "ReservationID",
        dataIndex: "ReservationID",
    },
    {
        title: "End Date",
        key: "ArrivalDate",
        dataIndex: "ArrivalDate",
    },
    {
        title: "Company",
        key: "DepartureDate",
        dataIndex: "DepartureDate",
    },
    {
        title: "Name",
        key: "GuestName",
        dataIndex: "GuestName",
    },
    {
        title: "Phone",
        key: "RoomFullName",
        dataIndex: "RoomFullName",
    },
    {
        title: "Email",
        key: "CustomerName",
        dataIndex: "CustomerName",
    },
    {
        title: "Reservation Type",
        key: "TotalAmount",
        dataIndex: "TotalAmount",
    },
    {
        title: "Reservation Source",
        key: "CurrentBalance",
        dataIndex: "CurrentBalance",
    },
];

const DeparturedListList = ({ title }: any) => {
    const { data, error } = ReservationSWR(1);

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={ReservationAPI}
            //hasNew={true}
            //hasUpdate={true}
            //hasDelete={true}
            id="DeparturedListID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default DeparturedListList;
