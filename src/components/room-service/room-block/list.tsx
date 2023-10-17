import CustomTable from "components/common/custom-table";
import { RoomBlockSWR, RoomBlockAPI, listUrl } from "lib/api/room-block";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Өрөө",
        key: "RoomFullName",
        dataIndex: "RoomFullName",
    },
    {
        title: "Эхлэх огноо",
        key: "BeginDate",
        dataIndex: "BeginDate",
    },
    {
        title: "Дуусах огноо",
        key: "EndDate",
        dataIndex: "EndDate",
    },
    {
        title: "Блоклох",
        key: "CreatedDate",
        dataIndex: "CreatedDate",
    },
    {
        title: "Блоклосон",
        key: "UserName",
        dataIndex: "UserName",
    },
    {
        title: "Шалтгаан",
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
