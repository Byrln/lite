import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { PosApiSWR, PosApiAPI, listUrl } from "lib/api/pos-api";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Registry No",
        key: "PosApiName",
        dataIndex: "PosApiName",
    },
    {
        title: "Company name",
        key: "PosApiDescription",
        dataIndex: "PosApiDescription",
    },
    {
        title: "branch No",
        key: "PosApiDescription",
        dataIndex: "PosApiDescription",
    },
    {
        title: "District",
        key: "PosApiDescription",
        dataIndex: "PosApiDescription",
    },
    {
        title: "VAT Payer",
        key: "ShowWarning",
        dataIndex: "ShowWarning",
        render: function render(id: any, value: any) {
            return <ToggleChecked id={id} checked={value} disabled={true} />;
        },
    },
    {
        title: "City tax Payer",
        key: "ShowWarning",
        dataIndex: "ShowWarning",
        render: function render(id: any, value: any) {
            return <ToggleChecked id={id} checked={value} disabled={true} />;
        },
    },
    {
        title: "Status",
        key: "Status",
        dataIndex: "Status",
        render: function render(id: any, value: any) {
            return (
                <ToggleChecked
                    id={id}
                    checked={value}
                    api={PosApiAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const PosApiList = ({ title }: any) => {
    const { data, error } = PosApiSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={PosApiAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="PosApiID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default PosApiList;
