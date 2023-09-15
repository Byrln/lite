import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Stack from "@mui/material/Stack";
import Input from "@mui/material/Input";

import SubmitButton from "components/common/submit-button";
import { toast } from "react-toastify";
import { PictureAPI } from "lib/api/picture";
import { ModalContext } from "lib/context/modal";

const GuestSelect = ({
    GuestID,
    RoomTypeID,
    IsMain,
    IsBanner,
    IsLogo,
    IsDocument,
    Description,
}: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            //@ts-ignore
            setImageUrl(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const validationSchema = yup.object().shape({
        file: yup.mixed().required("File is required"),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
    } = useForm(formOptions);

    const onSubmit = async (values: any) => {
        try {
            setLoading(true);
            const formData = new FormData();

            if (GuestID) {
                formData.append("GuestID", GuestID);
            }
            if (RoomTypeID) {
                formData.append("RoomTypeID", RoomTypeID);
            }
            if (IsMain) {
                formData.append("IsMain", IsMain);
            }
            if (IsBanner) {
                formData.append("IsBanner", IsBanner);
            }
            if (IsLogo) {
                formData.append("IsLogo", IsLogo);
            }
            if (IsDocument) {
                formData.append("IsDocument", IsDocument);
            }
            if (Description) {
                formData.append("Description", Description);
            }
            await PictureAPI.upload(formData);
            toast("Амжилттай.");
        } finally {
            setLoading(false);
            handleModal();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <label htmlFor="file">
                    <Input
                        type="file"
                        {...register("file")}
                        onChange={handleFileUpload}
                    />
                </label>
            </Stack>

            <SubmitButton loading={loading} />

            {imageUrl && (
                <img //@ts-ignore
                    src={imageUrl}
                    alt="Uploaded Image"
                    height="300"
                    className="mt-3"
                />
            )}
        </form>
    );
};

export default GuestSelect;
