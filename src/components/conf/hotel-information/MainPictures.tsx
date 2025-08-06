import { useEffect, useState, useContext } from "react";
import { useIntl } from "react-intl";
import { Box, Card, CardContent, Typography, Button, Grid, IconButton, CardMedia, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, Close as CloseIcon } from "@mui/icons-material";
import { PictureAPI, listUrl } from "lib/api/picture";
import CustomUpload from "components/common/custom-upload";
import { ModalContext } from "lib/context/modal";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";

const MainPicturesList = () => {
  const intl = useIntl();
  const { handleModal }: any = useContext(ModalContext);
  const [entity, setEntity]: any = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const fetchDatas = async () => {
    try {
      setLoading(true);
      const arr: any = await PictureAPI.get({ IsMain: true });
      if (arr) {
        setEntity(arr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    handleModal(
      true,
      intl.formatMessage({ id: "TextUploadMainPicture" }),
      <CustomUpload
        IsMain={true}
        listUrl={listUrl}
        mutateBody={{ IsMain: true }}
        functionAfterSubmit={fetchDatas}
      />,
      "medium"
    );
  };

  const handleDelete = async (pictureId: any) => {
    if (window.confirm(intl.formatMessage({ id: "MsgConfirmDeletePicture" }))) {
      try {
        await PictureAPI.delete(pictureId);
        toast.success(intl.formatMessage({ id: "MsgPictureDeletedSuccessfully" }));
        fetchDatas();
      } catch (error) {
        toast.error(intl.formatMessage({ id: "MsgFailedToDeletePicture" }));
      }
    }
  };

  const handlePreview = (picture: any) => {
    setSelectedImage(picture);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    fetchDatas();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
          p: 2,
          justifyContent: 'space-between',
          width: '100%',
          bgcolor: '#fff3e0',
          borderRadius: 2,
          border: '1px solid #ffcc02'
        }}>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:image-multiple-outline" width={20} height={20} color="#ff9800" />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e65100' }}>
              {intl.formatMessage({ id: "TextMainPictures" })}
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{
              backgroundColor: '#8854e4',
              '&:hover': { backgroundColor: '#8854e4' },
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            {intl.formatMessage({ id: "TextUploadPicture" })}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {entity && entity.length > 0 ? (
          entity.map((picture: any, index: number) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={picture.PictureID || index}>
              <Card sx={{
                height: '100%',
                boxShadow: 2,
                '&:hover': { boxShadow: 4 },
                transition: 'box-shadow 0.3s ease',
                position: 'relative'
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={picture.PictureFile}
                  alt={picture.PictureName || intl.formatMessage({ id: "TextMainPicture" })}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {picture.PictureName || intl.formatMessage({ id: "TextMainPicture" })}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <IconButton
                      onClick={() => handlePreview(picture)}
                      size="small"
                      sx={{ color: '#8854e4' }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(picture.PictureID)}
                      size="small"
                      sx={{ color: '#d32f2f' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  {intl.formatMessage({ id: "TextNoMainPicturesFound" })}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                  {intl.formatMessage({ id: "TextUploadFirstMainPicture" })}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddNew}
                  sx={{ textTransform: 'none' }}
                >
                  {intl.formatMessage({ id: "TextUploadPicture" })}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Image Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {intl.formatMessage({ id: "TextMainPicturePreview" })}
          </Typography>
          <IconButton onClick={handleClosePreview}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedImage && (
            <img
              src={selectedImage.PictureFile}
              alt={selectedImage.PictureName || intl.formatMessage({ id: "TextMainPicture" })}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} variant="outlined">
            {intl.formatMessage({ id: "TextClose" })}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainPicturesList;
