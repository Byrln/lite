import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Checkbox, Grid, FormControlLabel } from "@mui/material";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { mutate } from "swr";

import CustomTable from "components/common/custom-table";
import {
    PendingRoomChargeSWR,
    listUrl,
    ChargeAPI,
    listUrl2,
} from "lib/api/charge";
import NewEdit from "./new-edit";

const PendingRoomChargeList = ({
    title,
    setPendingPendingRoomChargeCompleted,
}: any) => {
    const { data, error } = PendingRoomChargeSWR();
    const [entity, setEntity] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [allCheck, setAllCheck] = useState<any>(false);
    console.log("entity", entity);
    useEffect(() => {
        if (data) {
            setEntity(data);
        }

        if (data && data.length == 0) {
            setPendingPendingRoomChargeCompleted(true);
        }
    }, [data]);

    const columns = [
        {
            title: "Зочин",
            key: "GuestName",
            dataIndex: "GuestName",
        },
        {
            title: "Өрөө",
            key: "RoomFullNo",
            dataIndex: "RoomFullNo",
        },
        {
            title: "Тарифын төрөл",
            key: "RoomChargeTypeName",
            dataIndex: "RoomChargeTypeName",
        },
        {
            title: "Үнэ",
            key: "Amount",
            dataIndex: "Amount",
        },
        {
            title: "Огноо",
            key: "ChargeDate",
            dataIndex: "ChargeDate",
        },
        {
            title: "Тариф",
            key: "BaseRate",
            dataIndex: "BaseRate",
            render: function render(
                id: any,
                value: any,
                element: any,
                dataIndex: any
            ) {
                return (
                    <Checkbox
                        checked={
                            entity &&
                            entity[dataIndex] &&
                            entity[dataIndex].isChecked
                        }
                        onChange={(e: any) => {
                            let tempEntity = [...entity];
                            tempEntity[dataIndex].isChecked = e.target.checked;
                            setEntity(tempEntity);
                        }}
                    />
                );
            },
        },
    ];

    const onSubmit = async () => {
        setLoading(true);
        try {
            let newEntity = [];
            newEntity = entity.filter(
                (element: any) => element.isChecked == true
            );
            let values: any = {};

            if (newEntity && entity.length == newEntity.length) {
                values.PostAll = true;
            } else {
                values.RoomChargeIDs = [];
                newEntity.forEach((element: any) =>
                    values.RoomChargeIDs.push({ ID: element.RoomChargeID })
                );
            }

            await ChargeAPI.send(values);
            await mutate(listUrl2);

            toast("Амжилттай.");
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <>
            {entity && (
                <CustomTable
                    columns={columns}
                    data={data}
                    error={error}
                    // api={NightAuditAPI}
                    hasNew={false}
                    hasUpdate={false}
                    hasDelete={false}
                    id="RoomChargeID"
                    listUrl={listUrl}
                    modalTitle={title}
                    modalContent={<NewEdit />}
                    excelName={title}
                    hasPrint={false}
                    hasExcel={false}
                    datagrid={false}
                />
            )}

            <Grid container spacing={1}>
                <Grid item xs={5}>
                    {" "}
                    {/* <FormControlLabel
                        control={ */}
                    {/* <Checkbox
                        checked={allCheck}
                        onChange={(e: any) => {
                            let tempEntity = [...entity];
                            console.log("tempEntity", tempEntity);

                            tempEntity.map(
                                (element: any) => (
                                    console.log("element", element),
                                    (element.isChecked = e.target.checked)
                                )
                            );
                            console.log("newtempEntity", tempEntity);
                            setEntity(tempEntity);
                            setAllCheck(e.target.checked);
                        }}
                    /> */}
                    {/* }
                        label="Бүгдийг сонгох"
                    /> */}
                </Grid>
                <Grid item xs={2}>
                    <LoadingButton
                        loading={loading}
                        variant="contained"
                        onClick={onSubmit}
                        size="small"
                        className="mt-3 "
                        fullWidth
                    >
                        Илгээх
                    </LoadingButton>
                </Grid>
                <Grid item xs={5}></Grid>
            </Grid>
        </>
    );
};

export default PendingRoomChargeList;
