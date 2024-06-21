import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { CustomerSWR, CustomerAPI, listUrl } from "lib/api/customer";
import NewEdit from "./new-edit";
import Search from "./search";

const CustomerList = ({ title }: any) => {
    const intl = useIntl();
    const validationSchema = yup.object().shape({
        CustomerGroupID: yup.string().nullable(),
        CustomerID: yup.string().nullable(),
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

    const { data, error } = CustomerSWR(search);

    const columns = [
        {
            title: intl.formatMessage({
                id: "RowHeaderCustomerName",
            }),
            key: "CustomerName",
            dataIndex: "CustomerName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRegNo",
            }),
            key: "RegisterNo",
            dataIndex: "RegisterNo",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderCustomerCode",
            }),
            key: "CustomerCode",
            dataIndex: "CustomerCode",
        },
    ];

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                datagrid={true}
                error={error}
                api={CustomerAPI}
                hasNew={false}
                hasUpdate={true}
                hasShow={false}
                hasDelete={false}
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
                        <Search register={register} errors={errors} />
                    </CustomSearch>
                }
            />
        </>
    );
};

export default CustomerList;
