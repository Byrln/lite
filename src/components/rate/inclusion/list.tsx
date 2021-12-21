import CustomTable from "components/common/custom-table";
import { ChargeTypeSWR, ChargeTypeAPI, listUrl } from "lib/api/charge-type";
// import NewEdit from "./new-edit";

const InclusionList = () => {
    const listType = "inclusion";
    const { data, error } = ChargeTypeSWR(listType);

    const columns = [
        {
            title: "Group Name",
            key: "RoomChargeTypeGroupName",
            dataIndex: "RoomChargeTypeGroupName",
        },
        {
            title: "Item Name",
            key: "RoomChargeTypeName",
            dataIndex: "RoomChargeTypeName",
        },
        {
            title: "Inclusion",
            key: "IsInclusion",
            dataIndex: "IsInclusion",
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
            id="RoomChargeTypeID"
            listUrl={listUrl}
            modalTitle="Нэмэлт тооцооны төрлүүд"
            // modalContent={<NewEdit />}
        />
    );
};

export default InclusionList;
