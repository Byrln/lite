import { useForm, useFieldArray } from "react-hook-form";
import { TextField, Grid, Button, IconButton, Box, Typography, MenuItem } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, ContentCopy as DuplicateIcon } from "@mui/icons-material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { RoomAPI, RoomSWR, listUrl } from "lib/api/room";
import RoomTypeSelect from "components/select/room-type";
import FloorSelect from "components/select/floor";
import RoomSelect from "components/select/room-select";
import { useAppState } from "lib/context/app";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { useContext } from "react";
import { ModalContext } from "lib/context/modal";

// Validation schema for create mode (multi-room)
const createValidationSchema = yup.object().shape({
  rooms: yup.array().of(
    yup.object().shape({
      RoomNo: yup.string().required("Бөглөнө үү"),
      RoomTypeID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
      SortOrder: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    })
  ),
});

// Validation schema for edit mode (single room)
const editValidationSchema = yup.object().shape({
  RoomNo: yup.string().required("Бөглөнө үү"),
  RoomID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
  RoomTypeID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
  SortOrder: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
  FloorID: yup.number().nullable(),
  RoomPhone: yup.string().nullable(),
  Description: yup.string().nullable(),
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
    resolver: yupResolver(isEditMode ? editValidationSchema : createValidationSchema),
    defaultValues: isEditMode ? {
      RoomNo: "",
      RoomID: 0,
      RoomTypeID: 0,
      FloorID: null,
      SortOrder: 1,
      RoomPhone: "",
      Description: ""
    } : {
      rooms: [{
        RoomNo: "",
        RoomID: 0,
        RoomTypeID: 0,
        FloorID: 0,
        SortOrder: getNextSortOrder(),
        RoomPhone: "",
        Description: ""
      }]
    }
  });

  // Fetch current room data for edit mode
  const { data: currentRoomData } = RoomSWR({
    RoomID: isEditMode ? state.editId : 0,
    RoomTypeID: 0,
    FloorID: 0,
    SearchStr: "",
    EmptyRow: false,
  });

  // Auto-populate form when editing
  useEffect(() => {
    if (isEditMode && currentRoomData && currentRoomData.length > 0) {
      const roomToEdit = currentRoomData[0];
      
      // Reset form with the room data using top-level fields for edit mode
      reset({
        RoomNo: roomToEdit.RoomNo || "",
        RoomID: roomToEdit.RoomID || 0,
        RoomTypeID: roomToEdit.RoomTypeID || 0,
        FloorID: roomToEdit.FloorID || null,
        SortOrder: roomToEdit.SortOrder || 1,
        RoomPhone: roomToEdit.RoomPhone || "",
        Description: roomToEdit.Description || "",
       });
      
      console.log('Form reset completed with room data:', roomToEdit);
    }
  }, [isEditMode, currentRoomData, reset, state.editId]);

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
      RoomID: 0, // Clear room ID for duplicate
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
        additionalValues={{
          RoomID: state.editId,
        }}
        reset={reset}
        handleSubmit={handleSubmit}
        setEntity={setBaseStay}
      >
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <TextField
              size="small"
              fullWidth
              id="RoomNo"
              label={intl.formatMessage({ id: "TextRoomNo" })}
              {...register("RoomNo")}
              margin="dense"
              error={!!errors.RoomNo?.message}
              helperText={errors.RoomNo?.message as string}
            />
          </Grid>
          <Grid item xs={4}>
            <RoomTypeSelect
              searchRoomTypeID={watch("RoomTypeID") || 0}
              setSearchRoomTypeID={(id: number) => setValue('RoomTypeID', id)}
              error={!!errors.RoomTypeID}
              helperText={errors.RoomTypeID?.message as string}
            />
          </Grid>
          <Grid item xs={4}>
            <FloorSelect register={register} errors={errors} fieldName="FloorID" />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              fullWidth
              id="RoomPhone"
              label={intl.formatMessage({ id: "TextRoomPhone" })}
              {...register("RoomPhone")}
              margin="dense"
              error={!!errors.RoomPhone?.message}
              helperText={errors.RoomPhone?.message as string}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              fullWidth
              id="Description"
              label={intl.formatMessage({
                id: "RowHeaderDescription",
              })}
              {...register("Description")}
              margin="dense"
              error={!!errors.Description?.message}
              helperText={errors.Description?.message as string}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              type="number"
              fullWidth
              id="SortOrder"
              label={intl.formatMessage({ id: "SortOrder" })}
              {...register("SortOrder")}
              margin="dense"
              error={!!errors.SortOrder?.message}
              helperText={errors.SortOrder?.message as string}
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
              RoomID: 0,
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
                  error={!!(errors.rooms as any)?.[index]?.RoomNo?.message}
                  helperText={(errors.rooms as any)?.[index]?.RoomNo?.message as string}
                />
              </Grid>
              <Grid item xs={4}>
                <RoomTypeSelect
                  searchRoomTypeID={watch(`rooms.${index}.RoomTypeID`) || 0}
                  setSearchRoomTypeID={(id: number) => handleRoomTypeChange(id, index)}
                  error={!!(errors.rooms as any)?.[index]?.RoomTypeID}
                  helperText={(errors.rooms as any)?.[index]?.RoomTypeID?.message as string}
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
                  error={!!(errors.rooms as any)?.[index]?.SortOrder?.message}
                  helperText={(errors.rooms as any)?.[index]?.SortOrder?.message as string}
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
