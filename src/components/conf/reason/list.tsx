import { format } from "date-fns";

import CustomTable from "components/common/custom-table";
import { ReasonSWR, ReasonAPI, listUrl } from "lib/api/reason";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "reason",
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
        render: function render(id: any, value: any) {
            return (
                value &&
                format(
                    new Date(value.replace(/ /g, "T")),
                    "MM/dd/yyyy hh:mm:ss a"
                )
            );
        },
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
