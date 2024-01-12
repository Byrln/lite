import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import {
    NotificationSWR,
    NotificationAPI,
    listUrl,
} from "lib/api/notification";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "NotificationTypeID",
        key: "NotificationTypeID",
        dataIndex: "NotificationTypeID",
    },
    {
        title: "NotificationTypeName",
        key: "NotificationTypeName",
        dataIndex: "NotificationTypeName",
    },
    {
        title: "UserID",
        key: "UserID",
        dataIndex: "UserID",
    },
    {
        title: "UserName",
        key: "UserName",
        dataIndex: "UserName",
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
                    api={NotificationAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const NotificationList = ({ title }: any) => {
    const { data, error } = NotificationSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={NotificationAPI}
            hasNew={true}
            id="NotificationID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
            datagrid={false}
        />
    );
};

export default NotificationList;
