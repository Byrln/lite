import CustomTable from "components/common/custom-table";
import { RateSWR } from "lib/api/rate";
import { formatPrice } from "lib/utils/helpers";

const columns = [
    {
        title: "Rate Type",
        key: "RateTypeName",
        dataIndex: "RateTypeName",
    },
    {
        title: "Room Type",
        key: "RoomTypeName",
        dataIndex: "RoomTypeName",
    },
    { title: "Season", key: "SeasonName", dataIndex: "SeasonName" },
    { title: "Res. Source", key: "SourceName", dataIndex: "SourceName" },
    {
        title: "Company",
        key: "CustomerName",
        dataIndex: "CustomerName",
    },
    {
        title: "Company",
        key: "DurationName",
        dataIndex: "DurationName",
    },
    {
        title: "Rate",
        key: "BaseRate",
        dataIndex: "BaseRate",
        render: function render(id: any, value: boolean) {
            return formatPrice(value);
        },
    },
    {
        title: "Rate for Extra Adult",
        key: "ExtraAdult",
        dataIndex: "ExtraAdult",
        render: function render(id: any, value: boolean) {
            return formatPrice(value);
        },
    },
    {
        title: "Rate for Extra Child",
        key: "ExtraChild",
        dataIndex: "ExtraChild",
        render: function render(id: any, value: boolean) {
            return formatPrice(value);
        },
    },
];

const RateList = ({ title }: any) => {
    const { data, error } = RateSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            modalTitle={title}
            excelName={title}
        />
    );
};

export default RateList;
