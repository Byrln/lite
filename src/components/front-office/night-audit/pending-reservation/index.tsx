import { Button, Stack } from "@mui/material";
import { useEffect } from "react";

import CustomTable from "components/common/custom-table";
import { PendingReservationSWR, urlPrefix } from "lib/api/reservation";
import NewEdit from "./new-edit";
import AmendStay from "./additional-actions/amend-stay";
import Cancel from "./additional-actions/cancel";
import CheckIn from "./additional-actions/checkin";
import NoShow from "./additional-actions/no-show";
import RoomMove from "./additional-actions/room-move";
import Void from "./additional-actions/void";

const PendingReservation = ({
    title,
    setPendingReservationCompleted,
    workingDate,
}: any) => {
    const { data, error } = PendingReservationSWR();

    useEffect(() => {
        if (data && data.length == 0) {
            setPendingReservationCompleted(true);
        }
    }, [data]);

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
                        {entity.CheckIn == true && (
                            <CheckIn
                                key={`checkin-${id}`}
                                TransactionID={entity.TransactionID}
                                listUrl={`${urlPrefix}/PendingReservation`}
                            />
                        )}

                        {entity.MoveRoom == true && (
                            <RoomMove
                                key={`move-room-${id}`}
                                entity={entity}
                                listUrl={`${urlPrefix}/PendingReservation`}
                            />
                        )}

                        {entity.AmendStay == true && (
                            <AmendStay
                                key={`amend-stay-${id}`}
                                entity={entity}
                                listUrl={`${urlPrefix}/PendingReservation`}
                                workingDate={workingDate}
                            />
                        )}

                        {entity.NoShow == true && (
                            <NoShow
                                key={`no-show-${id}`}
                                entity={entity}
                                listUrl={`${urlPrefix}/PendingReservation`}
                            />
                        )}

                        {entity.Cancel == true && (
                            <Cancel
                                key={`cancel-${id}`}
                                entity={entity}
                                listUrl={`${urlPrefix}/PendingReservation`}
                            />
                        )}

                        {entity.Void == true && (
                            <Void
                                key={`void-${id}`}
                                entity={entity}
                                listUrl={`${urlPrefix}/PendingReservation`}
                            />
                        )}
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
            listUrl={`${urlPrefix}/PendingReservation`}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
            hasPrint={false}
            hasExcel={false}
        />
    );
};

export default PendingReservation;
