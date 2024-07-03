import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { BankAccountSWR, BankAccountAPI, listUrl } from "lib/api/bank-account";
import BankAccountNewEdit from "./bank-account-new-edit";
import Search from "./search";

const BankAccountList = ({ title }: any) => {
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

    const [search, setSearch] = useState({ Status: true });

    const { data, error } = BankAccountSWR(search);

    const columns = [
        {
            title: intl.formatMessage({id:"ReportBank"}), 
            key: "ReportBank",
            dataIndex: "ReportBank",
        },
        {
            title: intl.formatMessage({id:"RowHeaderAccountNo"}), 
            key: "RowHeaderAccountNo",
            dataIndex: "RowHeaderAccountNo",
        },
        {
            title: intl.formatMessage({id:"RowHeaderAccountName"}), 
            key: "RowHeaderAccountName",
            dataIndex: "RowHeaderAccountName",
        },
        {
            title: "Status",
            key: "Status",
            dataIndex: "Status",
            render: function render(id: any, value: any) {
                return (
                    <ToggleChecked
                        id={id}
                        checked={value}
                        api={BankAccountAPI}
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
                api={BankAccountAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={false}
                id="HotelBankAccountID"
                listUrl={listUrl}
                modalTitle={title}
                modalContent={<BankAccountNewEdit />}
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

export default BankAccountList;
