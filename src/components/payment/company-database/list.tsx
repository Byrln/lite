import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import {
    CompanyDatabaseSWR,
    CompanyDatabaseAPI,
    listUrl,
} from "lib/api/company-database";
import NewEdit from "./new-edit";
import Search from "./search";

const columns = [
    {
        title: "Нэр",
        key: "CustomerName",
        dataIndex: "CustomerName",
    },
    {
        title: "Бүлгийн нэр",
        key: "CustomerGroupName",
        dataIndex: "CustomerGroupName",
    },
    {
        title: "Регистерийн дугаар",
        key: "RegisterNo",
        dataIndex: "RegisterNo",
    },
    {
        title: "Утас",
        key: "Phone",
        dataIndex: "Phone",
    },
    {
        title: "Цах.Шуудан",
        key: "Email",
        dataIndex: "Email",
    },
    {
        title: "Хот, аймаг",
        key: "City",
        dataIndex: "City",
    },
    {
        title: "Улс",
        key: "CountryName",
        dataIndex: "CountryName",
    },
];

const CompanyDatabaseList = ({ title }: any) => {
    const validationSchema = yup.object().shape({
        CustomerTypeID: yup.string().nullable(),
        CustomerGroupID: yup.string().nullable(),
        SearchStr: yup.string().nullable(),
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

    const { data, error } = CompanyDatabaseSWR(search);

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={CompanyDatabaseAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="CustomerID"
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

export default CompanyDatabaseList;
