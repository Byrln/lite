import { Checkbox, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";

import { listUrl } from "lib/api/front-office";
import { formatNumber } from "lib/utils/helpers";
import { ChargeTypeAPI } from "lib/api/charge-type";
import CustomTable from "components/common/custom-table";

const ExtraCharge = ({ entity, setEntity }: any) => {
    const intl = useIntl();
    const [rerenderKey, setRerenderKey] = useState(0);

    const fetchDatas = async () => {
        try {
            const arr: any = await ChargeTypeAPI.list({ IsExtraCharge: true });
            if (arr) {
                setEntity(arr);
            }
        } finally {
        }
    };

    useEffect(() => {
        fetchDatas();
    }, []);

    const onCheckboxChange = (e: any) => {
        let tempEntity = [...entity];
        tempEntity.forEach(
            (element: any) => (element.isChecked = e.target.checked)
        );
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
                            if (e.target.checked == true) {
                                tempEntity[dataIndex].BaseRate = 1;
                                tempEntity[dataIndex].Total =
                                    tempEntity[dataIndex].RoomChargeTypeRate *
                                    tempEntity[dataIndex].BaseRate;
                            } else {
                                tempEntity[dataIndex].BaseRate = 0;
                                tempEntity[dataIndex].Total = 0;
                            }

                            setEntity(tempEntity);
                        }}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderExtraChargeGroup",
            }),
            key: "RoomChargeTypeGroupName",
            dataIndex: "RoomChargeTypeGroupName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderExtraCharge",
            }),
            key: "RoomChargeTypeName",
            dataIndex: "RoomChargeTypeName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRate",
            }),
            key: "RoomChargeTypeRate",
            dataIndex: "RoomChargeTypeRate",
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
                            formatNumber(entity[dataIndex].RoomChargeTypeRate)
                        }
                        InputLabelProps={{
                            shrink: value || value == 0,
                        }}
                        margin="dense"
                        onChange={(evt: any) => {
                            let tempEntity = [...entity];
                            tempEntity[dataIndex].RoomChargeTypeRate =
                                parseFloat(
                                    evt.target.value.replace(/[^0-9.]/g, "")
                                );
                            tempEntity[dataIndex].Total =
                                tempEntity[dataIndex].RoomChargeTypeRate *
                                tempEntity[dataIndex].BaseRate;
                            setEntity(tempEntity);
                        }}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({
                id: "TextQuantity",
            }),
            key: "Quantity",
            dataIndex: "Quantity",
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
                            formatNumber(entity[dataIndex].BaseRate)
                        }
                        InputLabelProps={{
                            shrink: value || value == 0,
                        }}
                        margin="dense"
                        onChange={(evt: any) => {
                            let tempEntity = [...entity];
                            tempEntity[dataIndex].BaseRate = parseFloat(
                                evt.target.value.replace(/[^0-9.]/g, "")
                            );
                            tempEntity[dataIndex].Total =
                                tempEntity[dataIndex].RoomChargeTypeRate *
                                tempEntity[dataIndex].BaseRate;
                            setEntity(tempEntity);
                        }}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({
                id: "TextAmount",
            }),
            key: "Total",
            dataIndex: "Total",
            render: function render(
                id: any,
                value: any,
                element: any,
                dataIndex: any
            ) {
                return (
                    <div>
                        {entity &&
                        entity[dataIndex] &&
                        entity[dataIndex].Total > 0
                            ? formatNumber(entity[dataIndex].Total)
                            : "0"}
                    </div>
                );
            },
        },
    ];

    return (
        <CustomTable
            columns={columns}
            data={entity}
            hasNew={false}
            id="RoomChargeTypeID"
            listUrl={listUrl}
            excelName={intl.formatMessage({
                id: "ButtonExtraCharge",
            })}
            datagrid={false}
            hasPrint={false}
            hasExcel={false}
            customHeight="none"
        />
    );
};

export default ExtraCharge;
