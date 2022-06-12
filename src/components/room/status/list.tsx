import { Tooltip } from "@mui/material";
import CustomTable from "components/common/custom-table";
import { RoomStatusSWR, RoomStatusAPI, listUrl } from "lib/api/room-status";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Room Status",
        key: "StatusCode",
        dataIndex: "StatusCode",
    },
    {
        title: "Color",
        key: "StatusColor",
        dataIndex: "StatusColor",
        render: function render(id: any, value: any) {
            return (
                <Tooltip title={`#${value}`} placement="top">
                    <div
                        style={{
                            width: "40px",
                            height: "20px",
                            background: `#${value}`,
                            borderRadius: "5px",
                        }}
                    ></div>
                </Tooltip>
            );
        },
    },
    { title: "Description", key: "Description", dataIndex: "Description" },
];

const RoomStatusList = ({ title }: any) => {
    const { data, error } = RoomStatusSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={RoomStatusAPI}
            hasUpdate={true}
            id="RoomStatusID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default RoomStatusList;
