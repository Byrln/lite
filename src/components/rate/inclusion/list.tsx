import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { ChargeTypeSWR, ChargeTypeAPI, listUrl } from "lib/api/charge-type";
// import NewEdit from "./new-edit";

const listType = "inclusion";
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
        render: function render(id: any, value: any) {
            return (
                <ToggleChecked
                    id={id}
                    checked={value}
                    api={ChargeTypeAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const InclusionList = () => {
    const { data, error } = ChargeTypeSWR(listType);

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
