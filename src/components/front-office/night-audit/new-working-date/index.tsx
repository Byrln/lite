import Alert from "@mui/material/Alert";
import moment from "moment";
import { format } from "date-fns";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Checkbox } from "@mui/material";
import SubmitButton from "components/common/submit-button";
import { useRouter } from "next/router";

import { WorkingDateAPI } from "lib/api/working-date";
import { dateStringToObj } from "lib/utils/helpers";

const validationSchema = yup.object().shape({
    WorkingDate: yup.date().required("Сонгоно үү"),
});
const NightAuditList = ({ workingDate }: any) => {
    const [loading, setLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    const onSubmit = async (values: any) => {
        setLoading(true);

        try {
            if (isEditable) {
                let tempValues = {
                    NewWorkingDate: moment(values.WorkingDate).format(
                        "YYYY-MM-DD"
                    ),
                };
                await WorkingDateAPI.newBulk(tempValues);
            } else {
                await WorkingDateAPI.new(values);
            }
            toast("Амжилттай.");
            setLoading(false);
            router.replace("/");
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <>
            <Alert severity="warning">
                Та өдрөө өндөрлөж байна{" "}
                {format(new Date(workingDate.replace(/ /g, "T")), "MM/dd/yyyy")}{" "}
                Өдөр өндөрлөгөө хийгдсэнээр засвар орох боломжгүй болохыг
                анхаарна уу.
            </Alert>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="WorkingDate"
                    control={control}
                    defaultValue={moment(
                        dateStringToObj(
                            moment(workingDate).format("YYYY-MM-DD")
                        ),
                        "YYYY-MM-DD"
                    ).add(1, "days")}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label="Ажлын өдөр"
                            value={value}
                            disabled={!isEditable}
                            onChange={(value) =>
                                onChange(
                                    moment(
                                        dateStringToObj(
                                            moment(value).format("YYYY-MM-DD")
                                        ),
                                        "YYYY-MM-DD"
                                    )
                                )
                            }
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id="WorkingDate"
                                    {...register("WorkingDate")}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={!!errors.WorkingDate?.message}
                                    helperText={errors.WorkingDate?.message}
                                />
                            )}
                        />
                    )}
                />
                <Checkbox
                    onChange={(e: any) => {
                        setIsEditable(e.target.checked);
                    }}
                />{" "}
                Өдрийн өндөрлөгөө (Олон хоногоор)
                <SubmitButton loading={loading} disabled={loading} />
            </form>
        </>
    );
};

export default NightAuditList;
