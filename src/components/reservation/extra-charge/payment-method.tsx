import { Checkbox, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { listUrl } from "lib/api/front-office";

import { formatNumber } from "lib/utils/helpers";
import { PaymentMethodSWR } from "lib/api/payment-method";
import CustomTable from "components/common/custom-table";
import CurrencySelect from "components/select/currency";

const PaymentMethod = ({
    additionalMutateUrl,
    entity,
    setEntity,
    register,
    errors,
}: any) => {
    const [rerenderKey, setRerenderKey] = useState(0);

    const { data, error } = PaymentMethodSWR();

    useEffect(() => {
        if (data) {
            setEntity(data);
        }
    }, [data]);

    const onCheckboxChange = (e: any) => {
        let tempEntity = [...entity];
        tempEntity.forEach((element: any) => {
            element.isChecked = e.target.checked;
            if (e.target.checked) {
                element.CurrencyID = 154;
            } else {
                element.CurrencyID = null;
            }
        });
        setEntity(tempEntity);
        setRerenderKey((prevKey) => prevKey + 1);
    };

    const columns = [
        {
            title: "№",
            key: "test",
            dataIndex: "test",
        },
        {
            title: "",
            key: "check",
            dataIndex: "check",
            withCheckBox: true,
            onChange: onCheckboxChange,
            render: function render(
                id: any,
                value: any,
                element: any,
                dataIndex: any
            ) {
                return (
                    <Checkbox
                        key={rerenderKey}
                        checked={
                            entity &&
                            entity[dataIndex] &&
                            entity[dataIndex].isChecked
                        }
                        onChange={(e: any) => {
                            let tempEntity = [...entity];
                            tempEntity[dataIndex].isChecked = e.target.checked;
                            tempEntity[dataIndex].CurrencyID = 154;

                            setEntity(tempEntity);
                        }}
                    />
                );
            },
        },
        {
            title: "Бүлгийн нэр",
            key: "PaymentMethodGroupName",
            dataIndex: "PaymentMethodGroupName",
        },
        {
            title: "Төлбөрийн хэлбэр",
            key: "PaymentMethodName",
            dataIndex: "PaymentMethodName",
        },
        {
            title: "Ханш",
            key: "Currency",
            dataIndex: "Currency",
            render: function render(
                id: any,
                value: any,
                element: any,
                dataIndex: any
            ) {
                return (
                    <CurrencySelect
                        register={register}
                        errors={errors}
                        nameKey={`TransactionDetail.${id}.CurrencyID`}
                        value={
                            entity &&
                            entity[dataIndex] &&
                            formatNumber(entity[dataIndex].CurrencyID)
                        }
                        onChange={(evt: any) => {
                            let tempEntity = [...entity];
                            tempEntity[dataIndex].CurrencyID = parseFloat(
                                evt.target.value
                            );
                            setEntity(tempEntity);
                        }}
                    />
                );
            },
        },
        {
            title: "Дүн",
            key: "Amount",
            dataIndex: "Amount",
            render: function render(
                id: any,
                value: any,
                element: any,
                dataIndex: any
            ) {
                return (
                    <TextField
                        size="small"
                        fullWidth
                        disabled={
                            entity &&
                            entity[dataIndex] &&
                            !entity[dataIndex].isChecked
                        }
                        value={
                            entity &&
                            entity[dataIndex] &&
                            formatNumber(entity[dataIndex].Amount)
                        }
                        InputLabelProps={{
                            shrink: value || value == 0,
                        }}
                        margin="dense"
                        onChange={(evt: any) => {
                            let tempEntity = [...entity];
                            tempEntity[dataIndex].Amount = parseFloat(
                                evt.target.value.replace(/[^0-9.]/g, "")
                            );
                            setEntity(tempEntity);
                        }}
                    />
                );
            },
        },
    ];

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            hasNew={true}
            //hasUpdate={true}
            //hasDelete={true}
            id="PaymentMethodID"
            listUrl={listUrl}
            datagrid={false}
            hasPrint={false}
            hasExcel={false}
        />
    );
};

export default PaymentMethod;
