import { format } from "date-fns";

import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import {
    ReservationSourceSWR,
    ReservationSourceAPI,
    listUrl,
} from "lib/api/reservation-source";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Reservation Source",
        key: "ReservationSourceName",
        dataIndex: "ReservationSourceName",
    },
    {
        title: "Channel",
        key: "ChannelName",
        dataIndex: "ChannelName",
    },
    {
        title: "User Name",
        key: "UserName",
        dataIndex: "UserName",
    },
    {
        title: "Changed Date",
        key: "CreatedDate",
        dataIndex: "CreatedDate",
        render: function render(id: any, value: any) {
            return (
                value &&
                format(
                    new Date(value.replace(/ /g, "T")),
                    "MM/dd/yyyy hh:mm:ss a"
                )
            );
        },
    },
    {
        title: "IP Address",
        key: "IPAddress",
        dataIndex: "IPAddress",
    },
    {
        title: "Status",
        key: "Status",
        dataIndex: "Status",
        render: function render(id: any, value: any) {
            return (
                <ToggleChecked
                    id={id}
                    checked={value}
                    api={ReservationSourceAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const ReservationSourceList = ({ title }: any) => {
    const { data, error } = ReservationSourceSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={ReservationSourceAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="ReservationSourceID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default ReservationSourceList;
