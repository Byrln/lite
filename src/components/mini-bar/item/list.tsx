import CustomTable from "components/common/custom-table";
import { ChargeTypeSWR, ChargeTypeAPI, listUrl } from "lib/api/charge-type";
import NewEdit from "./new-edit";

const MiniBarItemList = () => {
    const listType = "miniBar";
    const { data, error } = ChargeTypeSWR(listType);

    const columns = [
        {
            title: "Mini Bar Group",
            key: "RoomChargeTypeGroupName",
            dataIndex: "RoomChargeTypeGroupName",
        },

        {
            title: "Mini Bar Item",
            key: "RoomChargeTypeName",
            dataIndex: "RoomChargeTypeName",
        },
        {
            title: "Rate",
            key: "RoomChargeTypeRate",
            dataIndex: "RoomChargeTypeRate",
        },

        {
            title: "Sort Order",
            key: "SortOrder",
            dataIndex: "SortOrder",
        },
        {
            title: "Status",
            key: "Status",
            dataIndex: "Status",
        },
    ];

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={ChargeTypeAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="RoomChargeTypeID"
            listUrl={listUrl}
            modalTitle="Нэмэлт тооцооны төрлүүд"
            modalContent={<NewEdit />}
        />
    );
};

export default MiniBarItemList;
