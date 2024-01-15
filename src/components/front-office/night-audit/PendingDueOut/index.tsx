import { Stack } from "@mui/material";
import { useEffect } from "react";

import CustomTable from "components/common/custom-table";
import { PendingDueOutSWR, urlPrefix } from "lib/api/reservation";
import NewEdit from "./new-edit";
import AmendStay from "../pending-reservation/additional-actions/amend-stay";
import Checkout from "./additional-actions/checkout";

const PendingDueOutList = ({
    title,
    setPendingDueOutCompleted,
    workingDate,
}: any) => {
    const { data, error } = PendingDueOutSWR();

    useEffect(() => {
        if (
            data &&
            data.filter((element: any) => element.IsPending == "true").length ==
                0
        ) {
            setPendingDueOutCompleted(true);
        } else {
            setPendingDueOutCompleted(false);
        }
    }, [data]);

    const columns = [
        {
            title: "Өрөө",
            key: "RoomFullName",
            dataIndex: "RoomFullName",
        },
        {
            title: "Зочин",
            key: "GuestName",
            dataIndex: "GuestName",
        },

        {
            title: "Ирэх өдөр",
            key: "ArrivalDate",
            dataIndex: "ArrivalDate",
        },
        {
            title: "Гарах өдөр",
            key: "DepartureDate",
            dataIndex: "DepartureDate",
        },
        {
            title: "Нийлбэр",
            key: "TotalAmount",
            dataIndex: "TotalAmount",
        },
        {
            title: "Үлд.Төлбөр",
            key: "CurrentBalance",
            dataIndex: "CurrentBalance",
        },
        {
            title: "Төлөв",
            key: "StDescription",
            dataIndex: "StDescription",
        },
        {
            title: "Нэмэлт үйлдэл",
            key: "Action",
            dataIndex: "Action",
            render: function render(id: any, record: any, entity: any) {
                return (
                    <Stack direction="row" spacing={1}>
                        <Checkout
                            key={`checkout-${id}`}
                            TransactionID={entity.TransactionID}
                            listUrl={`${urlPrefix}/PendingDueOut`}
                        />

                        <AmendStay
                            key={`amend-stay-${id}`}
                            entity={entity}
                            listUrl={`${urlPrefix}/PendingDueOut`}
                            workingDate={workingDate}
                        />
                    </Stack>
                );
            },
        },
    ];

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
            listUrl={`${urlPrefix}/PedingDueOut`}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
            hasPrint={false}
            hasExcel={false}
            datagrid={false}
        />
    );
};

export default PendingDueOutList;
