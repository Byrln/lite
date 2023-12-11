import { Button, Stack } from "@mui/material";
import { useContext } from "react";

import CustomTable from "components/common/custom-table";
import { PendingDueOutSWR, listUrl } from "lib/api/reservation";
import NewEdit from "./new-edit";
import { ModalContext } from "lib/context/modal";

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
                        Зочин гаргах
                    </Button>

                    <Button key={id} onClick={() => {}}>
                        Хугацаа өөрчлөх
                    </Button>
                </Stack>
            );
        },
    },
];

const PendingDueOutList = ({ title }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const { data, error } = PendingDueOutSWR();

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

export default PendingDueOutList;
