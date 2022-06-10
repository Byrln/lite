import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { UserRoleSWR, UserRoleAPI, listUrl } from "lib/api/user-role";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Short Code",
        key: "UserRoleName",
        dataIndex: "UserRoleName",
    },
    {
        title: "User Role",
        key: "Description",
        dataIndex: "Description",
    },
    {
        title: "Description",
        key: "Description",
        dataIndex: "Description",
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
                    api={UserRoleAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const UserRoleList = ({ title }: any) => {
    const { data, error } = UserRoleSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={UserRoleAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="UserRoleID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default UserRoleList;
