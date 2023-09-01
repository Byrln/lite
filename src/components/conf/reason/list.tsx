import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { ReasonSWR, ReasonAPI, listUrl } from "lib/api/reason";
import NewEdit from "./new-edit";
import Search from "./search";

const columns = [
    {
        title: "reason",
        key: "ReasonName",
        dataIndex: "ReasonName",
    },
    {
        title: "Category",
        key: "ReasonTypeName",
        dataIndex: "ReasonTypeName",
    },
    {
        title: "User Name",
        key: "UserName",
        dataIndex: "UserName",
    },
    {
        title: "Changed Date",
        key: "CreatedDate",
        dataIndex: "CreatedDate",
        render: function render(id: any, value: any) {
            return (
                value &&
                format(
                    new Date(value.replace(/ /g, "T")),
                    "MM/dd/yyyy hh:mm:ss a"
                )
            );
        },
    },
    {
        title: "Ip Address",
        key: "IPAddress",
        dataIndex: "IPAddress",
    },
];

const ReasonList = ({ title }: any) => {
    const validationSchema = yup.object().shape({
        ReasonTypeID: yup.string().nullable(),
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

    const { data, error } = ReasonSWR(search);

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
                api={ReasonAPI}
                hasNew={true}
                hasDelete={true}
                id="ReasonID"
                listUrl={listUrl}
                modalTitle={title}
                modalContent={<NewEdit />}
                excelName={title}
            />
        </>
    );
};

export default ReasonList;
