import { useState } from "react";
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

const ChargeList = ({ entity, handleModal }: any) => {
    const [loading, setLoading] = useState(false);

    const [tableData, setTableData] = useState<any>(
        entity && entity[0]
            ? entity[0].RoomTypeID == 0 &&
              entity[0].RoomID == 0 &&
              entity[0].FloorID == 0
                ? [
                      {
                          RoomChargeTypeID: entity[0].RoomChargeTypeID,
                          RoomTypeID: entity[0].RoomTypeID,
                          RoomID: entity[0].RoomID,
                          FloorID: entity[0].FloorID,
                          ItemCode: entity[0].ItemCode,
                          Location: entity[0].Location,
                          ExpenseAccountNo: entity[0].ExpenseAccountNo,
                          IsService: entity[0].IsService,
                      },
                  ]
                : [
                      {
                          RoomChargeTypeID: entity[0].RoomChargeTypeID,
                          RoomTypeID: 0,
                          RoomID: 0,
                          FloorID: 0,
                          ItemCode: "",
                          Location: "",
                          ExpenseAccountNo: "",
                          IsService: 0,
                      },
                  ]
            : []
    );

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
                    data={entity && entity[0] ? [entity[0]] : []}
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
            {/* <div style={{ display: "flex", flexDirection: "row-reverse" }}>
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
            </div> */}
        </>
    );
};

export default ChargeList;
