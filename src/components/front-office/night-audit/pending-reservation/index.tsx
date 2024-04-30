import { Stack } from "@mui/material";
import { useEffect } from "react";
import { useIntl } from "react-intl";

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
    const intl = useIntl();

    const { data, error } = PendingReservationSWR();

    useEffect(() => {
        if (data && data.length == 0) {
            setPendingReservationCompleted(true);
        }
    }, [data]);

    const columns = [
        {
            title: intl.formatMessage({
                id: "Reservation_ReservationNo",
            }),
            key: "ReservationNo",
            dataIndex: "ReservationNo",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderGuest",
            }),
            key: "GuestName",
            dataIndex: "GuestName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRoom",
            }),
            key: "RoomFullName",
            dataIndex: "RoomFullName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRateType",
            }),
            key: "RateTypeName",
            dataIndex: "RateTypeName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderReservationType",
            }),
            key: "ReservationTypeName",
            dataIndex: "ReservationTypeName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderDeparture",
            }),
            key: "DepartureDate",
            dataIndex: "DepartureDate",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderTotalAmount",
            }),
            key: "TotalAmount",
            dataIndex: "TotalAmount",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderDeposit",
            }),
            key: "Deposit",
            dataIndex: "Deposit",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderAdditionalAction",
            }),
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
                                TransactionID={entity.TransactionID}
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
            datagrid={false}
        />
    );
};

export default PendingReservation;
