import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import {
    CustomerGroupSWR,
    CustomerGroupAPI,
    listUrl,
} from "lib/api/customer-group";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Group Name",
        key: "CustomerGroupName",
        dataIndex: "CustomerGroupName",
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
                    api={CustomerGroupAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const CustomerGroupList = ({ title }: any) => {
    const { data, error } = CustomerGroupSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={CustomerGroupAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="CustomerGroupID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default CustomerGroupList;
