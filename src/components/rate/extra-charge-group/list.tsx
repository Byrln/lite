import CustomTable from "components/common/custom-table";
import {
    ChargeTypeGroupSWR,
    ChargeTypeGroupAPI,
    listUrl,
} from "lib/api/charge-type-group";
import NewEdit from "./new-edit";

const ExtraChargeGroupList = () => {
    const listType = "extraCharge";
    const { data, error } = ChargeTypeGroupSWR(listType);

    const columns = [
        {
            title: "Group Name",
            key: "RoomChargeTypeGroupName",
            dataIndex: "RoomChargeTypeGroupName",
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
            api={ChargeTypeGroupAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="RoomChargeTypeGroupID"
            listUrl={listUrl}
            modalTitle="Нэмэлт тооцооны бүлгүүд"
            modalContent={<NewEdit />}
        />
    );
};

export default ExtraChargeGroupList;
