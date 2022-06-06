import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { RateTypeSWR, RateTypeAPI, listUrl } from "lib/api/rate-type";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Rate Type",
        key: "RateTypeName",
        dataIndex: "RateTypeName",
    },
    {
        title: "Breakfast Included",
        key: "BreakfastIncluded",
        dataIndex: "BreakfastIncluded",
        render: function render(id: any, value: boolean) {
            return <ToggleChecked id={id} checked={value} disabled={true} />;
        },
    },
    { title: "Channel", key: "ChannelName", dataIndex: "ChannelName" },
    {
        title: "Status",
        key: "Status",
        dataIndex: "Status",
        render: function render(id: any, value: boolean) {
            return (
                <ToggleChecked
                    id={id}
                    checked={value}
                    api={RateTypeAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const RateTypeList = ({ title }: any) => {
    const { data, error } = RateTypeSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={RateTypeAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="RateTypeID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default RateTypeList;
