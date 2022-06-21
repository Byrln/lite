import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { PromotionSWR, PromotionAPI, listUrl } from "lib/api/promotion";
import { format } from "path";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Promotion Code",
        key: "PromotionCode",
        dataIndex: "PromotionCode",
    },
    {
        title: "Begin Date",
        key: "BeginDate",
        dataIndex: "BeginDate",
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
        title: "End Date",
        key: "EndDate",
        dataIndex: "EndDate",
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
        title: "Available On",
        key: "AvailableOn",
        dataIndex: "AvailableOn",
    },
    {
        title: "Status",
        key: "Status",
        dataIndex: "Status",
    },
];

const PromotionList = ({ title }: any) => {
    const { data, error } = PromotionSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={PromotionAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="PromotionID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default PromotionList;
