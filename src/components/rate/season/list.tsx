import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";

import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { SeasonSWR, SeasonAPI, listUrl } from "lib/api/season";
import NewEdit from "./new-edit";
import Search from "./search";


const SeasonList = ({ title }: any) => {
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

    const { data, error } = SeasonSWR(search);


const columns = [
    { title: intl.formatMessage({id:"RowHeaderSeasonName"}), key: "SeasonName", dataIndex: "SeasonName" },

    { title: intl.formatMessage({id:"TextDateFrom"}), key: "Datefrom", dataIndex: "Datefrom" },
    
    { title: intl.formatMessage({id:"TextDateTo"}), 
    key: "DateTo",
     dataIndex: "DateTo" },
    
       
    {
        title: intl.formatMessage({id:"RowHeaderBeginDate"}), 
        key: "BeginDate",
        dataIndex: "BeginDate",
        excelRenderPass: true,
        renderCell: (element: any) => {
            return (element.row.BeginDate && format(
                new Date(element.row.BeginDate.replace(/ /g, "T")),
                "MM/dd/yyyy"
            ));
        },
    },
    {
        title: intl.formatMessage({id:"RowHeaderEndDate"}),
        key: "EndDate",
        dataIndex: "EndDate",
        excelRenderPass: true,
        renderCell: (element: any) => {
            return (element.row.EndDate && format(
                new Date(element.row.EndDate.replace(/ /g, "T")),
                "MM/dd/yyyy"
            ));
        },
    },
    {   title: intl.formatMessage({id:"TextPriority"}), 
        key: "Priority", dataIndex: "Priority" },
    {
        title: intl.formatMessage({id:"Left_SortByStatus"}), 
        key: "Status",
        dataIndex: "Status",
        excelRenderPass: true,
        renderCell: (element: any) => {
            return (
                <ToggleChecked
                    id={element.id}
                    checked={element.row.Status}
                    api={SeasonAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
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
                api={SeasonAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="SeasonID"
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

export default SeasonList;
