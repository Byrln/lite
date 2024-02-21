import { useContext } from "react";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";

import CustomTable from "components/common/custom-table";
import { ReservationGroupRoomTypeSWR } from "lib/api/reservation";

const RoomCharge = ({ GroupID }: any) => {
    const { data, error } = ReservationGroupRoomTypeSWR(GroupID);

    const columns = [
        {
            title: "№",
            key: "№",
            dataIndex: "№",
        },
        {
            title: "Өр.төрөл",
            key: "RoomTypeName",
            dataIndex: "RoomTypeName",
        },
        {
            title: "Өрөө",
            key: "TotalRooms",
            dataIndex: "TotalRooms",
        },
        {
            title: "Том хүн",
            key: "Adults",
            dataIndex: "Adults",
        },
        {
            title: "Хүүхэд",
            key: "Childs",
            dataIndex: "Childs",
        },
    ];

    return (
        <Box sx={{ fontWeight: "bold", marginBottom: "10px" }}>
            Өрөөний мэдээлэл
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                pagination={false}
                datagrid={false}
                hasPrint={false}
                hasExcel={false}
                hasNew={false}
                hasUpdate={false}
                hasDelete={false}
                id="RoomTypeID"
            />
        </Box>
    );
};

export default RoomCharge;
