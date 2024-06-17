import { Box } from "@mui/material";
import { useIntl } from "react-intl";

import CustomTable from "components/common/custom-table";
import { ReservationGroupRoomTypeSWR } from "lib/api/reservation";

const RoomCharge = ({ GroupID }: any) => {
    const intl = useIntl();
    const { data, error } = ReservationGroupRoomTypeSWR(GroupID);

    const columns = [
        {
            title: "№",
            key: "№",
            dataIndex: "№",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRoomType",
            }),
            key: "RoomTypeName",
            dataIndex: "RoomTypeName",
        },
        {
            title: intl.formatMessage({
                id: "ReportTotalRooms",
            }),
            key: "TotalRooms",
            dataIndex: "TotalRooms",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderAdult",
            }),
            key: "Adults",
            dataIndex: "Adults",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderChild",
            }),
            key: "Childs",
            dataIndex: "Childs",
        },
    ];

    return (
        <Box sx={{ fontWeight: "bold", marginBottom: "10px" }}>
            <div className="mb-3">
                {intl.formatMessage({
                    id: "TextRoomInformation",
                })}
            </div>
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
