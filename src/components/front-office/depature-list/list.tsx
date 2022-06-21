import { format } from "date-fns";

import CustomTable from "components/common/custom-table";
import {
    DeparturedListSWR,
    DeparturedListAPI,
    listUrl,
} from "lib/api/departured-list";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Res. No",
        key: "Res.No",
        dataIndex: "Res.No",
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
        title: "Guest",
        key: "Guest",
        dataIndex: "Guest",
    },
    {
        title: "Room",
        key: "Room",
        dataIndex: "Room",
    },
    {
        title: "company",
        key: "company",
        dataIndex: "company",
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
        title: "Res. Type",
        key: "Res.Type",
        dataIndex: "Res.Type",
    },
    {
        title: "User",
        key: "User",
        dataIndex: "User",
    },
];

const DeparturedListList = ({ title }: any) => {
    const { data, error } = DeparturedListSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={DeparturedListAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="DeparturedListID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default DeparturedListList;
