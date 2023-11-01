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
            title: "Room",
            key: "RoomID",
            dataIndex: "RoomID",
        },
        {
            title: "Extra Charge",
            key: "RoomChargeTypeName",
            dataIndex: "RoomChargeTypeName",
        },
        {
            title: "Duration",
            key: "Duration",
            dataIndex: "Duration",
        },
        {
            title: "Rate",
            key: "Rate",
            dataIndex: "Rate",
        },
        {
            title: "Quantity",
            key: "ExtraChargeQuantity",
            dataIndex: "ExtraChargeQuantity",
        },
        {
            title: "Amount",
            key: "ExtraChargeAmount",
            dataIndex: "ExtraChargeAmount",
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
