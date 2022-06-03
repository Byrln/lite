import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { RoomSWR, RoomAPI, listUrl } from "lib/api/room";
import NewEdit from "./new-edit";

const columns = [
    { title: "RoomTypeID", key: "RoomTypeID", dataIndex: "RoomTypeID" },
    {
        title: "RoomTypeName",
        key: "RoomTypeName",
        dataIndex: "RoomTypeName",
    },
    { title: "RoomID", key: "RoomID", dataIndex: "RoomID" },
    { title: "RoomNo", key: "RoomNo", dataIndex: "RoomNo" },
    { title: "RoomPhone", key: "RoomPhone", dataIndex: "RoomPhone" },
    {
        title: "Status",
        key: "Status",
        dataIndex: "Status",
        render: function renderAction(id: any, checked: boolean) {
            return (
                <ToggleChecked
                    id={id}
                    checked={checked}
                    api={RoomAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
    { title: "FloorID", key: "FloorID", dataIndex: "FloorID" },
    { title: "FloorNo", key: "FloorNo", dataIndex: "FloorNo" },
];

const RoomList = ({ title }: any) => {
    const { data, error } = RoomSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={RoomAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="RoomID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default RoomList;
