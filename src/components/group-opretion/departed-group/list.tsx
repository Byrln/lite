import { Tooltip, Button, Menu, MenuItem } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import * as yup from "yup";

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
    console.log("selectedrow", selectedRow);
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
            title: "Group Code",
            key: "GroupCode",
            dataIndex: "GroupCode",
        },
        {
            title: "Өнгө",
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
            title: "Компани",
            key: "CustomerName",
            dataIndex: "CustomerName",
        },
        {
            title: "Өрөө",
            key: "Rooms",
            dataIndex: "Rooms",
        },
        {
            title: "Хүний тоо",
            key: "Pax",
            dataIndex: "Pax",
        },
        {
            title: "Ирэх",
            key: "ArrivalDate",
            dataIndex: "ArrivalDate",
        },
        {
            title: "Гарах",
            key: "DepartureDate",
            dataIndex: "DepartureDate",
        },
        {
            title: "Departure",
            key: "Departure",
            dataIndex: "Departure",
        },
        {
            title: "Хөтөч",
            key: "GuideName",
            dataIndex: "GuideName",
        },
        {
            title: "Нийлбэр",
            key: "TotalCharge",
            dataIndex: "TotalCharge",
        },
        {
            title: "Төлсөн",
            key: "TotalPayment",
            dataIndex: "TotalPayment",
        },
        {
            title: "Хэрэглэгч",
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: "Үйлдэл",
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
                            Үйлдэл
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
                                            Групп засварлах
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
                                        Нэх.хэвлэх
                                    </MenuItem>
                                    <MenuItem
                                        key={`sendNex${selectedRow.GroupID}`}
                                        onClick={() => {}}
                                    >
                                        Нэхэмжлэх илгээх
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
                                        Хяналт
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
