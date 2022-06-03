import CustomTable from "components/common/custom-table";
import { EmailSWR, EmailAPI, listUrl } from "lib/api/email-conf";
import NewEdit from "./new-edit";

const EmailList = () => {
    const { data, error } = EmailSWR();

    const columns = [
        {
            title: "Email",
            key: "Email",
            dataIndex: "Email",
        },

        {
            title: "Email Server",
            key: "EmailHost",
            dataIndex: "EmailHost",
        },
        {
            title: "Port",
            key: "Port",
            dataIndex: "Port",
        },

        {
            title: "User Name",
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: "Main",
            key: "IsMain",
            dataIndex: "IsMain",
        },
    ];

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={EmailAPI}
            hasNew={true}
            hasUpdate={true}
            id="EmailID"
            listUrl={listUrl}
            modalTitle="И-мэйл"
            modalContent={<NewEdit />}
        />
    );
};

export default EmailList;
