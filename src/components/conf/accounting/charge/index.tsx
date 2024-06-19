import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import {
    ExtraChargeSWR,
    extraChargeUrl,
    AccountingAPI,
} from "lib/api/accounting";
import NewEdit from "./new-edit";
import Search from "./search";

const ChargeList = ({ title }: any) => {
    const intl = useIntl();
    const validationSchema = yup.object().shape({
        ReasonTypeID: yup.string().nullable(),
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

    const { data, error } = ExtraChargeSWR(search);

    const columns = [
        {
            title: intl.formatMessage({
                id: "RowHeaderExtraCharge",
            }),
            key: "RoomChargeTypeName",
            dataIndex: "RoomChargeTypeName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRoomType",
            }),
            key: "RoomTypeName",
            dataIndex: "RoomTypeName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRoom",
            }),
            key: "RoomNo",
            dataIndex: "RoomNo",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderItemCode",
            }),
            key: "ItemCode",
            dataIndex: "ItemCode",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderLocation",
            }),
            key: "Location",
            dataIndex: "Location",
        },
        {
            title: intl.formatMessage({
                id: "TextExpenseAccountNo",
            }),
            key: "ExpenseAccountNo",
            dataIndex: "ExpenseAccountNo",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderIsService",
            }),
            key: "IsService",
            dataIndex: "IsService",
        },
    ];

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={AccountingAPI}
                hasNew={false}
                hasUpdate={false}
                hasShow={false}
                hasDelete={false}
                id="Nn"
                listUrl={extraChargeUrl}
                modalTitle={title}
                modalContent={<NewEdit />}
                excelName={title}
                search={
                    <CustomSearch
                        listUrl={extraChargeUrl}
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

export default ChargeList;
