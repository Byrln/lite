import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { Typography, Paper, Card, CardContent, FormControlLabel, Tooltip, Chip } from "@mui/material";
import Stack from "@mui/material/Stack";
import mn from "date-fns/locale/mn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";

import { FrontOfficeAPI } from "lib/api/front-office";
import Iconify from "components/iconify/iconify";
import axios from "lib/utils/axios";
import moment from "moment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Divider from "@mui/material/Divider";

import Box from "@mui/material/Box";

import { useGetPaymentMethodGroupAPI } from "lib/api/payment-method-group";
import { useGetChargeTypeGroupAPI } from "lib/api/charge-type-group";
import { useGetChargeTypeAPI, ChargeTypeAPI } from "lib/api/charge-type";
import FolioCharge from "./charge";
import { FolioAPI } from "lib/api/folio";
import { mutate } from "swr";
import { Add } from "@mui/icons-material";

export default function ChargeFormArray({
  FolioID,
  TransactionID,
  handleModal,
}: any) {
  const [workingDate, setWorkingDate] = useState(null);
  const [newGroupCount, setNewGroupCount]: any = useState(1);

  useEffect(() => {
    fetchDatas();
  }, []);

  const fetchDatas = async () => {
    let response = await FrontOfficeAPI.workingDate();
    if (response.status == 200) {
      setWorkingDate(response.workingDate[0].WorkingDate);
    }
  };

  const [setedDate, setSetedDate] = useState<Date>(
    workingDate ? workingDate : new Date()
  );

  const [enableDate, setEnableDate] = useState(true);

  const [chekedTrue, setChekedTrue] = useState(false);

  const handleChekbox = () => {
    if (chekedTrue == true) {
      setChekedTrue(false);
      setEnableDate(true);
    } else {
      setChekedTrue(true);
      setEnableDate(false);
    }
  };

  const FullDetail = Yup.object().shape({
    GroupID: Yup.string().notRequired(),
    ItemID: Yup.string().notRequired(),
    Amount: Yup.string().notRequired(),
    Quantity: Yup.string().notRequired(),
    Description: Yup.string().notRequired(),
  });

  const {
    register,
    reset,
    resetField,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      charge: [
        {
          GroupID: null,
          ItemID: null,
          Amount: null,
          Quantity: 1,
          Description: " ",
        },
      ],
    },
    resolver: yupResolver(FullDetail),
  });

  const { fields, append, prepend, remove } = useFieldArray({
    control,
    name: "charge",
  });

  const onSubmit = async (data: any) => {
    for (const index in data.charge) {
      data.charge[index].TransactionID = TransactionID;
      data.charge[index].FolioID = FolioID;
      data.charge[index].TypeID = 1;
      await FolioAPI?.new(data.charge[index]);
    }
    await mutate(`/api/Folio/Items`);
    handleModal();
  };

  return (
    <Paper>
      <LocalizationProvider
        //@ts-ignore
        dateAdapter={AdapterDateFns}
        adapterLocale={mn}
      >
        {/* Header Section */}
        <Box>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Add color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Тооцоо нэмэх
            </Typography>
          </Box>

          <Card elevation={1} sx={{ mb: 2 }}>
            <CardContent sx={{ pb: 2 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    <Typography variant="subtitle2" fontWeight={500}>
                      Огноо
                    </Typography>
                  </Stack>
                  <DateTimePicker
                    disabled={enableDate}
                    value={setedDate}
                    onChange={(newValue: any) => setSetedDate(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mt: { xs: 0, sm: 4 } }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={chekedTrue}
                          onChange={handleChekbox}
                          size="small"
                          icon={<EditIcon fontSize="small" />}
                          checkedIcon={<EditIcon fontSize="small" color="primary" />}
                        />
                      }
                      label={
                        <Typography variant="body2" fontWeight={400}>
                          Огноо өөрчлөх
                        </Typography>
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Charge Items Section */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Iconify icon="mdi:receipt-text" sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="subtitle1" fontWeight={600}>
              Тооцооны зүйлүүд
            </Typography>
            <Chip
              label={`${fields.length} зүйл`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {fields.map((field, index) => (
                <Card key={field.id} elevation={1} sx={{
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    elevation: 3,
                    transform: 'translateY(-1px)'
                  }
                }}>
                  <CardContent sx={{ p: 2 }}>
                    <FolioCharge
                      id={index}
                      register={register}
                      remove={remove}
                      FolioID={FolioID}
                      TransactionID={TransactionID}
                      resetField={resetField}
                      append={append}
                      getValues={getValues}
                    />
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {/* Action Buttons */}
            <Card elevation={1} sx={{ mt: 3, bgcolor: 'grey.50' }}>
              <CardContent>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  spacing={2}
                >
                  {/* Add Items Section */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Tooltip title="Шинэ тооцоо нэмэх">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          for (let i = 0; i < newGroupCount; i++) {
                            append({
                              GroupID: null,
                              ItemID: null,
                              Amount: null,
                              Quantity: 1,
                              Description: " ",
                            });
                          }
                          setNewGroupCount(1);
                        }}
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>

                    <TextField
                      type="number"
                      size="small"
                      label="Тоо ширхэг"
                      value={newGroupCount}
                      onChange={(e: any) => {
                        setNewGroupCount(e.target.value);
                      }}
                      inputProps={{ min: 1, max: 10 }}
                      sx={{ width: 120 }}
                    />

                    <Typography variant="body2" color="text.secondary">
                      {newGroupCount > 1 ? `${newGroupCount} зүйл нэмэх` : '1 зүйл нэмэх'}
                    </Typography>
                  </Stack>

                  {/* Save Button */}
                  <Button
                    variant="contained"
                    type="submit"
                    size="large"
                    startIcon={<SaveIcon />}
                    sx={{
                      minWidth: 140,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5,
                    }}
                  >
                    Хадгалах
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </form>
        </Box>
      </LocalizationProvider>
    </Paper>
  );
}
