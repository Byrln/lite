import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { RoomTypeSWR, RoomTypeAPI, listUrl } from "lib/api/room-type";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Short Name",
        key: "RoomTypeShortName",
        dataIndex: "RoomTypeShortName",
    },
    {
        title: "Room Type",
        key: "RoomTypeName",
        dataIndex: "RoomTypeName",
    },
    { title: "Base (A/C)", key: "BaseAC", dataIndex: "BaseAC" },
    { title: "Max (A/C)", key: "MaxAC", dataIndex: "MaxAC" },
    {
        title: "Status",
        key: "Status",
        dataIndex: "Status",
        render: function renderAction(id: any, checked: boolean) {
            return (
                <ToggleChecked
                    id={id}
                    checked={checked}
                    api={RoomTypeAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const RoomTypeList = ({ title }: any) => {
    const { data, error } = RoomTypeSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={RoomTypeAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="RoomTypeID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default RoomTypeList;
