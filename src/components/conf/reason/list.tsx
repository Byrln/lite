import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { ReasonSWR, ReasonAPI, listUrl } from "lib/api/reason";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Reason",
        key: "ReasonName",
        dataIndex: "ReasonName",
    },
    {
        title: "Category",
        key: "ReasonTypeName",
        dataIndex: "ReasonTypeName",
    },
    {
        title: "User Name",
        key: "UserName",
        dataIndex: "UserName",
    },
    {
        title: "Changed Date",
        key: "CreatedDate",
        dataIndex: "CreatedDate",
    },
    {
        title: "Ip Address",
        key: "IPAddress",
        dataIndex: "IPAddress",
    },
];

const ReasonList = ({ title }: any) => {
    const { data, error } = ReasonSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={ReasonAPI}
            hasNew={true}
            //hasUpdate={true}
            hasDelete={true}
            id="ReasonID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default ReasonList;
