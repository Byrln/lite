import { format } from "date-fns";

import CustomTable from "components/common/custom-table";
import { PromotionSWR, PromotionAPI, listUrl } from "lib/api/promotion";
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
                format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy")
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
                format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy")
            );
        },
    },
    {
        title: "Available On",
        key: "AvailableOn",
        dataIndex: "AvailableOn",
        render: function render(id: any, value: any) {
            return value === 1
                ? "Өдөр бүр"
                : value === 2
                ? "Эхний өдөр"
                : value === 3
                ? "Сүүлийн өдөр"
                : "";
        },
    },
    {
        title: "Week Days Enabled",
        key: "WeekDaysEnabled",
        dataIndex: "WeekDaysEnabled",
        render: function render(id: any, value: any) {
            return value ? "долоо хоногийн үнэ" : "энгийн";
        },
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
