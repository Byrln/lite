// import { format } from "date-fns";
import { useState } from "react";

import CustomTable from "components/common/custom-table";
import CustomSearch from "components/common/custom-search";

import { ReservationSWR, ReservationAPI, listUrl } from "lib/api/reservation";
import NewEdit from "components/reservation/new-edit";
import Search from "./search";

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

const initialState = {
    ReservationTypeID: 1,
};

const DeparturedListList = ({ title }: any) => {
    const [search, setSearch] = useState(null);

    const { data, error } = ReservationSWR(search ? search : initialState);

    return (
        <>
            {/* <CustomSearch
                listUrl={listUrl}
                search={search}
                setSearch={setSearch}
            >
                <Search />
            </CustomSearch> */}

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
        </>
    );
};

export default DeparturedListList;
