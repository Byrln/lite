import { GuestRemarkSWR, listUrl, RemarkAPI } from "lib/api/remarks";
import { useAppState } from "lib/context/app";
import CustomTable from "components/common/custom-table";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Remarks",
        key: "Remarks",
        dataIndex: "Remarks",
    },
    {
        title: "UserName",
        key: "UserName",
        dataIndex: "UserName",
    },
    {
        title: "Created Date",
        key: "CreatedDate",
        dataIndex: "CreatedDate",
    },
];

const GuestHistory = ({ title }: any) => {
    const [state]: any = useAppState();

    const { data, error } = GuestRemarkSWR(state.editId);

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={RemarkAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="RemarkID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default GuestHistory;
