import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { VipStatusSWR, VipStatusAPI, listUrl } from "lib/api/vip-status";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "ВИП төрөл",
        key: "VipStatusName",
        dataIndex: "VipStatusName",
    },
    {
        title: "Тайлбар",
        key: "VipStatusDescription",
        dataIndex: "VipStatusDescription",
    },
    {
        title: "Анхааруулга харуулах",
        key: "ShowWarning",
        dataIndex: "ShowWarning",
        excelRenderPass: true,
        renderCell: (element: any) => {
            return (
                <ToggleChecked
                    id={element.id}
                    checked={element.row.ShowWarning}
                    disabled={true}
                />
            );
        },
    },
    {
        title: "Төлөв",
        key: "Status",
        excelRenderPass: true,
        renderCell: (element: any) => {
            return (
                <ToggleChecked
                    id={element.id}
                    checked={element.row.Status}
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
