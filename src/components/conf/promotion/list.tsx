import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { PromotionSWR, PromotionAPI, listUrl } from "lib/api/promotion";
import NewEdit from "./new-edit";
import Search from "./search";


const PromotionList = ({ title }: any) => {
    const intl = useIntl();

    const columns = [
        {
            title: intl.formatMessage({id:"TextPromotionCode"}), 
            key: "TextPromotionCode",
            dataIndex: "TextPromotionCode",
        },
        {
            title: intl.formatMessage({id:"TextBeginDate"}), 
            key: "TextBeginDate",
            dataIndex: "TextBeginDate",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    element.row.BeginDate &&
                    format(
                        new Date(element.row.BeginDate.replace(/ /g, "T")),
                        "MM/dd/yyyy"
                    )
                );
            },
        },
        {
            title: intl.formatMessage({id:"TextEndDate"}),
            key: "TextEndDate",
            dataIndex: "TextEndDate",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    element.row.EndDate &&
                    format(
                        new Date(element.row.EndDate.replace(/ /g, "T")),
                        "MM/dd/yyyy"
                    )
                );
            },
        },
        {   title: intl.formatMessage({id:"TextAvailableOn"}),
            key: "TextAvailableOn",
            dataIndex: "TextAvailableOn",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return element.row.AvailableOn === 1
                    ? "Өдөр бүр"
                    : element.row.AvailableOn === 2
                    ? "Эхний өдөр"
                    : element.row.AvailableOn === 3
                    ? "Сүүлийн өдөр"
                    : "";
            },
        },
        {
            title: "TextWeekDaysEnable",
            key: "TextWeekDaysEnable",
            dataIndex: "TextWeekDaysEnable",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return element.row.WeekDaysEnabled
                    ? "долоо хоногийн үнэ"
                    : "энгийн";
            },
        },
    ];
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
