import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { mutate } from "swr";

import CustomTable from "components/common/custom-table";
import {
    extraChargeUrl,
    AccountingExtraChargeAPI,
} from "lib/api/accounting-extra-charge";
import CustomSelect from "components/common/custom-select";
import { toast } from "react-toastify";
import { RoomAPI } from "lib/api/room";

const RoomType = ({ entity, handleModal }: any) => {
    const [loading, setLoading] = useState(false);

    const [tableData, setTableData] = useState<any>();

    useEffect(() => {
        const fetchDatas = async () => {
            try {
                if (entity) {
                    let tempValue: any = [];
                    let arr: any = await RoomAPI.get(null);

                    arr.forEach((element: any) => {
                        const filteredData = entity.filter(
                            (item: any) =>
                                item.RoomTypeID == element.RoomTypeID &&
                                item.RoomID == element.RoomID
                        );

                        tempValue.push({
                            RoomTypeID: element.RoomTypeID,
                            RoomTypeName: element.RoomTypeName,
                            RoomID: element.RoomID,
                            RoomNo: element.RoomNo,
                            RoomChargeTypeID:
                                entity &&
                                entity[0] &&
                                entity[0].RoomChargeTypeID,
                            RoomChargeTypeName:
                                entity &&
                                entity[0] &&
                                entity[0].RoomChargeTypeName,
                            ItemCode:
                                filteredData &&
                                filteredData[0] &&
                                filteredData[0].ItemCode
                                    ? filteredData[0].ItemCode
                                    : "",
                            Location:
                                filteredData &&
                                filteredData[0] &&
                                filteredData[0].Location
                                    ? filteredData[0].Location
                                    : "",
                            ExpenseAccountNo:
                                filteredData &&
                                filteredData[0] &&
                                filteredData[0].ExpenseAccountNo
                                    ? filteredData[0].ExpenseAccountNo
                                    : "",
                            IsService:
                                filteredData &&
                                filteredData[0] &&
                                filteredData[0].IsService
                                    ? filteredData[0].IsService
                                    : 0,
                        });
                    });
                    setTableData(tempValue);
                }
            } finally {
            }
        };

        fetchDatas();
    }, [entity]);

    const intl = useIntl();
    const columns = [
        {
            title: intl.formatMessage({
                id: "Nn",
            }),
            key: "Nn",
            dataIndex: "Nn",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderCharge",
            }),
            key: "RoomChargeTypeName",
            dataIndex: "RoomChargeTypeName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRoomNo",
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
            excelRenderPass: true,
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
                        value={
                            tableData &&
                            tableData[dataIndex] &&
                            tableData[dataIndex].ItemCode
                        }
                        InputLabelProps={{
                            shrink: value || value == 0,
                        }}
                        margin="dense"
                        onChange={(evt: any) => {
                            let tempEntity = [...tableData];
                            tempEntity[dataIndex].ItemCode = evt.target.value;
                            setTableData(tempEntity);
                        }}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderLocation",
            }),
            key: "Location",
            dataIndex: "Location",
            excelRenderPass: true,
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
                        value={
                            tableData &&
                            tableData[dataIndex] &&
                            tableData[dataIndex].Location
                        }
                        InputLabelProps={{
                            shrink: value || value == 0,
                        }}
                        margin="dense"
                        onChange={(evt: any) => {
                            let tempEntity = [...tableData];
                            tempEntity[dataIndex].Location = evt.target.value;
                            setTableData(tempEntity);
                        }}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({
                id: "TextExpenseAccountNo",
            }),
            key: "ExpenseAccountNo",
            dataIndex: "ExpenseAccountNo",
            excelRenderPass: true,
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
                        value={
                            tableData &&
                            tableData[dataIndex] &&
                            tableData[dataIndex].ExpenseAccountNo
                        }
                        InputLabelProps={{
                            shrink: value || value == 0,
                        }}
                        margin="dense"
                        onChange={(evt: any) => {
                            let tempEntity = [...tableData];
                            tempEntity[dataIndex].ExpenseAccountNo =
                                evt.target.value;
                            setTableData(tempEntity);
                        }}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({
                id: "TextIsService",
            }),
            key: "IsService",
            dataIndex: "IsService",
            excelRenderPass: true,
            render: function render(
                id: any,
                value: any,
                element: any,
                dataIndex: any
            ) {
                return (
                    <CustomSelect
                        register={(value: any) => {}}
                        errors={{}}
                        field="IsService"
                        label="IsService"
                        options={[
                            { key: 0, value: "" },
                            { key: 1, value: "Үйлчилгээ" },
                            { key: 2, value: "Материал" },
                        ]}
                        optionValue="key"
                        optionLabel="value"
                        onChange={(value: any) => {
                            let tempEntity = [...tableData];
                            tempEntity[dataIndex].IsService = Number(value);
                            setTableData(tempEntity);
                        }}
                        entity={tableData[dataIndex]}
                    />
                );
            },
        },
    ];

    const onSubmit = async () => {
        try {
            setLoading(true);
            let tempValue = { ChargeDetail: tableData };
            await AccountingExtraChargeAPI.insertWU(tempValue);
            mutate(extraChargeUrl);
            toast("Амжилттай.");
        } finally {
            setLoading(false);
            handleModal();
        }
    };

    return (
        <>
            {entity && (
                <CustomTable
                    columns={columns}
                    data={tableData}
                    api={AccountingExtraChargeAPI}
                    hasNew={false}
                    hasUpdate={false}
                    hasDelete={false}
                    hasPrint={false}
                    hasExcel={false}
                    hasShow={false}
                    id="Nn"
                    listUrl={extraChargeUrl}
                    datagrid={false}
                />
            )}
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                <LoadingButton
                    loading={loading}
                    variant="contained"
                    onClick={onSubmit}
                    size="small"
                    className="mt-3"
                >
                    <SaveIcon
                        style={{ fontSize: "0.8125rem" }}
                        className="mr-1"
                    />
                    {intl.formatMessage({ id: "ButtonSave" })}
                </LoadingButton>
            </div>
        </>
    );
};

export default RoomType;
