import CustomTable from "components/common/custom-table";
import {
    HouseKeepingRoomSWR,
    HouseKeepingAPI,
    listRoomUrl,
} from "lib/api/house-keeping";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Room",
        key: "RoomNo",
        dataIndex: "RoomNo",
    },
    {
        title: "Room Type",
        key: "RoomTypeName",
        dataIndex: "RoomTypeName",
    },
    {
        title: "House Status",
        key: "HKSDescription",
        dataIndex: "HKSDescription",
    },
    {
        title: "Room Status",
        key: "RSDescription",
        dataIndex: "RSDescription",
    },
    {
        title: "HouseKeeper",
        key: "HKUserName",
        dataIndex: "HKUserName",
    },
];

const HouseStatusList = ({ title }: any) => {
    const { data, error } = HouseKeepingRoomSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={HouseKeepingAPI}
            id="HouseStatusID"
            listUrl={listRoomUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default HouseStatusList;
