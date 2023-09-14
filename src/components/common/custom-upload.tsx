import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Stack from "@mui/material/Stack";
import Input from "@mui/material/Input";

import cloudUploadFill from "@iconify/icons-eva/cloud-upload-fill";
import { Icon } from "@iconify/react";

import Button from "@mui/material/Button";
import SubmitButton from "components/common/submit-button";
import { toast } from "react-toastify";
import { PictureAPI } from "lib/api/picture";

const GuestSelect = ({
    GuestID,
    RoomTypeID,
    IsMain,
    IsBanner,
    IsLogo,
    IsDocument,
    Description,
}: any) => {
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
            console.log("values", values);
            // let tempPic = values.file[0];
            // delete values.file;
            if (GuestID) {
                values.GuestID = GuestID;
            }
            if (RoomTypeID) {
                values.RoomTypeID = RoomTypeID;
            }
            if (IsMain) {
                values.IsMain = IsMain;
            }
            if (IsBanner) {
                values.IsBanner = IsBanner;
            }
            if (IsLogo) {
                values.IsLogo = IsLogo;
            }
            if (IsDocument) {
                values.IsDocument = IsDocument;
            }
            if (Description) {
                values.Description = Description;
            }
            // values.push(tempPic);
            // values.file = tempPic;
            console.log("tempValues", values);
            await PictureAPI.upload(values);
            toast("Амжилттай.");
        } finally {
            // setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <label htmlFor="file">
                    {/* <Button variant="outlined" component="span">
                        <Icon icon={cloudUploadFill} /> Upload
                    </Button> */}
                    <Input
                        type="file"
                        {...register("file")}
                        onChange={handleFileUpload}
                    />
                    {/* <input
                        id="file"
                        {...register("file")}
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleFileUpload}
                    /> */}
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
