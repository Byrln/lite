import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Fade,
  Alert
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import { useIntl } from "react-intl";

import { toast } from "react-toastify";
import { PictureAPI } from "lib/api/picture";
import { ModalContext } from "lib/context/modal";
import { mutate } from "swr";

const CustomUpload = ({
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
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();

      reader.onloadend = () => {
        //@ts-ignore
        setImageUrl(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      setFileName(file.name);
      setValue("file", files);

      const reader = new FileReader();
      reader.onloadend = () => {
        //@ts-ignore
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validationSchema = yup.object().shape({
    file: yup.mixed().required(intl.formatMessage({ id: "MsgFileRequired" })),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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

      toast.success(intl.formatMessage({ id: "MsgUploadSuccessful" }));
    } catch (error) {
      toast.error(intl.formatMessage({ id: "MsgUploadFailed" }));
    } finally {
      setLoading(false);
      handleModal();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)} id={id ? id : ""}>
        <Card
          sx={{
            border: dragOver ? '2px dashed #804fe6' : '2px dashed #e0e0e0',
            backgroundColor: dragOver ? '#b49be8' : '#fafafa',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            mb: 3,
            '&:hover': {
              border: '2px dashed #1976d2',
              backgroundColor: '#f3f8ff'
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <input
              type="file"
              accept="image/*"
              {...register("file")}
              onChange={handleFileUpload}
              style={{ display: "none" }}
              id="file-upload"
            />

            {imageUrl ? (
              <Fade in={true}>
                <Box>
                  <Box
                    component="img"
                    src={imageUrl}
                    alt="Preview"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                      borderRadius: 2,
                      boxShadow: 2,
                      mb: 2
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {fileName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {intl.formatMessage({ id: "MsgClickToChangeImage" })}
                  </Typography>
                </Box>
              </Fade>
            ) : (
              <Box>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    backgroundColor: '#e3f2fd'
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1, color: '#1976d2' }}>
                  {intl.formatMessage({ id: "TextUploadImage" })}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {intl.formatMessage({ id: "MsgDragDropOrClick" })}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {intl.formatMessage({ id: "MsgSupportedFormats" })}
                </Typography>
              </Box>
            )}

            <label htmlFor="file-upload" style={{ width: '100%' }}>
              <Button
                variant={imageUrl ? "outlined" : "contained"}
                component="span"
                startIcon={imageUrl ? <ImageIcon /> : <CloudUploadIcon />}
                sx={{
                  mt: 2,
                  minWidth: 150,
                  textTransform: 'none',
                  borderRadius: 2
                }}
              >
                {imageUrl ? intl.formatMessage({ id: "TextChangeImage" }) : intl.formatMessage({ id: "TextChooseFile" })}
              </Button>
            </label>

            {errors.file && (
              <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
                {String(typeof errors.file === 'string' ? errors.file : errors.file.message || 'File upload error')}
              </Alert>
            )}
          </CardContent>
        </Card>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !imageUrl}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
          sx={{
            py: 1.5,
            textTransform: 'none',
            borderRadius: 2,
            fontSize: '1rem'
          }}
        >
          {loading ? intl.formatMessage({ id: "TextUploading" }) : intl.formatMessage({ id: "TextUploadImage" })}
        </Button>
      </form>
    </Box>
  );
};

export default CustomUpload;
