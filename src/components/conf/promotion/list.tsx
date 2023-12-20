import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { PromotionSWR, PromotionAPI, listUrl } from "lib/api/promotion";
import NewEdit from "./new-edit";
import Search from "./search";

const columns = [
    {
        title: "Promotion Code",
        key: "PromotionCode",
        dataIndex: "PromotionCode",
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
        title: "Дуусах хугацаа",
        key: "EndDate",
        dataIndex: "EndDate",
        render: function render(id: any, value: any) {
            return (
                value &&
                format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy")
            );
        },
    },
    {
        title: "Available On",
        key: "AvailableOn",
        dataIndex: "AvailableOn",
        render: function render(id: any, value: any) {
            return value === 1
                ? "Өдөр бүр"
                : value === 2
                ? "Эхний өдөр"
                : value === 3
                ? "Сүүлийн өдөр"
                : "";
        },
    },
    {
        title: "Week Days Enabled",
        key: "WeekDaysEnabled",
        dataIndex: "WeekDaysEnabled",
        render: function render(id: any, value: any) {
            return value ? "долоо хоногийн үнэ" : "энгийн";
        },
    },
];

const PromotionList = ({ title }: any) => {
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

    const { data, error } = PromotionSWR(search);

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={PromotionAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="PromotionID"
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

export default PromotionList;
