import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Grid, Switch } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { RateSWR, listUrl, RateAPI } from "lib/api/rate";
import Search from "./search";
import { formatNumber } from "lib/utils/helpers";

const RateList = ({ title, taxData }: any) => {
    const intl = useIntl();
    const validationSchema = yup.object().shape({
        SearchStr: yup.string().nullable(),
        RoomTypeID: yup.string().nullable(),
        RateTypeID: yup.string().nullable(),
        ChannelID: yup.string().nullable(),
        SourceID: yup.string().nullable(),
        RoomChargeDurationID: yup.string().nullable(),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);
    const [isChecked, setIsChecked] = useState(true);
    const [search, setSearch] = useState({});
    const [entity, setEntity] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const { data, error } = RateSWR(search, isChecked);

    useEffect(() => {
        if (data) {
            setEntity(data);
        }
    }, [data]);

    const onToggleChecked = async () => {
        setLoading(true);

        try {
            setIsChecked(!isChecked);
            setSearch({
                ...search,
                TaxIncluded: !isChecked,
            });
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "№",
            key: "test",
            dataIndex: "test",
        },
        {
            title: intl.formatMessage({ id: "ConfigRoomType" }),
            key: "RateTypeName",
            dataIndex: "RateTypeName",
        },
        {
            title: intl.formatMessage({ id: "RoomTypeName" }),
            key: "RoomTypeName",
            dataIndex: "RoomTypeName",
        },
        {
            title: intl.formatMessage({ id: "TextSeasonName" }),
            key: "SeasonName",
            dataIndex: "SeasonName",
        },
        {
            title: intl.formatMessage({ id: "TextSourceName" }),
            key: "SourceName",
            dataIndex: "SourceName",
        },
        {
            title: intl.formatMessage({ id: "ReportCompany" }),
            key: "CustomerName",
            dataIndex: "CustomerName",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderDuration" }),
            key: "DurationName",
            dataIndex: "DurationName",
        },
        {
            title: intl.formatMessage({ id: "BaseRate" }),
            key: "BaseRate",
            dataIndex: "BaseRate",
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
                            entity &&
                            entity[dataIndex] &&
                            formatNumber(entity[dataIndex].BaseRate)
                        }
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="dense"
                        onChange={(evt: any) => {
                            let tempEntity = [...entity];
                            tempEntity[dataIndex].BaseRate = parseFloat(
                                evt.target.value.replace(/[^0-9.]/g, "")
                            );
                            setEntity(tempEntity);
                        }}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({ id: "RowHeaderRateExtraAdult" }),
            key: "ExtraAdult",
            dataIndex: "ExtraAdult",
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
                            entity &&
                            entity[dataIndex] &&
                            formatNumber(entity[dataIndex].ExtraAdult)
                        }
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="dense"
                        onChange={(evt: any) => {
                            let tempEntity = [...entity];
                            tempEntity[dataIndex].ExtraAdult = parseFloat(
                                evt.target.value.replace(/[^0-9.]/g, "")
                            );
                            setEntity(tempEntity);
                        }}
                    />
                );
            },
        },

        {
            title: intl.formatMessage({ id: "RowHeaderRateExtraChild" }),
            key: "ExtraChild",
            dataIndex: "ExtraChild",
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
                        // type="number"
                        fullWidth
                        value={
                            entity &&
                            entity[dataIndex] &&
                            formatNumber(entity[dataIndex].ExtraChild)
                        }
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="dense"
                        onChange={(evt: any) => {
                            let tempEntity = [...entity];
                            tempEntity[dataIndex].ExtraChild = parseFloat(
                                evt.target.value.replace(/[^0-9.]/g, "")
                            );
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
            let tempValues = { RateList: entity };

            await RateAPI.insertWUList(tempValues);

            await mutate(listUrl);
            toast("Амжилттай.");
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <>
            <LoadingButton loading={loading}>
                <Switch
                    checked={isChecked}
                    disabled={loading}
                    onClick={onToggleChecked}
                />
            </LoadingButton>
            Өрөөний тариф нь{" "}
            {taxData &&
                taxData.map((item: any) => {
                    return (
                        <span key={item.TaxID}>
                            {item.TaxID != 1 && "+"}
                            {item.TaxAmount}%
                        </span>
                    );
                })}{" "}
            татвар агуулсан болно.
            <br />
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                modalTitle={title}
                excelName={title}
                pagination={false}
                datagrid={false}
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
            <Grid container spacing={1}>
                <Grid item xs={5}></Grid>
                <Grid item xs={2}>
                    <LoadingButton
                        loading={loading}
                        variant="contained"
                        onClick={onSubmit}
                        size="small"
                        className="mt-3 "
                        fullWidth
                    >
                        Хадгалах
                    </LoadingButton>
                </Grid>
                <Grid item xs={5}></Grid>
            </Grid>
        </>
    );
};

export default RateList;
