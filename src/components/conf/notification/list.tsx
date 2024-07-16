import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { useIntl } from "react-intl";
import {
    NotificationSWR,
    NotificationAPI,
    listUrl,
} from "lib/api/notification";
import NewEdit from "./new-edit";


const NotificationList = ({ title }: any) => {
    const intl = useIntl();
    const { data, error } = NotificationSWR();

    const columns = [
        {
            title: intl.formatMessage({id:"TextNotificationTypeID"}), 
            key: "NotificationTypeID",
            dataIndex: "NotificationTypeID",
        },
        {
            title: intl.formatMessage({id:"TextNotificationTypeName"}), 
            key: "NotificationTypeName",
            dataIndex: "NotificationTypeName",
        },
        {
            title: intl.formatMessage({id:"TextUserID"}), 
            key: "UserID",
            dataIndex: "UserID",
        },
        {
            title: intl.formatMessage({id:"RowHeaderUserName"}), 
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: intl.formatMessage({id:"Left_SortByStatus"}), 
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
