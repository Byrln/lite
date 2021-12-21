import CustomTable from "components/common/custom-table";
import { RoomStatusSWR, RoomStatusAPI, listUrl } from "lib/api/room-status";
// import NewEdit from "./new-edit";

const RoomStatusList = () => {
    const { data, error } = RoomStatusSWR();

    const columns = [
        {
            title: "Room Status",
            key: "StatusCode",
            dataIndex: "StatusCode",
        },
        {
            title: "Color",
            key: "StatusColor",
            dataIndex: "StatusColor",
        },
        { title: "Description", key: "Description", dataIndex: "Description" },
    ];

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={RoomStatusAPI}
            hasUpdate={true}
            id="RoomStatusID"
            listUrl={listUrl}
            modalTitle="Өрөөний төлөв"
            // modalContent={<NewEdit />}
        />
    );
};

export default RoomStatusList;
