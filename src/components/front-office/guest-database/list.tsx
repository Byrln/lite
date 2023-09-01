import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomTable from "components/common/custom-table";
import CustomSearch from "components/common/custom-search";
import {
    GuestdatabaseSWR,
    GuestdatabaseAPI,
    listUrl,
} from "lib/api/guest-database";
import NewEdit from "./new-edit";
import Search from "./search";

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
        GuestName: yup.string().nullable(),
        CountryID: yup.string().nullable(),
        Phone: yup.string().nullable(),
        GuestEmail: yup.string().nullable(),
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

    const { data, error } = GuestdatabaseSWR(search);

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
        </>
    );
};

export default GuestdatabaseList;
