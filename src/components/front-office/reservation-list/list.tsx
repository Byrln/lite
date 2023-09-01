// import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomTable from "components/common/custom-table";
import CustomSearch from "components/common/custom-search";
import { ReservationSWR, ReservationAPI, listUrl } from "lib/api/reservation";
import NewEdit from "components/reservation/new-edit";
import Search from "./search";

const columns = [
    {
        title: "Start Date",
        key: "ReservationID",
        dataIndex: "ReservationID",
    },
    {
        title: "End Date",
        key: "ArrivalDate",
        dataIndex: "ArrivalDate",
    },
    {
        title: "Company",
        key: "DepartureDate",
        dataIndex: "DepartureDate",
    },
    {
        title: "Name",
        key: "GuestName",
        dataIndex: "GuestName",
    },
    {
        title: "Phone",
        key: "RoomFullName",
        dataIndex: "RoomFullName",
    },
    {
        title: "Email",
        key: "CustomerName",
        dataIndex: "CustomerName",
    },
    {
        title: "Reservation Type",
        key: "TotalAmount",
        dataIndex: "TotalAmount",
    },
    {
        title: "Reservation Source",
        key: "CurrentBalance",
        dataIndex: "CurrentBalance",
    },
];

const DeparturedListList = ({ title }: any) => {
    const validationSchema = yup.object().shape({
        StartDate: yup.date().nullable(),
        EndDate: yup.date().nullable(),
        ReservationTypeID: yup.string().nullable(),
        ReservationSourceID: yup.string().nullable(),
        StatusGroup: yup.string().nullable(),
        GuestName: yup.string(),
        GuestPhone: yup.string(),
        GuestEmail: yup.string(),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

    const [search, setSearch] = useState({});

    const { data, error } = ReservationSWR(search);

    return (
        <>
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

            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={ReservationAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="DeparturedListID"
                listUrl={listUrl}
                modalTitle={title}
                modalContent={<NewEdit />}
                excelName={title}
            />
        </>
    );
};

export default DeparturedListList;
