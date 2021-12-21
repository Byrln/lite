import CustomTable from "components/common/custom-table";
import { RateSWR, RateAPI, listUrl } from "lib/api/rate";
// import NewEdit from "./new-edit";

const RateList = () => {
    const { data, error } = RateSWR();
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
        { title: "Rate", key: "BaseRate", dataIndex: "BaseRate" },
        {
            title: "Rate for Extra Adult",
            key: "ExtraAdult",
            dataIndex: "ExtraAdult",
        },
        {
            title: "Rate for Extra Child",
            key: "ExtraChild",
            dataIndex: "ExtraChild",
        },
    ];

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={RateAPI}
            id="RoomID"
            listUrl={listUrl}
            modalTitle="Үнэ"
            // modalContent={<NewEdit />}
        />
    );
};

export default RateList;
