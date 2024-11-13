import { Controller, useForm } from "react-hook-form";
import { TextField, FormControlLabel, Checkbox } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import { useState } from "react";

import NewEditForm from "components/common/new-edit-form";
import { PosApiAPI, listUrl } from "lib/api/pos-api";
import { useAppState } from "lib/context/app";
import DistrictSelect from "components/select/district";

const validationSchema = yup.object().shape({
    DistrictCode: yup.string().required("Бөглөнө үү"),
    BranchNo: yup.string().required("Бөглөнө үү"),
    SubDistrictCode: yup.string().required("Бөглөнө үү"),
});

const NewEdit = ({ data }: any) => {
    const intl = useIntl();
    const [entity, setEntity]: any = useState({
        SubDistrictCode: data.SubDistrictCode,
        DistrictCode: data.DistrictCode,
    });
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            RegisterNo: data.RegisterNo,
            CompanyName: data.CompanyName,
            BranchNo: data.BranchNo,
            SubDistrictCode: data.SubDistrictCode,
            DistrictCode: data.DistrictCode,
            MerchantTin: data.MerchantTin,
            IsVat: data.IsVat,
            IsCityTax: data.IsCityTax,
        },
        resolver: yupResolver(validationSchema),
    });

    return (
        <NewEditForm
            api={PosApiAPI}
            listUrl={listUrl}
            additionalValues={{
                PosApiID: data.PosApiID,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="RegisterNo"
                label={intl.formatMessage({
                    id: "TextRegisterNo",
                })}
                {...register("RegisterNo")}
                margin="dense"
                error={errors.RegisterNo?.message}
                helperText={errors.RegisterNo?.message}
                disabled
            />
            <TextField
                size="small"
                fullWidth
                id="CompanyName"
                label={intl.formatMessage({
                    id: "TextCompanyName",
                })}
                {...register("CompanyName")}
                margin="dense"
                error={errors.CompanyName?.message}
                helperText={errors.CompanyName?.message}
                disabled
            />
            <TextField
                size="small"
                fullWidth
                id="BranchNo"
                label={intl.formatMessage({
                    id: "TextBranchNo",
                })}
                {...register("BranchNo")}
                margin="dense"
                error={errors.BranchNo?.message}
                helperText={errors.BranchNo?.message}
            />
            <DistrictSelect
                register={register}
                errors={errors}
                entity={entity}
                setEntity={setEntity}
            />
            <TextField
                size="small"
                fullWidth
                id="MerchantTin"
                label={intl.formatMessage({
                    id: "MerchantTin",
                })}
                {...register("MerchantTin")}
                margin="dense"
                error={errors.MerchantTin?.message}
                helperText={errors.MerchantTin?.message}
                disabled
            />
            <FormControlLabel
                control={
                    <Controller
                        name="IsVat"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("IsVat")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                                disabled
                            />
                        )}
                    />
                }
                label={intl.formatMessage({ id: "RowHeaderIsVat" })}
            />
            <FormControlLabel
                control={
                    <Controller
                        name="IsCityTax"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("IsCityTax")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                                disabled
                            />
                        )}
                    />
                }
                label={intl.formatMessage({ id: "RowHeaderIsCityTax" })}
            />
        </NewEditForm>
    );
};

export default NewEdit;
