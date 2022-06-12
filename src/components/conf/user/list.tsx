import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { UserSWR, UserAPI, listUrl } from "lib/api/user";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "User Name",
        key: "UserName",
        dataIndex: "UserName",
    },
    {
        title: "Login Name",
        key: "LoginName",
        dataIndex: "LoginName",
    },
    {
        title: "User Role",
        key: "UserRoleName",
        dataIndex: "UserRoleName",
    },
    {
        title: "Language",
        key: "Language",
        dataIndex: "Language",
    },
    {
        title: "Email",
        key: "Email",
        dataIndex: "Email",
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
                    api={UserAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const UserList = ({ title }: any) => {
    const { data, error } = UserSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={UserAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="UserID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default UserList;
