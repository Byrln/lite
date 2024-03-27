import CustomTable from "components/common/custom-table";
import {
    GroupReservationSWR,
    ReservationAPI,
    listUrl,
} from "lib/api/reservation";
import { Tooltip } from "@mui/material";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";

import CustomSearch from "components/common/custom-search";
import NewEdit from "./new-edit";
import Search from "./search";

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
                        element.row.GroupColor ? element.row.GroupColor : "ffff"
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
];

const GroupReservationList = ({ title }: any) => {
    const [search, setSearch] = useState({
        StartDate: moment(new Date()).format("YYYY-MM-DD"),
        EndDate: moment(new Date()).format("YYYY-MM-DD"),
    });

    const { data, error } = GroupReservationSWR(search);

    const validationSchema = yup.object().shape({
        StartDate: yup.date().nullable(),
        EndDate: yup.date().nullable(),
    });
    const formOptions = {
        resolver: yupResolver(validationSchema),
        defaultValues: {
            StartDate: moment(new Date()).format("YYYY-MM-DD"),
            EndDate: moment(new Date()).format("YYYY-MM-DD"),
        },
    };
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={ReservationAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="GroupID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
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
