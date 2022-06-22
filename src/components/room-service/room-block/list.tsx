import CustomTable from "components/common/custom-table";
import { RoomBlockSWR, RoomBlockAPI, listUrl } from "lib/api/room-block";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Room",
        key: "RoomFullName",
        dataIndex: "RoomFullName",
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
        key: "CreatedDate",
        dataIndex: "CreatedDate",
    },
    {
        title: "Blocked By",
        key: "UserName",
        dataIndex: "UserName",
    },
    {
        title: "Reason",
        key: "Description",
        dataIndex: "Description",
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
            //hasNew={true}
            //hasUpdate={true}
            //hasDelete={true}
            id="RoomBlockID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default RoomBlockList;
