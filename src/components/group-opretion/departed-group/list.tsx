import { Tooltip, Button, Menu, MenuItem } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import * as yup from "yup";
import { useIntl } from "react-intl";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import Search from "../search";
import {
    GroupReservationSWR,
    ReservationAPI,
    listUrl,
} from "lib/api/reservation";
import NewReservation from "components/front-office/reservation-list/new";
import { ModalContext } from "lib/context/modal";
import { dateStringToObj } from "lib/utils/helpers";
import AuditTrail from "../audit-trail";

const GroupReservationList = ({ title, workingDate }: any) => {
    const intl = useIntl();
    const [search, setSearch] = useState({
        StartDate: workingDate,
        EndDate: moment(
            dateStringToObj(moment(workingDate).format("YYYY-MM-DD")),
            "YYYY-MM-DD"
        )
            .add(1, "months")
            .format("YYYY-MM-DD"),
        GroupDeparted: true,
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const { handleModal }: any = useContext(ModalContext);
    const handleClick = (event: any, row: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row.row);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const { data, error } = GroupReservationSWR(search);

    const validationSchema = yup.object().shape({
        StartDate: yup.date().nullable(),
        EndDate: yup.date().nullable(),
    });

    const formOptions = {
        resolver: yupResolver(validationSchema),
        defaultValues: {
            StartDate: workingDate,
            EndDate: moment(
                dateStringToObj(moment(workingDate).format("YYYY-MM-DD")),
                "YYYY-MM-DD"
            )
                .add(1, "months")
                .format("YYYY-MM-DD"),
            GroupDeparted: true,
        },
    };

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

    const columns = [
        {
            title: intl.formatMessage({
                id: "RowHeaderGroupCode",
            }),
            key: "GroupCode",
            dataIndex: "GroupCode",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderColor",
            }),
            key: "GroupColor",
            dataIndex: "GroupColor",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <Tooltip
                        title={`#${
                            element.row.GroupColor
                                ? element.row.GroupColor
                                : "ffff"
                        }`}
                        placement="top"
                    >
                        <div
                            style={{
                                width: "40px",
                                height: "20px",
                                background: `#${
                                    element.row.GroupColor
                                        ? element.row.GroupColor
                                        : "ffff"
                                }`,
                                borderRadius: "5px",
                            }}
                        ></div>
                    </Tooltip>
                );
            },
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderCustomerName",
            }),
            key: "CustomerName",
            dataIndex: "CustomerName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRoom",
            }),
            key: "Rooms",
            dataIndex: "Rooms",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderPax",
            }),
            key: "Pax",
            dataIndex: "Pax",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderArrival",
            }),
            key: "ArrivalDate",
            dataIndex: "ArrivalDate",
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
                id: "RowHeaderGuide",
            }),
            key: "GuideName",
            dataIndex: "GuideName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderTotal",
            }),
            key: "TotalCharge",
            dataIndex: "TotalCharge",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderPaid",
            }),
            key: "TotalPayment",
            dataIndex: "TotalPayment",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderUserName",
            }),
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderAction",
            }),
            key: "Action",
            dataIndex: "Action",
            renderCell: (element: any) => {
                return (
                    <>
                        <Button
                            aria-controls={`menu${element.row.GroupID}`}
                            variant={"outlined"}
                            size="small"
                            onClick={(e) => handleClick(e, element)}
                        >
                            {intl.formatMessage({
                                id: "RowHeaderAction",
                            })}
                        </Button>
                        <Menu
                            id={`menu${element.row.GroupID}`}
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {selectedRow && (
                                <>
                                    <a
                                        href={`/transaction/group-edit/${selectedRow.GroupID}`}
                                        style={{
                                            color: "inherit",
                                            textDecoration: "none",
                                        }}
                                    >
                                        <MenuItem
                                            key={`groupEdit${selectedRow.GroupID}`}
                                        >
                                            {intl.formatMessage({
                                                id: "TextEditGroup",
                                            })}
                                        </MenuItem>
                                    </a>
                                    {/* <MenuItem
                                        key={`newOrder${selectedRow.GroupID}`}
                                        onClick={() => {
                                            handleModal(
                                                true,
                                                `New Reservation`,
                                                <NewReservation
                                                    dateStart={
                                                        selectedRow.ArrivalDate
                                                    }
                                                    dateEnd={
                                                        selectedRow.DepartureDate
                                                    }
                                                    workingDate={workingDate}
                                                    groupID={
                                                        selectedRow.GroupID
                                                    }
                                                />,
                                                null,
                                                "large"
                                            );
                                        }}
                                    >
                                        Шинэ зочин нэмэх
                                    </MenuItem> */}
                                    <MenuItem
                                        key={`neh${selectedRow.GroupID}`}
                                        onClick={() => {}}
                                    >
                                        {intl.formatMessage({
                                            id: "ButtonPrintInvoice",
                                        })}
                                    </MenuItem>
                                    <MenuItem
                                        key={`sendNex${selectedRow.GroupID}`}
                                        onClick={() => {}}
                                    >
                                        {intl.formatMessage({
                                            id: "ButtonEmailInvoice",
                                        })}
                                    </MenuItem>
                                    <MenuItem
                                        key={`check${selectedRow.GroupID}`}
                                        onClick={() => {
                                            handleModal(
                                                true,
                                                "Хяналт",
                                                <AuditTrail
                                                    GroupID={
                                                        selectedRow.GroupID
                                                    }
                                                />,
                                                null,
                                                "large"
                                            );
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: "ButtonAuditTrail",
                                        })}
                                    </MenuItem>
                                </>
                            )}
                        </Menu>
                    </>
                );
            },
        },
    ];

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={ReservationAPI}
            hasNew={false}
            hasUpdate={false}
            hasDelete={false}
            hasShow={false}
            id="GroupID"
            listUrl={listUrl}
            modalTitle={title}
            excelName={title}
            search={
                <CustomSearch
                    listUrl={listUrl}
                    search={search}
                    setSearch={setSearch}
                    handleSubmit={handleSubmit}
                    reset={reset}
                >
                    <Search
                        register={register}
                        errors={errors}
                        control={control}
                        reset={reset}
                    />
                </CustomSearch>
            }
        />
    );
};

export default GroupReservationList;
