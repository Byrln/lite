import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { ChargeTypeSWR, ChargeTypeAPI, listUrl } from "lib/api/charge-type";
import { formatPrice } from "lib/utils/helpers";
import NewEdit from "./new-edit";
import Search from "./search";

const columns = [
    {
        title: "Нэмэлт үйлчилгээний бүлэг",
        key: "RoomChargeTypeGroupName",
        dataIndex: "RoomChargeTypeGroupName",
    },

    {
        title: "Нэмэлт үйлчилгээ",
        key: "RoomChargeTypeName",
        dataIndex: "RoomChargeTypeName",
    },
    {
        title: "Тариф",
        key: "RoomChargeTypeRate",
        dataIndex: "RoomChargeTypeRate",
        render: function render(id: any, value: any) {
            return formatPrice(value);
        },
    },
    {
        title: "Засагдахуйц",
        key: "IsEditable",
        dataIndex: "IsEditable",
        render: function render(id: any, value: any) {
            return <ToggleChecked id={id} checked={value} disabled={true} />;
        },
    },
    {
        title: "Дараалал",
        key: "SortOrder",
        dataIndex: "SortOrder",
    },
    {
        title: "Төлөв",
        key: "Status",
        dataIndex: "Status",
        render: function render(id: any, value: any) {
            return (
                <ToggleChecked
                    id={id}
                    checked={value}
                    api={ChargeTypeAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
    {
        title: "Inclusion",
        key: "IsInclusion",
        dataIndex: "IsInclusion",
        render: function render(id: any, value: any) {
            return (
                <ToggleChecked
                    id={id}
                    checked={value}
                    // api={ChargeTypeAPI}
                    // apiUrl="IsInclusion"
                    // mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const ExtraChargeList = ({ title }: any) => {
    const validationSchema = yup.object().shape({
        SearchStr: yup.string().nullable(),
        RoomChargeTypeGroupID: yup.string().nullable(),
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

    const { data, error } = ChargeTypeSWR(search);

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
                api={ChargeTypeAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="RoomChargeTypeID"
                listUrl={listUrl}
                modalTitle={title}
                modalContent={<NewEdit />}
                excelName={title}
            />
        </>
    );
};

export default ExtraChargeList;
