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
        key: "GuestFullName",
        dataIndex: "GuestFullName",
    },
    {
        title: "Country",
        key: "CountryName",
        dataIndex: "CountryName",
    },
    {
        title: "Phone",
        key: "Phone",
        dataIndex: "Phone",
    },
    {
        title: "Mobile",
        key: "Mobile",
        dataIndex: "Mobile",
    },
    {
        title: "Email",
        key: "Email",
        dataIndex: "Email",
    },

    {
        title: "Vip Status",
        key: "VipStatusName",
        dataIndex: "VipStatusName",
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
