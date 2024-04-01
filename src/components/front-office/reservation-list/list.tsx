// import { format } from "date-fns";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";

import CustomTable from "components/common/custom-table";
import CustomSearch from "components/common/custom-search";
import { ReservationSWR, ReservationAPI, listUrl } from "lib/api/reservation";
import NewEdit from "./new";
import Search from "./search";
import ReservationEdit from "components/front-office/reservation-list/edit";
import { ModalContext } from "lib/context/modal";

const DeparturedListList = ({ title }: any) => {
    const { handleModal }: any = useContext(ModalContext);

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
        {
            title: "Нэмэлт үйлдэл",
            key: "Action",
            dataIndex: "Action",
            renderCell: (element: any) => {
                return (
                    <Button
                        key={element.id}
                        onClick={() =>
                            handleModal(
                                true,
                                `Захиалга`,
                                <ReservationEdit transactionID={element.id} />,
                                null,
                                "large"
                            )
                        }
                    >
                        Засах
                    </Button>
                );
            },
        },
    ];

    const validationSchema = yup.object().shape({
        StartDate: yup.date().nullable(),
        EndDate: yup.date().nullable(),
        ReservationTypeID: yup.string().nullable(),
        ReservationSourceID: yup.string().nullable(),
        StatusGroup: yup.string().nullable(),
        GuestName: yup.string(),
        GuestPhone: yup.string(),
        GuestEmail: yup.string(),
        CustomerID: yup.string(),
    });
    const formOptions = {
        defaultValues: {
            StatusGroup: 1,
        },
        resolver: yupResolver(validationSchema),
    };
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

    const [search, setSearch] = useState({ StatusGroup: 1 });

    const { data, error } = ReservationSWR(search);

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={ReservationAPI}
                hasNew={true}
                hasUpdate={false}
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
