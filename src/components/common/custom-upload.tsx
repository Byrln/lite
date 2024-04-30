import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input, Grid } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useIntl } from "react-intl";

import SubmitButton from "components/common/submit-button";
import { toast } from "react-toastify";
import { PictureAPI } from "lib/api/picture";
import { ModalContext } from "lib/context/modal";
import { mutate } from "swr";

const GuestSelect = ({
    GuestID,
    RoomTypeID,
    IsMain,
    IsBanner,
    IsLogo,
    IsDocument,
    Description,
    Layout,
    id,
    listUrl,
    mutateBody,
    functionAfterSubmit,
}: any) => {
    const intl = useIntl();
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

            formData.append("file", values.file[0]);

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
                console.log("isBanner", IsBanner);

                formData.append("IsBanner", IsBanner);
            } else {
                formData.append("IsBanner", "false");
            }
            if (IsLogo) {
                formData.append("IsLogo", IsLogo);
            } else {
                formData.append("IsLogo", "false");
            }
            if (IsDocument) {
                formData.append("IsDocument", IsDocument);
            }
            if (Description) {
                formData.append("Description", Description);
            }
            await PictureAPI.upload(formData);
            if (listUrl) {
                mutate(listUrl, mutateBody);
            }

            if (functionAfterSubmit) {
                functionAfterSubmit();
            }

            toast("Амжилттай.");
        } finally {
            setLoading(false);
            handleModal();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} id={id ? id : ""}>
            <Grid container spacing={1}>
                <Grid item xs={Layout == "vertical" ? 8 : 12} className="pb-3">
                    <label htmlFor="file">
                        <Input
                            type="file"
                            id="file"
                            className="inputfile"
                            {...register("file")}
                            onChange={handleFileUpload}
                        />
                        <label htmlFor="file">
                            <AttachFileIcon
                                style={{ fontSize: "0.8125rem" }}
                                className="mr-1"
                            />
                            {intl.formatMessage({
                                id: "ChooseFile",
                            })}
                        </label>
                    </label>
                    {/* </Grid> */}

                    {/* <Grid item xs={Layout == "vertical" ? 4 : 12}> */}
                    <SubmitButton
                        fullWidth={false}
                        loading={loading}
                        customMarginClass="rightBorderRadius"
                        id={id}
                    />
                </Grid>

                <Grid item xs={12} className="pb-3">
                    {imageUrl && (
                        <img //@ts-ignore
                            src={imageUrl}
                            alt="Uploaded Image"
                            height="200"
                            className="mt-3"
                        />
                    )}
                </Grid>
            </Grid>
        </form>
    );
};

export default GuestSelect;
