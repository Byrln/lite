import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { VipStatusSWR, VipStatusAPI, listUrl } from "lib/api/vip-status";
import NewEdit from "./new-edit";
import { useIntl } from "react-intl";


const VipStatusList = ({ title }: any) => {
    const intl = useIntl();
    const { data, error } = VipStatusSWR();
    const columns = [
        {
            title: intl.formatMessage({id:"VipStatusName"}), 
            key: "VipStatusName",
            dataIndex: "VipStatusName",
        },
        {
            title: intl.formatMessage({id:"VipStatusDescription"}), 
            key: "VipStatusDescription",
            dataIndex: "VipStatusDescription",
        },
        {
            title: intl.formatMessage({id:"RowHeaderShowWarning"}), 
            key: "RowHeaderShowWarning",
            dataIndex: "RowHeaderShowWarning",
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
            title: intl.formatMessage({id:"ReportStatus"}), 
            key: "ReportStatus",
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
