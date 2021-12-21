import CustomTable from "components/common/custom-table";
import { RoomTypeSWR, RoomTypeAPI, listUrl } from "lib/api/room-type";
import NewEdit from "./new-edit";

const RoomTypeList = () => {
    const { data, error } = RoomTypeSWR();

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
        { title: "Status", key: "Status", dataIndex: "Status" },
    ];

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
            modalTitle="Өрөөний төрөл"
            modalContent={<NewEdit />}
        />
    );
};

export default RoomTypeList;
