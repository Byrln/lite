import { useForm, useFieldArray } from "react-hook-form";
import { TextField, Grid, Button, IconButton, Box, Typography } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, ContentCopy as DuplicateIcon } from "@mui/icons-material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { RoomAPI, RoomSWR, listUrl } from "lib/api/room";
import RoomTypeSelect from "components/select/room-type";
import FloorSelect from "components/select/floor";
import { useAppState } from "lib/context/app";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { useContext } from "react";
import { ModalContext } from "lib/context/modal";

const validationSchema = yup.object().shape({
  rooms: yup.array().of(
    yup.object().shape({
      RoomNo: yup.string().required("Бөглөнө үү"),
      RoomTypeID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
      SortOrder: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    })
  ),
  // For single room edit mode
  RoomNo: yup.string().when('$isEditMode', {
    is: true,
    then: (schema) => schema.required("Бөглөнө үү"),
    otherwise: (schema) => schema.notRequired()
  }),
  RoomTypeID: yup.number().when('$isEditMode', {
    is: true,
    then: (schema) => schema.required("Бөглөнө үү").typeError("Бөглөнө үү"),
    otherwise: (schema) => schema.notRequired()
  }),
  SortOrder: yup.number().when('$isEditMode', {
    is: true,
    then: (schema) => schema.required("Бөглөнө үү").typeError("Бөглөнө үү"),
    otherwise: (schema) => schema.notRequired()
  }),
});

const baseStayDefault = {
  TransactionID: 0,
};

const NewEdit = () => {
  const intl = useIntl();
  const [baseStay, setBaseStay]: any = useState(baseStayDefault);
  const [state]: any = useAppState();
  const { handleModal }: any = useContext(ModalContext);
  const isEditMode = !!state.editId;

  // Fetch room data to calculate next sort order
  const { data: roomData } = RoomSWR({
    RoomID: 0,
    RoomTypeID: 0,
    FloorID: 0,
    SearchStr: "",
    EmptyRow: false,
  });

  // Calculate next sort order
  const getNextSortOrder = () => {
    if (!roomData || !Array.isArray(roomData)) return 1;
    const maxSortOrder = Math.max(...roomData.map((room: any) => room.SortOrder || 0));
    return maxSortOrder + 1;
  };

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    context: { isEditMode },
    defaultValues: {
      rooms: [{
        RoomNo: "",
        RoomTypeID: 0,
        FloorID: 0,
        SortOrder: isEditMode ? 1 : getNextSortOrder(),
        RoomPhone: "",
        Description: ""
      }]
    }
  });

  // Update sort order when room data changes
  useEffect(() => {
    if (roomData && !isEditMode) {
      const nextSortOrder = getNextSortOrder();
      setValue('rooms.0.SortOrder', nextSortOrder);
    }
  }, [roomData, isEditMode, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms"
  });

  const handleRoomTypeChange = (id: number, index?: number) => {
    setValue(`rooms.${index || 0}.RoomTypeID`, id);
  };

  const duplicateRoom = (index: number) => {
    const roomToDuplicate = watch(`rooms.${index}`);
    append({
      ...roomToDuplicate,
      RoomNo: "", // Clear room number for duplicate
      SortOrder: getNextSortOrder() + fields.length,
    });
  };

  const customSubmit = async (values: any) => {
    if (isEditMode) {
      // Single room edit - use existing logic
      return;
    }

    // Multi-room creation - sequential to avoid deadlocks
    try {
      for (const room of values.rooms) {
        await RoomAPI.new(room);
      }

      await mutate(listUrl);
      handleModal();
      toast(`${values.rooms.length} өрөө амжилттай нэмэгдлээ.`);
    } catch (error) {
      toast("Алдаа гарлаа.");
      throw error;
    }
  };

  if (isEditMode) {
    // Single room edit mode
    return (
      <NewEditForm
        api={RoomAPI}
        listUrl={listUrl}
        additionalValues={{}}
        reset={reset}
        handleSubmit={handleSubmit}
        setEntity={setBaseStay}
      >
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <TextField
              size="small"
              fullWidth
              id="TextRoomNo"
              label={intl.formatMessage({ id: "TextRoomNo" })}
              {...register("rooms.0.RoomNo")}
              margin="dense"
              error={!!errors.rooms?.[0]?.RoomNo?.message}
              helperText={errors.rooms?.[0]?.RoomNo?.message as string}
            />
          </Grid>
          <Grid item xs={4}>
            <RoomTypeSelect
              searchRoomTypeID={watch("rooms.0.RoomTypeID") || 0}
              setSearchRoomTypeID={(id: number) => handleRoomTypeChange(id)}
              error={!!errors.rooms?.[0]?.RoomTypeID}
              helperText={errors.rooms?.[0]?.RoomTypeID?.message as string}
            />
          </Grid>
          <Grid item xs={4}>
            <FloorSelect register={register} errors={errors} />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              fullWidth
              id="TextRoomPhone"
              label={intl.formatMessage({ id: "TextRoomPhone" })}
              {...register("rooms.0.RoomPhone")}
              margin="dense"
              error={!!errors.rooms?.[0]?.RoomPhone?.message}
              helperText={errors.rooms?.[0]?.RoomPhone?.message as string}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              fullWidth
              id="RowHeaderDescription"
              label={intl.formatMessage({
                id: "RowHeaderDescription",
              })}
              {...register("rooms.0.Description")}
              margin="dense"
              error={!!errors.rooms?.[0]?.Description?.message}
              helperText={errors.rooms?.[0]?.Description?.message as string}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              type="number"
              fullWidth
              id="SortOrder"
              label={intl.formatMessage({ id: "SortOrder" })}
              {...register("rooms.0.SortOrder")}
              defaultValue={1}
              margin="dense"
              error={!!errors.rooms?.[0]?.SortOrder?.message}
              helperText={errors.rooms?.[0]?.SortOrder?.message as string}
            />
          </Grid>
        </Grid>
      </NewEditForm>
    );
  }

  // Multi-room creation mode
  return (
    <NewEditForm
      api={RoomAPI}
      listUrl={listUrl}
      additionalValues={{}}
      reset={reset}
      handleSubmit={handleSubmit}
      setEntity={setBaseStay}
      customSubmit={customSubmit}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{intl.formatMessage({ id: "ButtonAddRoom" })}</Typography>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => append({
              RoomNo: "",
              RoomTypeID: 0,
              FloorID: 0,
              SortOrder: getNextSortOrder() + fields.length,
              RoomPhone: "",
              Description: ""
            })}
          >
            {intl.formatMessage({ id: "ButtonAddRoom" })}

          </Button>
        </Box>

        {fields.map((field, index) => (
          <Box key={field.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">{intl.formatMessage({ id: "TextRoom" })} #{index + 1}</Typography>
              <Box>
                <IconButton
                  size="small"
                  onClick={() => duplicateRoom(index)}
                  title="Хуулах"
                >
                  <DuplicateIcon />
                </IconButton>
                {fields.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => remove(index)}
                    title="Устгах"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </Box>

            <Grid container spacing={1}>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  fullWidth
                  label={intl.formatMessage({ id: "TextRoomNo" })}
                  {...register(`rooms.${index}.RoomNo`)}
                  margin="dense"
                  error={!!errors.rooms?.[index]?.RoomNo?.message}
                  helperText={errors.rooms?.[index]?.RoomNo?.message as string}
                />
              </Grid>
              <Grid item xs={4}>
                <RoomTypeSelect
                  searchRoomTypeID={watch(`rooms.${index}.RoomTypeID`) || 0}
                  setSearchRoomTypeID={(id: number) => handleRoomTypeChange(id, index)}
                  error={!!errors.rooms?.[index]?.RoomTypeID}
                  helperText={errors.rooms?.[index]?.RoomTypeID?.message as string}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  fullWidth
                  label={intl.formatMessage({ id: "SortOrder" })}
                  {...register(`rooms.${index}.SortOrder`)}
                  margin="dense"
                  type="number"
                  error={!!errors.rooms?.[index]?.SortOrder?.message}
                  helperText={errors.rooms?.[index]?.SortOrder?.message as string}
                />
              </Grid>
              <Grid item xs={4}>
                <FloorSelect register={register} errors={errors} fieldName={`rooms.${index}.FloorID`} />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  fullWidth
                  label={intl.formatMessage({ id: "TextRoomPhone" })}
                  {...register(`rooms.${index}.RoomPhone`)}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  fullWidth
                  label={intl.formatMessage({ id: "RowHeaderDescription" })}
                  {...register(`rooms.${index}.Description`)}
                  margin="dense"
                  multiline
                  rows={1}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
    </NewEditForm>
  );
};

export default NewEdit;
