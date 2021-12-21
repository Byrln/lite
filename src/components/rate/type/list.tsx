import CustomTable from "components/common/custom-table";
import { RateTypeSWR, RateTypeAPI, listUrl } from "lib/api/rate-type";
// import NewEdit from "./new-edit";

const RateTypeList = () => {
    const { data, error } = RateTypeSWR();

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
        },

        { title: "Channel", key: "ChannelName", dataIndex: "ChannelName" },
        { title: "Status", key: "Status", dataIndex: "Status" },
    ];

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
            modalTitle="Үнийн төрөл"
            // modalContent={<NewEdit />}
        />
    );
};

export default RateTypeList;
