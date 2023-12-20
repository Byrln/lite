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
        title: "Шалтгаан",
        key: "ReasonName",
        dataIndex: "ReasonName",
    },
    {
        title: "Төрөл",
        key: "ReasonTypeName",
        dataIndex: "ReasonTypeName",
    },
    {
        title: "Хэрэглэгчийн нэр",
        key: "UserName",
        dataIndex: "UserName",
    },
    {
        title: "Огноо өөрчлөх",
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
        title: "Сүлжээний хаяг",
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
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={ReasonAPI}
                hasNew={true}
                hasUpdate={false}
                hasShow={false}
                hasDelete={true}
                id="ReasonID"
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

export default ReasonList;
