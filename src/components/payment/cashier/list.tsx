import CustomTable from "components/common/custom-table";
import { NightAuditSWR, NightAuditAPI, listUrl } from "lib/api/night-audit";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Хураангуй",
        key: "Summary",
        dataIndex: "Summary",
    },
    {
        title: "Гүйлгээний тоо",
        key: "Transactions",
        dataIndex: "Transactions",
    },
    {
        title: "Дүн",
        key: "Amount",
        dataIndex: "Amount",
    },
    {
        title: "Дүн",
        key: "Amount",
        dataIndex: "Amount",
    },
];

const NightAuditList = ({ title }: any) => {
    const { data, error } = NightAuditSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={NightAuditAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="NightAuditID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default NightAuditList;
