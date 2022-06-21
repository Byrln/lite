import { format } from "date-fns";

import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import {
    GuestdatabaseSWR,
    GuestdatabaseAPI,
    listUrl,
} from "lib/api/guest-database";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Guest Name",
        key: "GuestName",
        dataIndex: "GuestName",
    },
    {
        title: "Country",
        key: "Country",
        dataIndex: "Country",
    },
    {
        title: "Phone",
        key: "Phone",
        dataIndex: "Phone",
    },
    {
        title: "Email",
        key: "Email",
        dataIndex: "Email",
    },

    {
        title: "Vip Status",
        key: "VipStatus",
        dataIndex: "VipStatus",
    },
];

const GuestdatabaseList = ({ title }: any) => {
    const { data, error } = GuestdatabaseSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={GuestdatabaseAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="GuestdatabaseID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default GuestdatabaseList;
