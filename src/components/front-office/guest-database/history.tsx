import CustomTable from "components/common/custom-table";
import {
    GuestHistorySWR,
    GuestdatabaseAPI,
    listUrl,
} from "lib/api/guest-database";
import NewEdit from "./new-edit";
import { useAppState } from "lib/context/app";

const columns = [
    {
        title: "Arrived",
        key: "ArrivedDate",
        dataIndex: "ArrivedDate",
    },
    {
        title: "Departed",
        key: "DepartedDate",
        dataIndex: "DepartedDate",
    },
    {
        title: "Check In",
        key: "RegNo",
        dataIndex: "RegNo",
    },
    {
        title: "Room",
        key: "RoomFullName",
        dataIndex: "RoomFullName",
    },
    {
        title: "Paid",
        key: "Paid",
        dataIndex: "Paid",
    },

    {
        title: "Status",
        key: "StatusCode",
        dataIndex: "StatusCode",
    },
    {
        title: "User",
        key: "UserName",
        dataIndex: "UserName",
    },
];

const GuestHistory = ({ title }: any) => {
    const [state]: any = useAppState();

    const { data, error } = GuestHistorySWR(state.editId);

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={GuestdatabaseAPI}
            // hasNew={true}
            // hasUpdate={true}
            //hasDelete={true}
            id="TransactionID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default GuestHistory;
