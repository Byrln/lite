import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";

import { listUrl } from "lib/api/front-office";
import { ChargeTypeGroupAPI } from "lib/api/charge-type-group";
import CustomTable from "components/common/custom-table";
import ChargeTypeGroupSelect from "components/select/charge-type-group";
import ItemCodeSelect from "components/select/item-code";

const ExtraCharge = ({ handleModal, data }: any) => {
    const [entity, setEntity] = useState<any>(null);
    const intl = useIntl();
    const [rerenderKey, setRerenderKey] = useState(0);
    const [chargeType, setChargeType] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDatas = async () => {
        try {
            const arr: any = await ChargeTypeGroupAPI.list();
            if (arr) {
                setEntity(arr);
                setRerenderKey((prevKey) => prevKey + 1);
            }
        } finally {
        }
    };

    useEffect(() => {
        fetchDatas();
        setRerenderKey((prevKey) => prevKey + 1);
    }, [chargeType]);

    const columns = [
        {
            title: "№",
            key: "test",
            dataIndex: "test",
        },

        {
            title: intl.formatMessage({
                id: "RowHeaderExtraChargeGroup",
            }),
            key: "RoomChargeTypeGroupName",
            dataIndex: "RoomChargeTypeGroupName",
        },

        {
            title: "",
            key: "ServiceCode",
            dataIndex: "ServiceCode",
            render: (id: any, value: any, element: any, dataIndex: any) => {
                return (
                    <div style={{ width: "300px" }}>
                        <FormControl fullWidth>
                            <InputLabel id="my-select-label">
                                Сонгоно уу
                            </InputLabel>
                            <Select
                                labelId="my-select-label"
                                id="my-select"
                                value={
                                    entity &&
                                    entity[dataIndex] &&
                                    entity[dataIndex].PosApiID != " " &&
                                    entity[dataIndex].PosApiID != "" &&
                                    entity[dataIndex].PosApiID != 0
                                        ? entity[dataIndex].PosApiID
                                        : 0
                                } // Controlled component with the current selected value
                                onChange={(evt: any) => {
                                    let tempEntity = [...entity];
                                    tempEntity[dataIndex].PosApiID =
                                        evt.target.value;
                                    setEntity(tempEntity);
                                }} // onChange handler
                                key={`${rerenderKey}-${dataIndex}`} // Set a key if needed to force rerender
                                size="small"
                            >
                                {data &&
                                    data.map((option: any) => (
                                        <MenuItem
                                            key={option.PosApiID}
                                            value={option.PosApiID}
                                        >
                                            {option.RegisterNo}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </div>
                );
            },
        },
    ];

    const validationSchema = yup.object().shape({
        test: yup.string().required("Username is required"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions);

    const onSubmit = async () => {
        try {
            setLoading(true);

            entity
                .filter(
                    (item: any) =>
                        item.PosApiID != " " &&
                        item.PosApiID != "" &&
                        item.PosApiID != null
                )
                .forEach(async (element: any) => {
                    try {
                        let value = {
                            RoomChargeTypeGroupID:
                                element.RoomChargeTypeGroupID,
                            RoomChargeTypeGroupName:
                                element.RoomChargeTypeGroupName,
                            SortOrder: element.SortOrder,
                            PosApiID: element.PosApiID,
                        };
                        await ChargeTypeGroupAPI.update(value);
                    } finally {
                    }
                });
            setLoading(false);
            toast("Амжилттай.");

            handleModal();
        } finally {
        }
    };

    return (
        <>
            <div style={{ height: "60vh", overflow: "scroll" }}>
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
                    size="small"
                />
            </div>
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
                <LoadingButton
                    size="small"
                    type="submit"
                    variant="contained"
                    loading={loading}
                    onClick={() => onSubmit()}
                    className="mt-3"
                >
                    {intl.formatMessage({
                        id: "ButtonSave",
                    })}
                </LoadingButton>
            </Box>
        </>
    );
};

export default ExtraCharge;
