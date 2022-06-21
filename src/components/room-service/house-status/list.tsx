import CustomTable from "components/common/custom-table";
import { HouseStatusSWR, HouseStatusAPI, listUrl } from "lib/api/house-status";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Room",
        key: "Room",
        dataIndex: "Room",
    },
    {
        title: "Room Type",
        key: "RoomType",
        dataIndex: "RoomType",
    },
    {
        title: "House Status",
        key: "HouseStatus",
        dataIndex: "HouseStatus",
    },
    {
        title: "Room Status",
        key: "RoomStatus",
        dataIndex: "RoomStatus",
    },
    {
        title: "HouseKeeper",
        key: "HouseKeeper",
        dataIndex: "HouseKeeper",
    },
];

const HouseStatusList = ({ title }: any) => {
    const { data, error } = HouseStatusSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={HouseStatusAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="HouseStatusID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default HouseStatusList;
