import CustomTable from "components/common/custom-table";
import { ReservationLogSWR, listUrl } from "lib/api/reservation";

const columns = [
    { title: "Үйлдэл", key: "Action", dataIndex: "Action" },
    {
        title: "Тайлбар",
        key: "Description",
        dataIndex: "Description",
    },
    { title: "Өдөр", key: "CreatedDate", dataIndex: "CreatedDate" },
    { title: "Хэрэглэгч", key: "UserName", dataIndex: "UserName" },
    { title: "Сүлжээний хаяг", key: "IPAddress", dataIndex: "IPAddress" },
];

const RoomList = ({ TransactionID }: any) => {
    const { data, error } = ReservationLogSWR(TransactionID);

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                id="TransactionActionID"
                listUrl={listUrl}
                excelName="Хяналт"
                hasNew={false}
                hasDelete={false}
                hasShow={false}
            />
        </>
    );
};

export default RoomList;
