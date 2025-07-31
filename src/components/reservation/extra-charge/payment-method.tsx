import { Checkbox, TextField, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { listUrl } from "lib/api/front-office";
import { useIntl } from "react-intl";

import { formatNumber } from "lib/utils/helpers";
import { PaymentMethodAPI } from "lib/api/payment-method";
import CustomTable from "components/common/custom-table";
import CurrencySelect from "components/select/currency";
import { formatPrice } from "lib/utils/helpers";

const PaymentMethod = ({ entity, setEntity, register, errors }: any) => {
    const intl = useIntl();
    const [rerenderKey, setRerenderKey] = useState(0);

    const fetchDatas = async () => {
        try {
            const arr: any = await PaymentMethodAPI.list({});
            if (arr) {
                setEntity(arr);
            }
        } finally {
        }
    };

    useEffect(() => {
        // Only fetch data if entity is empty or undefined
        if (!entity || entity.length === 0) {
            fetchDatas();
        }
    }, [entity]);

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
            title: intl.formatMessage({
                id: "RowHeaderGroupName",
            }),
            key: "PaymentMethodGroupName",
            dataIndex: "PaymentMethodGroupName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderPaymentMethod",
            }),
            key: "PaymentMethodName",
            dataIndex: "PaymentMethodName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderCurrencyName",
            }),
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
            title: intl.formatMessage({
                id: "RowHeaderAmount",
            }),
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
                            shrink: true,
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
        <>
            <CustomTable
                columns={columns}
                data={entity}
                hasNew={false}
                //hasUpdate={true}
                //hasDelete={true}
                id="PaymentMethodID"
                listUrl={listUrl}
                datagrid={false}
                hasPrint={false}
                hasExcel={false}
                customHeight="none"
            />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    flexWrap: "wrap",
                    flexDirection: "row-reverse",
                }}
                className="mb-1"
            >
                <div>
                    Нийт:
                    {entity &&
                        formatPrice(
                            entity.reduce(
                                (acc: any, obj: any) =>
                                    acc + (obj.Amount ? obj.Amount : 0),
                                0
                            )
                        )}
                </div>
            </Box>
        </>
    );
};

export default PaymentMethod;
