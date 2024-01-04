// import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomTable from "components/common/custom-table";
import CustomSearch from "components/common/custom-search";
import { ReservationSWR, ReservationAPI, listUrl } from "lib/api/reservation";
import NewEdit from "./new";
import Search from "./search";

const columns = [
    {
        title: "Зах.Дугаар",
        key: "ReservationID",
        dataIndex: "ReservationID",
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
        title: "Компани",
        key: "CustomerName",
        dataIndex: "CustomerName",
    },
    {
        title: "Нийлбэр",
        key: "TotalAmount",
        dataIndex: "TotalAmount",
    },
    {
        title: "Төлсөн",
        key: "CurrentBalance",
        dataIndex: "CurrentBalance",
    },

    {
        title: "Зах.төрөл",
        key: "ReservationTypeName",
        dataIndex: "ReservationTypeName",
    },
    {
        title: "Хэрэглэгч",
        key: "UserName",
        dataIndex: "UserName",
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
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={ReservationAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={false}
                hasShow={false}
                id="TransactionID"
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
        </>
    );
};

export default DeparturedListList;
