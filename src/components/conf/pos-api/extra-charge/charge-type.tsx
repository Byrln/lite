import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";

import { listUrl } from "lib/api/front-office";
import { ChargeTypeAPI } from "lib/api/charge-type";
import CustomTable from "components/common/custom-table";
import ChargeTypeGroupSelect from "components/select/charge-type-group";
import ItemCodeSelect from "components/select/item-code";

const ExtraCharge = ({ handleModal }: any) => {
    const [entity, setEntity] = useState<any>(null);
    const intl = useIntl();
    const [rerenderKey, setRerenderKey] = useState(0);
    const [chargeType, setChargeType] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDatas = async () => {
        try {
            const arr: any = await ChargeTypeAPI.list({
                RoomChargeTypeGroupID: chargeType,
            });
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
            title: intl.formatMessage({
                id: "RowHeaderExtraCharge",
            }),
            key: "RoomChargeTypeName",
            dataIndex: "RoomChargeTypeName",
        },
        {
            title: "",
            key: "ServiceCode",
            dataIndex: "ServiceCode",
            render: (id: any, value: any, element: any, dataIndex: any) => {
                return (
                    <div style={{ width: "300px" }}>
                        <ItemCodeSelect
                            key2={`${rerenderKey}-${dataIndex}`} // Ensure each ItemCodeSelect has a unique key
                            value={
                                entity &&
                                entity[dataIndex] &&
                                entity[dataIndex].ServiceCode != " " &&
                                entity[dataIndex].ServiceCode != "" &&
                                entity[dataIndex].ServiceCode != 0
                                    ? entity[dataIndex].ServiceCode
                                    : 0
                            }
                            onChange={(evt: any) => {
                                let tempEntity = [...entity];
                                tempEntity[dataIndex].ServiceCode =
                                    evt.target.value;
                                setEntity(tempEntity);
                            }}
                        />
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
                        item.ServiceCode != " " &&
                        item.ServiceCode != "" &&
                        item.ServiceCode != null
                )
                .forEach(async (element: any) => {
                    try {
                        await ChargeTypeAPI.update(element);
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
                <ChargeTypeGroupSelect
                    IsRoomCharge={false}
                    IsExtraCharge={true}
                    IsMiniBar={false}
                    IsDiscount={false}
                    register={register}
                    errors={errors}
                    onChange={setChargeType}
                />
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
