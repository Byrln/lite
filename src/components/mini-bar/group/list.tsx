import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import {
    ChargeTypeGroupSWR,
    ChargeTypeGroupAPI,
    listUrl,
} from "lib/api/charge-type-group";
import NewEdit from "./new-edit";

const IsRoomCharge = false;
const IsExtraCharge = true;
const IsMiniBar = true;
const IsDiscount = false;
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
        render: function render(id: any, value: any) {
            return (
                <ToggleChecked
                    id={id}
                    checked={value}
                    api={ChargeTypeGroupAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const MiniBarGroupList = ({ title }: any) => {
    const { data, error } = ChargeTypeGroupSWR(
        IsRoomCharge,
        IsExtraCharge,
        IsMiniBar,
        IsDiscount
    );

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
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default MiniBarGroupList;
