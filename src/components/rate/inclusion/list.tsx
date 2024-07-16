import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { ChargeTypeSWR, ChargeTypeAPI, listUrl } from "lib/api/charge-type";
import { useIntl } from "react-intl";
const IsExtraCharge = true;
const IsMiniBar = null;
const IsDiscount = null;
const IsInclusion = null;

const InclusionList = () => {
    const intl = useIntl();
    const columns = [
        {
            title: intl.formatMessage({id:"RowHeaderGroupName"}), 
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
    
    const { data, error } = ChargeTypeSWR({
        IsExtraCharge: IsExtraCharge,
        IsMiniBar: IsMiniBar,
        IsDiscount: IsDiscount,
        IsInclusion: IsInclusion,
    });

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={ChargeTypeAPI}
            id="RoomChargeTypeID"
            listUrl={listUrl}
            modalTitle="Нэмэлт үйлчилгээ"
        />
    );
};

export default InclusionList;
