import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { RateSWR, listUrl } from "lib/api/rate";
import { formatPrice } from "lib/utils/helpers";
import Search from "./search";

const columns = [
    {
        title: "Rate Type",
        key: "RateTypeName",
        dataIndex: "RateTypeName",
    },
    {
        title: "Room Type",
        key: "RoomTypeName",
        dataIndex: "RoomTypeName",
    },
    { title: "Season", key: "SeasonName", dataIndex: "SeasonName" },
    { title: "Res. Source", key: "SourceName", dataIndex: "SourceName" },
    {
        title: "Company",
        key: "CustomerName",
        dataIndex: "CustomerName",
    },
    {
        title: "Company",
        key: "DurationName",
        dataIndex: "DurationName",
    },
    {
        title: "Rate",
        key: "BaseRate",
        dataIndex: "BaseRate",
        render: function render(id: any, value: any) {
            return formatPrice(value);
        },
    },
    {
        title: "Rate for Extra Adult",
        key: "ExtraAdult",
        dataIndex: "ExtraAdult",
        render: function render(id: any, value: any) {
            return formatPrice(value);
        },
    },
    {
        title: "Rate for Extra Child",
        key: "ExtraChild",
        dataIndex: "ExtraChild",
        render: function render(id: any, value: any) {
            return formatPrice(value);
        },
    },
];

const RateList = ({ title }: any) => {
    const validationSchema = yup.object().shape({
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

    const { data, error } = RateSWR();

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
                    //TODO
                />
            </CustomSearch>

            <CustomTable
                columns={columns}
                data={data}
                error={error}
                modalTitle={title}
                excelName={title}
            />
        </>
    );
};

export default RateList;
