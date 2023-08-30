import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomTable from "components/common/custom-table";
import {
    GuestdatabaseSWR,
    GuestdatabaseAPI,
    listUrl,
} from "lib/api/guest-database";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Guest Name",
        key: "GuestFullName",
        dataIndex: "GuestFullName",
    },
    {
        title: "Country",
        key: "CountryName",
        dataIndex: "CountryName",
    },
    {
        title: "Phone",
        key: "Phone",
        dataIndex: "Phone",
    },
    {
        title: "Mobile",
        key: "Mobile",
        dataIndex: "Mobile",
    },
    {
        title: "Email",
        key: "Email",
        dataIndex: "Email",
    },

    {
        title: "Vip Status",
        key: "VipStatusName",
        dataIndex: "VipStatusName",
    },
    {
        title: "Action",
        key: "Action",
        dataIndex: "Action",
        render: function render(id: any, value: any) {
            return (
                <>
                    <button> Upload Picture </button>
                    <button> Upload Document </button>
                </>
            );
        },
    },
];

const GuestdatabaseList = ({ title }: any) => {
    const validationSchema = yup.object().shape({
        StartDate: yup.date().nullable(),
        EndDate: yup.date().nullable(),
        ReservationTypeID: yup.number().nullable(),
        ReservationSourceID: yup.number().nullable(),
        StatusGroup: yup.number().nullable(),
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

    const { data, error } = GuestdatabaseSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={GuestdatabaseAPI}
            hasNew={true}
            hasUpdate={true}
            //hasDelete={true}
            id="GuestID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default GuestdatabaseList;
