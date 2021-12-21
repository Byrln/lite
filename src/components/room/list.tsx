import CustomTable from "components/common/custom-table";
import { RoomSWR, RoomAPI, listUrl } from "lib/api/room";
import NewEdit from "./new-edit";

const RoomList = () => {
    const { data, error } = RoomSWR();
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
        { title: "Status", key: "Status", dataIndex: "Status" },
        { title: "FloorID", key: "FloorID", dataIndex: "FloorID" },
        { title: "FloorNo", key: "FloorNo", dataIndex: "FloorNo" },
    ];

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
            modalTitle="Өрөө"
            modalContent={<NewEdit />}
        />
    );
};

export default RoomList;
