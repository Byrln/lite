import { useContext } from "react";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useIntl } from "react-intl";
import CustomTable from "components/common/custom-table";
import { EmailSWR, EmailAPI, listUrl } from "lib/api/email-conf";
import NewEdit from "./new-edit";
import { ModalContext } from "lib/context/modal";
import ChangePassword from "./change-password";

const EmailList = ({ title }: any) => {
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);
    const { data, error } = EmailSWR();

    const columns = [
        {
            title: intl.formatMessage({id:"RowHeaderEmail"}), 
            key: "RowHeaderEmail",
            dataIndex: "RowHeaderEmail",
        },

        {
            title: intl.formatMessage({id:"RowHeaderEmailServer"}), 
            key: "RowHeaderEmailServer",
            dataIndex: "RowHeaderEmailServer",
        },
        {
            title: intl.formatMessage({id:"RowHeaderPort"}), 
            key: "RowHeaderPort",
            dataIndex: "RowHeaderPort",
        },

        {
            title: intl.formatMessage({id:"RowHeaderUserName"}), 
            key: "RowHeaderUserName",
            dataIndex: "RowHeaderUserName",
        },
        {
            title: intl.formatMessage({id:"TextMain"}), 
            key: "TextMain",
            dataIndex: "TextMain",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return element.row.IsMain && "";
            },
        },
        {
            title: intl.formatMessage({id:"TextChangePassword"}), 
            key: "TextChangePassword",
            dataIndex: "TextChangePassword",
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
                        {intl.formatMessage({id:"ButtonReplace"}) }
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
