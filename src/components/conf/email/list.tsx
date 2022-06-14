import { useContext } from "react";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import CustomTable from "components/common/custom-table";
import { EmailSWR, EmailAPI, listUrl } from "lib/api/email-conf";
import NewEdit from "./new-edit";
import { ModalContext } from "lib/context/modal";
import ChangePassword from "./change-password";

const EmailList = ({ title }: any) => {
    const { handleModal }: any = useContext(ModalContext);
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
            render: function render(id: any, value: any) {
                return value && "Main";
            },
        },
        {
            title: "Change Password",
            key: "ChangePassword",
            dataIndex: "ChangePassword",
            render: function render(id: any, value: any) {
                return (
                    <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        startIcon={<EditIcon />}
                        onClick={() => {
                            handleModal(
                                true,
                                `Нууц үг өөрчлөх`,
                                <ChangePassword id={id} />
                            );
                        }}
                    >
                        Солих
                    </Button>
                );
            },
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
            hasDelete={true}
            id="EmailID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default EmailList;
