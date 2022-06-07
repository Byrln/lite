import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { ChargeTypeSWR, ChargeTypeAPI, listUrl } from "lib/api/charge-type";

const IsExtraCharge = true;
const IsMiniBar = null;
const IsDiscount = null;
const IsInclusion = null;
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
                    apiUrl="Update"
                    mutateUrl={`${listUrl}`}
                    toggleKey="IsInclusion"
                />
            );
        },
    },
];

const InclusionList = () => {
    const { data, error } = ChargeTypeSWR(
        IsExtraCharge,
        IsMiniBar,
        IsDiscount,
        IsInclusion
    );

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={ChargeTypeAPI}
            id="RoomChargeTypeID"
            listUrl={listUrl}
            modalTitle="Нэмэлт тооцооны төрлүүд"
        />
    );
};

export default InclusionList;
