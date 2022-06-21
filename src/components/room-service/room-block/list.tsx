import CustomTable from "components/common/custom-table";
import { RoomBlockSWR, RoomBlockAPI, listUrl } from "lib/api/room-block";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Room",
        key: "Room",
        dataIndex: "Room",
    },
    {
        title: "Begin Date",
        key: "BeginDate",
        dataIndex: "BeginDate",
    },
    {
        title: "End Date",
        key: "EndDate",
        dataIndex: "EndDate",
    },
    {
        title: "Blocked On",
        key: "BlockedOn",
        dataIndex: "BlockedOn",
    },
    {
        title: "Blocked By",
        key: "BlockedBy",
        dataIndex: "BlockedBy",
    },
    {
        title: "Reason",
        key: "Reason",
        dataIndex: "Reason",
    },
];

const RoomBlockList = ({ title }: any) => {
    const { data, error } = RoomBlockSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={RoomBlockAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="RoomBlockID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default RoomBlockList;
