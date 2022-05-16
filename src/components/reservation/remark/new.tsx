import {useContext, useState} from "react";
import RoomTypeSelect from "../../select/room-type";
import RoomSelect from "../../select/room";
import {TextField} from "@mui/material";
import ReasonSelect from "../../select/reason";
import SubmitButton from "../../common/submit-button";
import {LoadingButton} from "@mui/lab";
import {fToCustom} from "../../../lib/utils/format-time";
import {listUrl, ReservationRemarkAPI} from "../../../lib/api/reservation-remark";
import {mutate} from "swr";
import {toast} from "react-toastify";
import {ModalContext} from "../../../lib/context/modal";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import TextareaAutosize from '@mui/material/TextareaAutosize';

const RemarkNew = ({TransactionID, setEditMode}: any) => {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: any) => {
        setLoading(true);

        try {

            console.log(values);
            let res = await ReservationRemarkAPI.new(values);
            await mutate(listUrl);

            setEditMode(false);

            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const validationSchema = yup.object().shape({
        TransactionID: yup.number().required("Бөглөнө үү"),
        Remarks: yup.string().required("Бөглөнө үү"),
    });
    const formOptions = {resolver: yupResolver(validationSchema)};

    const {
        reset,
        register,
        handleSubmit,
        formState: {errors},
    } = useForm(formOptions);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <input
                type={"hidden"}
                value={TransactionID}
                {...register('TransactionID')}
            />

            <div className={"mb-1"}>

                <TextField
                    id="Remarks"
                    label="Remarks"
                    multiline
                    minRows={4}
                    maxRows={4}
                    variant="standard"
                    {...register('Remarks')}
                    error={errors.Remarks?.message}
                    helperText={errors.Remarks?.message}
                />
            </div>

            <div className={"mb-1"}>
                <LoadingButton
                    size="small"
                    type="submit"
                    variant="outlined"
                    loading={loading}
                >Submit</LoadingButton>
            </div>

        </form>
    );

};

export default RemarkNew;