import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import {
    CompanyDatabaseSWR,
    CompanyDatabaseAPI,
    listUrl,
} from "lib/api/company-database";
import NewEdit from "./new-edit";
import Search from "./search";



const CompanyDatabaseList = ({ title }: any) => {
    const intl = useIntl();
    const validationSchema = yup.object().shape({
        CustomerTypeID: yup.string().nullable(),
        CustomerGroupID: yup.string().nullable(),
        SearchStr: yup.string().nullable(),
    });
    const columns = [
        {
            title: intl.formatMessage({id:"RowHeaderCustomerName"}), 
            key: "RowHeaderCustomerName",
            dataIndex: "RowHeaderCustomerName",
        },
        {
            title: intl.formatMessage({id:"TextGroupName"}), 
            key: "TextGroupName",
            dataIndex: "TextGroupName",
        },
        {
            title: intl.formatMessage({id:"RowHeaderRegistryNo"}), 
            key: "RowHeaderRegistryNo",
            dataIndex: "RowHeaderRegistryNo",
        },
        {
            title: intl.formatMessage({id:"ReportPhone"}), 
            key: "ReportPhone",
            dataIndex: "ReportPhone",
        },
        {
            title: intl.formatMessage({id:"RowHeaderEmail"}), 
            key: "RowHeaderEmail",
            dataIndex: "RowHeaderEmail",
        },
        {
            title: intl.formatMessage({id:"TextCity"}), 
            key: "TextCity",
            dataIndex: "TextCity",
        },
        {
            title: intl.formatMessage({id:"ReportCountry"}), 
            key: "ReportCountry",
            dataIndex: "ReportCountry",
        },
    ];

    const formOptions = { resolver: yupResolver(validationSchema) };
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

    const [search, setSearch] = useState({});

    const { data, error } = CompanyDatabaseSWR(search);

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={CompanyDatabaseAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="CustomerID"
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

export default CompanyDatabaseList;
