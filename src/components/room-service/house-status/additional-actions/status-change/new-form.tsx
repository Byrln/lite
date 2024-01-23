import { TextField, Grid, Checkbox, Box } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { HouseKeepingAPI } from "lib/api/house-keeping";
import { ModalContext } from "lib/context/modal";
import { listUrl } from "lib/api/front-office";
import { LoadingButton } from "@mui/lab";
import ReferenceSelect from "components/select/reference";

const VoidTransactionForm = ({
    customMutateUrl,
    RoomID,
    RoomTypeName,
    RoomNo,
}: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);

    const validationSchema = yup.object().shape({
        RoomID: yup.number().required("Сонгоно уу"),
        HouseKeepingStatusID: yup.number().required("Сонгоно уу"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm(formOptions);

    useEffect(() => {
        reset({
            RoomID: RoomID,
        });
    }, []);

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            const res = await HouseKeepingAPI.update(values);

            await mutate(customMutateUrl ? customMutateUrl : listUrl);

            toast("Амжилттай.");

            setLoading(false);
            handleModal();
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("RoomID")} />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        flexWrap: "wrap",
                    }}
                    className="mb-1"
                >
                    <div>Өрөөний төрөл : </div>
                    <div style={{ fontWeight: "600" }}>{RoomTypeName}</div>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        flexWrap: "wrap",
                    }}
                    className="mb-1"
                >
                    <div>Өрөөний дугаар : </div>
                    <div style={{ fontWeight: "600" }}>{RoomNo}</div>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        {/* <UserSelect
                            register={register}
                            errors={errors}
                            IsHouseKeeper={true}
                            nameKey={"HouseKeeperUserID"}
                        /> */}
                        <ReferenceSelect
                            register={register}
                            errors={errors}
                            type="HouseKeepingStatus"
                            label="Төлөв"
                            optionValue="HouseKeepingStatusID"
                            optionLabel="Description"
                        />
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        flexWrap: "wrap",
                    }}
                    className="mb-1"
                >
                    <LoadingButton
                        size="small"
                        type="submit"
                        variant="contained"
                        loading={loading}
                        className="mt-3"
                    >
                        Хадгалах
                    </LoadingButton>
                </Box>
            </form>
        </>
    );
};

export default VoidTransactionForm;
