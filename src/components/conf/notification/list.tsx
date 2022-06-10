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
        title: "Notification",
        key: "NotificationName",
        dataIndex: "NotificationName",
    },
    {
        title: "Description",
        key: "NotificationDescription",
        dataIndex: "NotificationDescription",
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
            hasUpdate={true}
            hasDelete={true}
            id="NotificationID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default NotificationList;
