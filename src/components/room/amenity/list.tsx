import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { AmenitySWR, AmenityAPI, listUrl } from "lib/api/amenity";
import NewEdit from "./new-edit";
import Search from "./search";

const columns = [
    {
        title: "Онцлогийн төрөл",
        key: "AmenityTypeName",
        dataIndex: "AmenityTypeName",
    },
    {
        title: "Богино нэр",
        key: "AmenityShortName",
        dataIndex: "AmenityShortName",
    },
    {
        title: "Нэр",
        key: "AmenityName",
        dataIndex: "AmenityName",
    },
    { title: "Дараалал", key: "SortOrder", dataIndex: "SortOrder" },
    {
        title: "Төлөв",
        key: "Status",
        dataIndex: "Status",
        render: function render(id: any, value: any) {
            return (
                <ToggleChecked
                    id={id}
                    checked={value}
                    api={AmenityAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const AmenityList = ({ title }: any) => {
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

    const { data, error } = AmenitySWR(search);

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={AmenityAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="AmenityID"
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

export default AmenityList;
