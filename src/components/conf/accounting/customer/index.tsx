import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import { Button } from "@mui/material";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { AccountingCustomerAPI } from "lib/api/accounting-customer";
import { CustomerSWR, CustomerAPI, listUrl } from "lib/api/customer";
import { ModalContext } from "lib/context/modal";
import { useAppState } from "lib/context/app";

import NewEdit from "./new-edit";
import Search from "./search";

const CustomerList = ({ title }: any) => {
    const [state, dispatch]: any = useAppState();
    const { handleModal }: any = useContext(ModalContext);
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
            title: "№",
            key: "№",
            dataIndex: "№",
        },
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
