import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { SeasonSWR, SeasonAPI, listUrl } from "lib/api/season";
import NewEdit from "./new-edit";
import Search from "./search";

const columns = [
    { title: "Улирлын нэр", key: "SeasonName", dataIndex: "SeasonName" },
    {
        title: "Эхлэх өдөр",
        key: "BeginDayMonth",
        dataIndex: "BeginDayMonth",
    },
    {
        title: "Дуусах өдөр",
        key: "EndDayMonth",
        dataIndex: "EndDayMonth",
    },
    {
        title: "Эхлэх огноо",
        key: "BeginDate",
        dataIndex: "BeginDate",
        render: function render(id: any, value: any) {
            return (
                value &&
                format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy")
            );
        },
    },
    {
        title: "Дуусах огноо",
        key: "EndDate",
        dataIndex: "EndDate",
        render: function render(id: any, value: any) {
            return (
                value &&
                format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy")
            );
        },
    },
    { title: "Эрэмбэлэх", key: "Priority", dataIndex: "Priority" },
    {
        title: "Төлөв",
        key: "Status",
        dataIndex: "Status",
        render: function render(id: any, value: any) {
            return (
                <ToggleChecked
                    id={id}
                    checked={value}
                    api={SeasonAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const SeasonList = ({ title }: any) => {
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

    const { data, error } = SeasonSWR(search);

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
                api={SeasonAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="SeasonID"
                listUrl={listUrl}
                modalTitle={title}
                modalContent={<NewEdit />}
                excelName={title}
            />
        </>
    );
};

export default SeasonList;
