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
            title: "Цах.шуудан",
            key: "Email",
            dataIndex: "Email",
        },

        {
            title: "И-мэйлийн сервер",
            key: "EmailHost",
            dataIndex: "EmailHost",
        },
        {
            title: "Порт",
            key: "Port",
            dataIndex: "Port",
        },

        {
            title: "Хэрэглэгчин нэр",
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: "Үндсэн",
            key: "IsMain",
            dataIndex: "IsMain",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return element.row.IsMain && "Үндсэн";
            },
        },
        {
            title: "Нууц үг өөрчлөх",
            key: "ChangePassword",
            dataIndex: "ChangePassword",
            excelRenderPass: true,
            renderCell: (element: any) => {
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
                                <ChangePassword id={element.id} />
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
