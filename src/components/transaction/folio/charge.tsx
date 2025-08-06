import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Typography, Divider } from "@mui/material";
import Stack from "@mui/material/Stack";
import mn from "date-fns/locale/mn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FrontOfficeAPI } from "lib/api/front-office";
import moment from "moment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

import Iconify from "components/iconify/iconify";
import { useGetPaymentMethodGroupAPI } from "lib/api/payment-method-group";
import { useGetChargeTypeGroupAPI } from "lib/api/charge-type-group";
import { useGetChargeTypeAPI, ChargeTypeAPI } from "lib/api/charge-type";
import { AnyMxRecord } from "dns";

export default function FolioCharge({
  FolioID,
  TransactionID,
  register,
  remove,
  id,
  resetField,
  append,
  getValues,
}: any) {
  const { chargegroup } = useGetChargeTypeGroupAPI();

  const [groupPick, setGroupPick] = useState("");
  const [typePick, setTypePick] = useState("");
  const [filteredData, setFilteredData] = useState<any>({});

  const [quantity, setQuantity] = useState(1);

  const [newchargeType, setNewChargeType] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);

  const handleChange = (event: SelectChangeEvent) => {
    setGroupPick(event.target.value as string);
    resetField(`charge.${id}.Groupid`, {
      defaultValue: event.target.value as string,
    });
    setChekedTrue(false);
  };

  const fetchTest = async () => {
    const chargetype = await ChargeTypeAPI.get(null, {
      RoomChargeTypeGroupID: groupPick,
    });

    setNewChargeType(chargetype);
    setTypePick("");
  };

  const [chekedTrue, setChekedTrue] = useState(true);

  const handleDuplicate = () => {
    if (append && getValues) {
      const currentValues = getValues(`charge.${id}`);
      append({
        GroupID: currentValues.GroupID || null,
        ItemID: currentValues.ItemID || null,
        Amount: currentValues.Amount || null,
        Quantity: currentValues.Quantity || 1,
        Description: currentValues.Description || " ",
      });
    }
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setTypePick(event.target.value as string);
    resetField(`charge.${id}.ItemID`, {
      defaultValue: event.target.value as string,
    });

    // resetField(`charge.${id}.Amount`,{
    //     defaultValue: typePickFilter && typePickFilter[0] && typePickFilter[0].RoomChargeTypeRate
    // })
  };

  useEffect(() => {
    fetchTest();
  }, [groupPick]);

  useEffect(() => {
    if (typePick) {
      let tempfiltered = newchargeType?.filter(
        (obj: { RoomChargeTypeID: any }) =>
          obj.RoomChargeTypeID == typePick
      );
      setFilteredData(tempfiltered);

      resetField(`charge.${id}.Amount`, {
        defaultValue:
          tempfiltered &&
          tempfiltered[0] &&
          tempfiltered[0].RoomChargeTypeRate &&
          tempfiltered[0].RoomChargeTypeRate,
      });
    }
  }, [typePick]);

  return (
    <div>
      <LocalizationProvider
        //@ts-ignore
        dateAdapter={AdapterDateFns}
        adapterLocale={mn}
      >
        {/* Turul */}
        <Grid container spacing={1}>
          <Grid item xs={6} sm={3} md={2}>
            <Typography fontSize={14} fontWeight={400}>
              Төрөл
            </Typography>

            <Select
              value={groupPick}
              {...register(`charge.${id}.GroupID`)}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              {chargegroup?.map((element: any) => {
                return (
                  <MenuItem
                    key={element.RoomChargeTypeGroupID}
                    value={element.RoomChargeTypeGroupID}
                  >
                    {element.RoomChargeTypeGroupName}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography fontSize={14} fontWeight={400}>
              Тооцоо
            </Typography>
            <Select
              disabled={chekedTrue}
              value={typePick}
              {...register(`charge.${id}.ItemID`)}
              onChange={handleTypeChange}
              fullWidth
              size="small"
            >
              {newchargeType?.map((element: any) => {
                return (
                  <MenuItem
                    key={element.RoomChargeTypeID}
                    value={element.RoomChargeTypeID}
                  >
                    {element.RoomChargeTypeName}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography fontSize={14} fontWeight={400}>
              Үнэ
            </Typography>

            <TextField
              type="number"
              min={0}
              disabled={
                filteredData &&
                filteredData[0] &&
                !filteredData[0].IsEditable
              }
              {...register(`charge.${id}.Amount`)}
              name={`charge.${id}.Amount`}
              size="small"
              fullWidth
              onFocus={(e) =>
                e.target.addEventListener(
                  "wheel",
                  function (e) {
                    e.preventDefault();
                  },
                  { passive: false }
                )
              }
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography fontSize={14} fontWeight={400}>
              Ширхэг
            </Typography>

            <TextField
              type="number"
              min={0}
              {...register(`charge.${id}.Quantity`)}
              name={`charge.${id}.Quantity`}
              size="small"
              onChange={(newvalue: any) => setQuantity(newvalue)}
              onFocus={(e) =>
                e.target.addEventListener(
                  "wheel",
                  function (e) {
                    e.preventDefault();
                  },
                  { passive: false }
                )
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={6} md={2}>
            {" "}
            <Typography fontSize={14} fontWeight={400}>
              Тайлбар
            </Typography>
            <TextField
              {...register(`charge.${id}.Description`)}
              name={`charge.${id}.Description`}
              fullWidth={true}
              sx={{ borderRadius: "8px" }}
              size="small"
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={2}
            style={{
              display: "flex",
              alignItems: "end",
              gap: "8px",
            }}
          >
            {/* Duplicate Button */}
            <Tooltip title="Хуулах" arrow>
              <IconButton
                size="small"
                onClick={handleDuplicate}
                sx={{
                  width: "35px",
                  height: "35px",
                  border: "1.5px solid #e0e0e0",
                  borderRadius: "8px",
                  color: "#1976d2",
                  "&:hover": {
                    borderColor: "#1976d2",
                    backgroundColor: "#e3f2fd",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <ContentCopyIcon sx={{ fontSize: "16px" }} />
              </IconButton>
            </Tooltip>

            {/* Delete Button */}
            <Tooltip title="Устгах" arrow>
              <IconButton
                size="small"
                onClick={() => remove(id)}
                sx={{
                  width: "35px",
                  height: "35px",
                  border: "1.5px solid #e0e0e0",
                  borderRadius: "8px",
                  color: "#d32f2f",
                  "&:hover": {
                    borderColor: "#d32f2f",
                    backgroundColor: "#ffebee",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <DeleteIcon sx={{ fontSize: "16px" }} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </LocalizationProvider>
      <Divider className="mt-3" />
    </div>
  );
}
