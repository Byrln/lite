import CustomTable from "components/common/custom-table";
import { PackageRoomAPI, listUrl } from "lib/api/package-room";
import NewEdit from "../new-edit";

const PackageList = ({ title, packageId, data, error }: any) => {
    const columns = [
        {
            title: "Room Type",
            key: "RoomTypeName",
            dataIndex: "RoomTypeName",
        },
        {
            title: "Rate Type",
            key: "RateTypeName",
            dataIndex: "RateTypeName",
        },
        {
            title: "Rate",
            key: "Rate",
            dataIndex: "Rate",
        },
    ];

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={PackageRoomAPI}
                hasNew={true}
                hasUpdate={true}
                id="PackageID"
                listUrl={listUrl}
                modalTitle={title}
                modalContent={<NewEdit />}
                excelName={title}
            />
        </>
    );
};

export default PackageList;
