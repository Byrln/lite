import { useIntl } from "react-intl";

import { GuestRemarkSWR, listUrl, RemarkAPI } from "lib/api/remarks";
import { useAppState } from "lib/context/app";
import CustomTable from "components/common/custom-table";
import NewEdit from "./new-edit";

const GuestHistory = ({ title }: any) => {
    const intl = useIntl();

    const [state]: any = useAppState();

    const { data, error } = GuestRemarkSWR(state.editId);

    const columns = [
        {
            title: intl.formatMessage({
                id: "RowHeaderRemarks",
            }),
            key: "Remarks",
            dataIndex: "Remarks",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderUserName",
            }),
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: intl.formatMessage({
                id: "ReportDate",
            }),
            key: "CreatedDate",
            dataIndex: "CreatedDate",
        },
    ];

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={RemarkAPI}
                hasNew={false}
                hasUpdate={false}
                hasDelete={false}
                id="RemarkID"
                listUrl={listUrl}
                modalTitle={title}
                excelName={title}
            />
            <br />
            <NewEdit />
        </>
    );
};

export default GuestHistory;
