import CustomTable from "components/common/custom-table";
import {
    InHouseGroupSWR,
    InHouseGroupAPI,
    listUrl,
} from "lib/api/in-house-group";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Group Code",
        key: "GroupCode",
        dataIndex: "GroupCode",
    },
    {
        title: "Color",
        key: "Color",
        dataIndex: "Color",
    },
    {
        title: "Res. Source",
        key: "ResSource",
        dataIndex: "ResSource",
    },
    {
        title: "Company",
        key: "Company",
        dataIndex: "Company",
    },
    {
        title: "Room",
        key: "Room",
        dataIndex: "Room",
    },
    {
        title: "Pax",
        key: "Pax",
        dataIndex: "Pax",
    },
    {
        title: "Arrival",
        key: "Arrival",
        dataIndex: "Arrival",
    },
    {
        title: "Departure",
        key: "Departure",
        dataIndex: "Departure",
    },
    {
        title: "Guide",
        key: "Guide",
        dataIndex: "Guide",
    },
    {
        title: "Total",
        key: "Total",
        dataIndex: "Total",
    },
    {
        title: "Paid",
        key: "Paid",
        dataIndex: "Paid",
    },
    {
        title: "User",
        key: "User",
        dataIndex: "User",
    },
];

const InHouseGroupList = ({ title }: any) => {
    const { data, error } = InHouseGroupSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={InHouseGroupAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="InHouseGroupID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default InHouseGroupList;
