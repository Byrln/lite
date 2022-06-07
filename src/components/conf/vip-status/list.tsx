import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { VipStatusSWR, VipStatusAPI, listUrl } from "lib/api/vip-status";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Vip Status",
        key: "VipStatusName",
        dataIndex: "VipStatusName",
    },
    {
        title: "Description",
        key: "VipStatusDescription",
        dataIndex: "VipStatusDescription",
    },
    {
        title: "Show Warning",
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
                    api={VipStatusAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const VipStatusList = ({ title }: any) => {
    const { data, error } = VipStatusSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={VipStatusAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="VipStatusID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default VipStatusList;
