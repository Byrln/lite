import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import {
    ChargeTypeGroupSWR,
    ChargeTypeGroupAPI,
    listUrl,
} from "lib/api/charge-type-group";
import NewEdit from "./new-edit";

const listType = "miniBar";
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
        render: function renderAction(id: any, checked: boolean) {
            return (
                <ToggleChecked
                    id={id}
                    checked={checked}
                    api={ChargeTypeGroupAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const MiniBarGroupList = ({ title }: any) => {
    const { data, error } = ChargeTypeGroupSWR(listType);

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
            excelName={title}
        />
    );
};

export default MiniBarGroupList;
