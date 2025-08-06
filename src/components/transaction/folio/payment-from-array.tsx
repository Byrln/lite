import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import * as React from "react";

import { Typography, Paper, Card, CardContent, FormControlLabel, Chip, IconButton } from "@mui/material";
import Stack from "@mui/material/Stack";
import mn from "date-fns/locale/mn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import { FrontOfficeAPI } from "lib/api/front-office";
import axios from "lib/utils/axios";
import moment from "moment";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Divider from "@mui/material/Divider";

import { useGetPaymentMethodGroupAPI } from "lib/api/payment-method-group";
import { useGetChargeTypeGroupAPI } from "lib/api/charge-type-group";
import { useGetChargeTypeAPI, ChargeTypeAPI } from "lib/api/charge-type";
import FolioCharge from "./charge";
import { FolioAPI } from "lib/api/folio";
import { mutate } from "swr";
import FolioPayment from "./payment";
import { CurrenctAPI } from "lib/api/currency";

import PaymentCustomTableData from "./payment-custom-table";
import { useIntl } from "react-intl";

export default function PaymentFormArray({
  FolioID,
  TransactionID,
  handleModal,
  Amount,
}: any) {
  const intl = useIntl();
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
    PayCurrencyID: Yup.string().notRequired(),
    ExchangeRate: Yup.string().notRequired(),
  });

  const {
    register,
    reset,
    resetField,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payment: [
        {
          GroupID: null,
          ItemID: null,
          Amount: Amount ? Amount : null,
          Quantity: 1,
          Description: " ",
          PayCurrencyID: null,
        },
      ],
    },
    resolver: yupResolver(FullDetail),
  });

  const { fields, append, prepend, remove } = useFieldArray({
    control,
    name: "payment",
  });

  const onSubmit = async (data: any) => {
    for (const index in data.payment) {
      const exchangeRate = await CurrenctAPI.exchangeRate({
        CurrencyID: data.payment[index].PayCurrencyID,
      });
      data.payment[index].TransactionID = TransactionID;
      data.payment[index].FolioID = FolioID;
      data.payment[index].TypeID = 2;

      await FolioAPI?.new(data.payment[index]);
    }
    await mutate(`/api/Folio/Items`);
    handleModal();
  };

  const CustomWidthTooltip = styled(
    ({ className, ...props }: TooltipProps) => (
      <Tooltip {...props} classes={{ popper: className }} />
    )
  )({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 500,
      maxHeight: 400,
      background: "white",
      border: "rgba(0, 0, 0, .2) 1px solid",
      overflow: "scroll",
    },
  });

  return (
    <Paper>
      {/* Header Section */}
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PaymentIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Төлбөр нэмэх
        </Typography>
      </Box>

      <LocalizationProvider
        //@ts-ignore
        dateAdapter={AdapterDateFns}
        adapterLocale={mn}
      >
        {/* Date Selection Section */}
        <Card sx={{ mb: 1, px: 2 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CalendarTodayIcon color="action" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={500}>
                Огноо тохиргоо
              </Typography>
            </Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <DateTimePicker
                  disabled={enableDate}
                  value={setedDate}
                  onChange={(newValue: any) => setSetedDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
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
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={1}>
          <Grid item xs={12} md={12} lg={12} className="mb-3">

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Payment Items Section */}
              <Card sx={{ mb: 1 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceWalletIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={500}>
                      Төлбөрийн мэдээлэл
                    </Typography>
                  </Box>
                  <Box overflow="auto">
                    {fields.map((field, index) => (
                      <Card
                        key={field.id}
                        sx={{
                          boxShadow: 0
                        }}
                      >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <FolioPayment
                            id={index}
                            register={register}
                            remove={remove}
                            FolioID={FolioID}
                            TransactionID={TransactionID}
                            resetField={resetField}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Actions Section */}
              <Stack direction="row" justifyContent="center">
                <Tooltip title="Төлбөр хадгалах">
                  <Button
                    variant="contained"
                    type="submit"
                    size="large"
                    startIcon={<SaveIcon />}
                    sx={{
                      width: '100%',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5,
                    }}
                  >
                    Хадгалах
                  </Button>
                </Tooltip>
              </Stack>
            </form>
          </Grid>
          {/* <Grid item xs={12} md={12} lg={12}>
                        <PaymentCustomTableData FolioID={FolioID} />
                    </Grid> */}
        </Grid>
      </LocalizationProvider>
    </Paper>
  );
}
