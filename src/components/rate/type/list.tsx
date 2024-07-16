import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { RateTypeSWR, RateTypeAPI, listUrl } from "lib/api/rate-type";
import NewEdit from "./new-edit";
import Search from "./search";

const columns = [
    {
        title: "Нэр",
        key: "RateTypeName",
        dataIndex: "RateTypeName",
    },
    {
        title: "Өглөөний цайтай эсэх",
        key: "BreakfastIncluded",
        dataIndex: "BreakfastIncluded",
        excelRenderPass: true,
        renderCell: (element: any) => {
            return (
                element.row.BreakfastIncluded && (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.BreakfastIncluded}
                        disabled={true}
                    />
                )
            );
        },
    },
    { title: "Суваг", key: "ChannelName", dataIndex: "ChannelName" },
    {
        title: "Төлөв",
        key: "Status",
        dataIndex: "Status",
        excelRenderPass: true,
        renderCell: (element: any) => {
            return (
                element.row.Status && (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.Status}
                        api={RateTypeAPI}
                        apiUrl="UpdateStatus"
                        mutateUrl={`${listUrl}`}
                    />
                )
            );
        },
    },
];

const RateTypeList = ({ title }: any) => {
    const intl = useIntl();
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

    const { data, error } = RateTypeSWR(search);

const columns = [
    {
        title: intl.formatMessage({id:"RowHeaderFirstName"}), 
        key: "RateTypeName",
        dataIndex: "RateTypeName",
    },
    {
        title: intl.formatMessage({id:"BreakfastIncluded"}), 
        key: "BreakfastIncluded",
        dataIndex: "BreakfastIncluded",
        excelRenderPass: true,
        renderCell: (element: any) => {
            return (
                element.row.BreakfastIncluded && (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.BreakfastIncluded}
                        disabled={true}
                    />
                )
            );
        },
    },
    {             title: intl.formatMessage({id:"ChannelName"}), 
         key: "ChannelName", 
         dataIndex: "ChannelName" },
    {
        title: intl.formatMessage({id:"Left_SortByStatus"}), 
        key: "Status",
        dataIndex: "Status",
        excelRenderPass: true,
        renderCell: (element: any) => {
            return (
                element.row.Status && (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.Status}
                        api={RateTypeAPI}
                        apiUrl="UpdateStatus"
                        mutateUrl={`${listUrl}`}
                    />
                )
            );
        },
    },
];
    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={RateTypeAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="RateTypeID"
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

export default RateTypeList;