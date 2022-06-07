import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { ChargeTypeSWR, ChargeTypeAPI, listUrl } from "lib/api/charge-type";
import { formatPrice } from "lib/utils/helpers";
import NewEdit from "./new-edit";

const IsExtraCharge = true;
const IsMiniBar = false;
const IsDiscount = null;
const IsInclusion = null;
const columns = [
    {
        title: "Extra Charge Group",
        key: "RoomChargeTypeGroupName",
        dataIndex: "RoomChargeTypeGroupName",
    },

    {
        title: "Extra Charge",
        key: "RoomChargeTypeName",
        dataIndex: "RoomChargeTypeName",
    },
    {
        title: "Rate",
        key: "RoomChargeTypeRate",
        dataIndex: "RoomChargeTypeRate",
        render: function render(id: any, value: any) {
            return formatPrice(value);
        },
    },
    {
        title: "Editable",
        key: "IsEditable",
        dataIndex: "IsEditable",
        render: function render(id: any, value: any) {
            return <ToggleChecked id={id} checked={value} disabled={true} />;
        },
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
                    api={ChargeTypeAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const ExtraChargeList = ({ title }: any) => {
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
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="RoomChargeTypeID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default ExtraChargeList;
