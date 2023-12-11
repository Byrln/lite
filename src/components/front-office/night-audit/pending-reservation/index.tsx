import { Button, Stack } from "@mui/material";

import CustomTable from "components/common/custom-table";
import { PendingReservationSWR, listUrl } from "lib/api/reservation";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Захиалгын дугаар",
        key: "ReservationNo",
        dataIndex: "ReservationNo",
    },
    {
        title: "Зочин",
        key: "GuestName",
        dataIndex: "GuestName",
    },
    {
        title: "Өрөө",
        key: "RoomFullName",
        dataIndex: "RoomFullName",
    },
    {
        title: "Тарифын төрөл",
        key: "RateTypeName",
        dataIndex: "RateTypeName",
    },
    {
        title: "Захиалгын төрөл",
        key: "ReservationTypeName",
        dataIndex: "ReservationTypeName",
    },
    {
        title: "Гарах",
        key: "DepartureDate",
        dataIndex: "DepartureDate",
    },
    {
        title: "Нийлбэр",
        key: "TotalAmount",
        dataIndex: "TotalAmount",
    },
    {
        title: "Урьдчилгаа",
        key: "Deposit",
        dataIndex: "Deposit",
    },
    {
        title: "Нэмэлт үйлдэл",
        key: "Action",
        dataIndex: "Action",
        render: function render(id: any, record: any, entity: any) {
            return (
                <Stack direction="row" spacing={1}>
                    <Button key={id} onClick={() => {}}>
                        Зочин буулгах
                    </Button>

                    <Button key={id} onClick={() => {}}>
                        Өрөө шилжих
                    </Button>

                    <Button key={id} onClick={() => {}}>
                        Хугацаа өөрчлөх
                    </Button>

                    <Button key={id} onClick={() => {}}>
                        Ирээгүй
                    </Button>

                    <Button key={id} onClick={() => {}}>
                        Захиалга цуцлах
                    </Button>

                    <Button key={id} onClick={() => {}}>
                        Устгах
                    </Button>
                </Stack>
            );
        },
    },
];

const PendingReservation = ({ title }: any) => {
    const { data, error } = PendingReservationSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            // api={NightAuditAPI}
            hasNew={false}
            hasUpdate={false}
            hasDelete={false}
            id="ReservationID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
            hasPrint={false}
            hasExcel={false}
        />
    );
};

export default PendingReservation;
