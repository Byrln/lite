import CustomTable from "components/common/custom-table";
import {
    CompanyDatabaseSWR,
    CompanyDatabaseAPI,
    listUrl,
} from "lib/api/company-database";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Company Name",
        key: "CompanyName",
        dataIndex: "CompanyName",
    },
    {
        title: "Group Name",
        key: "GroupName",
        dataIndex: "GroupName",
    },
    {
        title: "Registry No",
        key: "RegistryNo",
        dataIndex: "Registry No",
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
        title: "City",
        key: "City",
        dataIndex: "City",
    },
    {
        title: "Country",
        key: "Country",
        dataIndex: "Country",
    },
];

const CompanyDatabaseList = ({ title }: any) => {
    const { data, error } = CompanyDatabaseSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={CompanyDatabaseAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="CompanyDatabaseID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default CompanyDatabaseList;
