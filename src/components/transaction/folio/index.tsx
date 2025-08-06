import { Box, Button, Typography, Menu, MenuItem, Card, CardContent, Collapse, IconButton, Stack, TextField, Select, FormControl, Checkbox as MuiCheckbox, FormControlLabel } from "@mui/material";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect, useContext } from "react";
import { format } from "date-fns";
import { Checkbox } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { SelectChangeEvent } from "@mui/material/Select";
import mn from "date-fns/locale/mn";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { mutate } from "swr";

import { FolioItemSWR, FolioAPI, listUrl } from "lib/api/folio";
import CustomTable from "components/common/custom-table";
import FolioSelect from "components/select/folio";
import { formatPrice } from "lib/utils/helpers";
import NewEdit from "./new-edit-test";
import { FrontOfficeAPI } from "lib/api/front-office";
import { CurrencySWR } from "lib/api/currency";
import { ReasonSWR } from "lib/api/reason";
import GuestDefaultSelect from "components/select/guest-default";
import CustomerSelect from "components/select/customer";
import { useIntl } from "react-intl";

const RoomCharge = ({ TransactionID }: any) => {
  const intl = useIntl();
  const [entity, setEntity] = useState<any>({});
  const [rerenderKey, setRerenderKey] = useState(0);
  const [userTypeID, setUserTypeID]: any = useState(null);
  const [FolioID, setFolioID] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  // Inline action states
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cutOpen, setCutOpen] = useState(false);
  const [billToOpen, setBillToOpen] = useState(false);
  const [newEditOpen, setNewEditOpen] = useState(false);
  const [sideLayoutOpen, setSideLayoutOpen] = useState(true);

  const handleClick = (event: any, row: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const { data, error } = FolioItemSWR(FolioID);


  useEffect(() => {
    if (data) {
      setEntity(data);
    }
  }, [data]);

  const onCheckboxChange = (e: any) => {
    let tempEntity = [...entity];
    tempEntity.forEach(
      (element: any) => (element.isChecked = e.target.checked)
    );
    setEntity(tempEntity);
    setRerenderKey((prevKey) => prevKey + 1);
  };
  const validationSchema = yup.object().shape({});

  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    resetField,
  } = useForm(formOptions);

  const columns = [
    {
      title: "№",
      key: "№",
      dataIndex: "№",
    },
    // {
    //     title: "",
    //     key: "№",
    //     dataIndex: "№",
    //     withCheckBox: true,
    //     onChange: onCheckboxChange,
    //     render: function render(
    //         id: any,
    //         value: any,
    //         element: any,
    //         dataIndex: any
    //     ) {
    //         return (
    //             <Checkbox
    //                 key={rerenderKey}
    //                 checked={
    //                     entity &&
    //                     entity[dataIndex] &&
    //                     entity[dataIndex].isChecked
    //                 }
    //                 onChange={(e: any) => {
    //                     let tempEntity = [...entity];
    //                     tempEntity[dataIndex].isChecked = e.target.checked;
    //                     setEntity(tempEntity);
    //                 }}
    //             />
    //         );
    //     },
    // },
    {
      title: "Огноо",
      key: "CurrDate",
      dataIndex: "CurrDate",
      __ignore__: true,
      excelRenderPass: true,
      render: function render(id: any, record: any) {
        return format(
          new Date(record.replace(/ /g, "T")),
          "MM/dd/yyyy"
        );
      },
    },
    {
      title: "Өрөө",
      key: "RoomFullName",
      dataIndex: "RoomFullName",
    },
    {
      title: "Хэлбэр",
      key: "ItemName",
      dataIndex: "ItemName",
    },
    {
      title: "Дүн",
      key: "Amount2",
      dataIndex: "Amount2",
      __ignore__: true,
      excelRenderPass: true,
      render: function render(id: any, record: any, entity: any) {
        return formatPrice(record);
      },
    },

    {
      title: "Тайлбар",
      key: "Description",
      dataIndex: "Description",
    },
    {
      title: "Хэрэглэгч",
      key: "Username",
      dataIndex: "Username",
    },
    {
      title: "Үйлдэл",
      key: "Action",
      dataIndex: "Action",
      render: function render(id: any, value: any, entity: any) {
        return (
          <>
            <Button
              aria-controls={`menu${entity.CurrID}`}
              variant={"outlined"}
              size="small"
              onClick={(e) => handleClick(e, entity)}
            >
              Үйлдэл
            </Button>
            <Menu
              id={`menu${entity.CurrID}`}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {selectedRow && (
                <>
                  <MenuItem
                    key={`edit${selectedRow.CurrID}`}
                    onClick={() => {
                      setEditOpen(true);
                      handleClose();
                    }}
                  >
                    Засах
                  </MenuItem>
                  <MenuItem
                    key={`delete${selectedRow.CurrID}`}
                    onClick={() => {
                      setDeleteOpen(true);
                      handleClose();
                    }}
                  >
                    Устгах
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchDatas = async () => {
      if (FolioID) {
        try {
          const response = await FolioAPI.items(FolioID);
          setEntity(response);
        } finally {
        }
      }
    };

    fetchDatas();
  }, [FolioID]);

  return (
    <Box>


      {/* Main Content Container */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left Panel - Always Visible (50% width) */}
        <Box sx={{ width: '30%' }}>
          <Box sx={{ height: 'fit-content' }}>
            {/* Action Buttons */}
            <Box sx={{ mb: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setCutOpen(!cutOpen);
                  setEditOpen(false);
                  setDeleteOpen(false);
                  setBillToOpen(false);
                }}
              >
                {intl.formatMessage({ id: 'TextFolioCut' })}
              </Button>

              <Button
                variant="outlined"
                onClick={() => {
                  setBillToOpen(!billToOpen);
                  setEditOpen(false);
                  setDeleteOpen(false);
                  setCutOpen(false);
                }}
              >
                {intl.formatMessage({ id: 'TextFolioBillTo' })}
              </Button>

              <Box sx={{ width: "30%", minWidth: '200px' }}>
                <FolioSelect
                  register={register}
                  errors={errors}
                  TransactionID={TransactionID}
                  resetField={resetField}
                  onChange={setFolioID}
                />
              </Box>
            </Box>
            {/* Cut Component in Side Panel */}
            {cutOpen && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Cut Transaction</Typography>
                <CutTransactionInline
                  TransactionID={TransactionID}
                  FolioID={FolioID}
                  onClose={() => setCutOpen(false)}
                />
              </Box>
            )}

            {/* Bill To Component in Side Panel */}
            {billToOpen && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Bill To</Typography>
                <BillToTransactionInline
                  TransactionID={TransactionID}
                  FolioID={FolioID}
                  onClose={() => setBillToOpen(false)}
                />
              </Box>
            )}
            {/* New Edit Component in Side Panel - Always Visible */}
            <Box>
              <NewEdit
                TransactionID={TransactionID}
                FolioID={FolioID}
                handleModal={() => setNewEditOpen(false)}
              />
            </Box>

            {/* Edit Component in Side Panel */}
            {editOpen && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Edit Transaction</Typography>
                <EditTransactionInline
                  selectedRow={selectedRow}
                  TransactionID={TransactionID}
                  onClose={() => setEditOpen(false)}
                />
              </Box>
            )}

            {/* Delete Component in Side Panel */}
            {deleteOpen && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Delete Transaction</Typography>
                <DeleteTransactionInline
                  TransactionID={TransactionID}
                  onClose={() => setDeleteOpen(false)}
                />
              </Box>
            )}
          </Box>
        </Box>

        {/* Right Panel - Table (50% width) */}
        <Box sx={{ width: '70%' }}>
          <CustomTable
            columns={columns}
            data={entity ? entity : {}}
            error={error}
            modalTitle="Өрөөний тооцоо"
            excelName="Өрөөний тооцоо"
            pagination={false}
            datagrid={false}
            hasPrint={false}
            hasExcel={false}
            hasNew={false}
            hasUpdate={false}
            id="CurrID"
            api={FolioAPI}
            listUrl={listUrl}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              marginTop: "10px",
            }}
          >
            <Typography variant="subtitle1">
              Үлдэгдэл{" "}
              {entity && entity.length > 0
                ? formatPrice(
                  entity.reduce(
                    (acc: any, obj: any) =>
                      Number(acc) + Number(obj.Amount2),
                    0
                  )
                )
                : 0}
            </Typography>
          </Box>
        </Box>
      </Box>


    </Box>
  );
};

// Inline Edit Transaction Component
const EditTransactionInline = ({ selectedRow, TransactionID, onClose }: any) => {
  const { data } = CurrencySWR();
  const [workingDate, setWorkingDate] = useState(null);
  const [setedDate, setSetedDate] = useState<Date>(new Date());
  const [enableDate, setEnableDate] = useState(true);
  const [chekedTrue, setChekedTrue] = useState(false);
  const [quantity, setQuantity] = useState<any>(0);
  const [iName, setIName] = useState();
  const [tType, setTType] = useState<any>(0);
  const [amount, setAmount] = useState<any>(0);
  const [amount2, setAmount2] = useState<any>(0);
  const [currency, setCurrency] = useState<any>("");
  const [currencyID, setCurrencyID] = useState<any>("");
  const [currency2, setCurrency2] = useState<any>("");
  const [EditableRate, setEditableRate] = useState<any>("");
  const [description, setDescription] = useState<any>(" ");

  useEffect(() => {
    if (selectedRow) {
      fetchDatas();
      fetchDate();
    }
  }, [selectedRow]);

  const fetchDate = async () => {
    let response = await FrontOfficeAPI.workingDate();
    if (response.status == 200) {
      setWorkingDate(response.workingDate[0].WorkingDate);
    }
  };

  const fetchDatas = async () => {
    if (!selectedRow) return;
    let response = await FolioAPI.edits(selectedRow.FolioID, selectedRow.CurrID, selectedRow.TypeID);

    setIName(response[0].ItemName);
    setTType(response[0].TypeID);
    setCurrency(response[0].PayCurrencyCode);
    setCurrencyID(response[0].PayCurrencyID.toString());
    setCurrency2(response[0].CurrencyCode);
    setEditableRate(response[0].EditableRate);

    if (response[0].Quantity == 0 && response) {
      setQuantity(1);
    } else {
      setQuantity(response[0].Quantity);
    }

    if (response[0].Amount1 > 0 && response) {
      setAmount(response[0].Amount1);
      setAmount2(response[0].Amount2);
    } else {
      if (response[0].Amount1 == 0) {
        setAmount(response[0].Amount1);
        setAmount2(response[0].Amount2);
      } else {
        setAmount(response[0].Amount1 * -1);
        setAmount2(response[0].Amount2 * -1);
      }
    }
  };

  const handleSubmit = async () => {
    await FolioAPI?.update({
      TransactionID: TransactionID,
      FolioID: selectedRow.FolioID,
      TypeID: tType,
      CurrID: selectedRow.CurrID,
      CurrDate: setedDate,
      PayCurrencyID: currencyID,
      Amount: amount,
      Quantity: quantity,
      Description: description,
    });
    await mutate(`/api/Folio/Items`);
    onClose();
  };

  const handleChekbox = () => {
    setChekedTrue(!chekedTrue);
    setEnableDate(!enableDate);
  };

  const handleExchangePick = (event: SelectChangeEvent) => {
    setCurrencyID(event.target.value as string);
  };

  if (!selectedRow) return null;

  return (
      <Stack direction="column" spacing={2}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Typography>Date</Typography>
          <Typography>{workingDate}</Typography>
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center">
          <Typography>Name</Typography>
          <Typography>{iName}</Typography>
        </Stack>
        {tType == 1 ? (
          <Stack direction="row" spacing={3}>
            <Typography>Quantity</Typography>
            <TextField
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              size="small"
            />
          </Stack>
        ) : (
          <Select value={currencyID} onChange={handleExchangePick} size="small">
            {data?.map((element: any) => (
              <MenuItem key={element.CurrencyID} value={element.CurrencyID}>
                {element.CurrencyCode}
              </MenuItem>
            ))}
          </Select>
        )}
        <Stack direction="row" spacing={3} alignItems="center">
          <Typography>Amount</Typography>
          <TextField
            type="number"
            disabled={!EditableRate}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            size="small"
          />
          {tType == 1 && <Typography>{currency}</Typography>}
          {amount != amount2 && (
            <Typography>{amount2.toLocaleString()}{currency2}</Typography>
          )}
        </Stack>
        <TextField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          size="small"
        />
        <Stack direction="row" alignItems="center" spacing={3}>
          <Typography>Date</Typography>
          <MuiCheckbox checked={chekedTrue} onChange={handleChekbox} />
          <DateTimePicker
            disabled={enableDate}
            value={setedDate}
            onChange={(newValue: any) => setSetedDate(newValue)}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
        </Stack>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
        </Box>
      </Stack>
  );
};

// Inline Delete Transaction Component
const DeleteTransactionInline = ({ selectedRow, TransactionID, onClose }: any) => {
  const [reasonID, setReasonID] = useState<any>("5");
  const [canVoid, setCanVoid] = useState<any>(false);
  const [newData, setNewData] = useState<any>();
  const { data } = ReasonSWR({ ReasonTypeID: 2 });

  useEffect(() => {
    if (selectedRow) {
      fetchDatas();
    }
  }, [selectedRow]);

  const fetchDatas = async () => {
    if (!selectedRow) return;
    let response = await FolioAPI.edits(selectedRow.FolioID, selectedRow.CurrID, selectedRow.TypeID);
    setCanVoid(response[0].CanVoid);
    setNewData(response);
  };

  const handleReasonSelect = (event: SelectChangeEvent) => {
    setReasonID(event.target.value as string);
  };

  const handleSubmit = async () => {
    await FolioAPI?.VoidItem({
      FolioID: selectedRow.FolioID,
      TypeID: newData[0].TypeID,
      CurrID: newData[0].CurrID,
      ReasonID: reasonID
    });
    await mutate(`/api/Folio/Items`);
    onClose();
  };

  if (!selectedRow) return null;

  return (
    <Stack direction='column' spacing={2}>
      <Stack direction='row' spacing={2} alignItems='center'>
        <Typography>Устгах шалтгаан сонгох</Typography>
        <Select value={reasonID} fullWidth onChange={handleReasonSelect} size="small">
          {data?.map((element: any) => (
            <MenuItem key={element.ReasonID} value={element.ReasonID}>
              {element.ReasonName}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button disabled={!canVoid} variant="contained" color="error" onClick={handleSubmit}>
          Устгах
        </Button>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
      </Box>
    </Stack>
  );
};

// Inline Cut Transaction Component
const CutTransactionInline = ({ FolioID, onClose }: any) => {
  const { register, handleSubmit, control } = useForm();

  const customSubmit = async (values: any) => {
    try {
      await FolioAPI.cut(values);
      await mutate(`/api/Folio/Items`);
      onClose();
    } catch (error) {
      console.error('Cut operation failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(customSubmit)}>
      <Stack sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, backgroundColor: "#f5f5f5", borderRadius: 1, px: 2, py: 1 }}>
        <FormControlLabel
          control={
            <Controller
              name="CheckRC"
              control={control}
              render={() => <MuiCheckbox {...register("CheckRC")} />}
            />
          }
          label="Room Charge"
        />
        <FormControlLabel
          control={
            <Controller
              name="CheckEC"
              control={control}
              render={() => <MuiCheckbox {...register("CheckEC")} />}
            />
          }
          label="Extra Charge"
        />
        <input type="hidden" {...register("FolioID")} value={FolioID} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained">Submit</Button>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
        </Box>
      </Stack>
    </form>
  );
};

// Inline Bill To Transaction Component
const BillToTransactionInline = ({ TransactionID, FolioID, onClose }: any) => {
  const [entity, setEntity] = useState(true);
  const [entity2, setEntity2] = useState(false);
  const [guest, setGuest] = useState();
  const { register, handleSubmit, control, resetField } = useForm();

  const customSubmit = async (values: any) => {
    try {
      values.BillToGuest = entity;
      values.FolioID = FolioID;
      delete values.BillToGuest1;
      delete values.BillToGuest2;
      await FolioAPI.billTo(values);
      await mutate(`/api/Folio/Items`);
      onClose();
    } catch (error) {
      console.error('Bill To operation failed:', error);
    }
  };

  const handleBillToGuest = (e: any) => {
    setEntity(e.target.checked);
    setEntity2(!e.target.checked);
    if (!e.target.checked) {
      resetField("GuestID", { defaultValue: null });
    }
  };

  const handleBillToGuest2 = (e: any) => {
    setEntity2(e.target.checked);
    setEntity(!e.target.checked);
    if (!e.target.checked) {
      resetField("CustomerID", { defaultValue: null });
    }
  };

  return (
    <form onSubmit={handleSubmit(customSubmit)}>
      <Stack sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, backgroundColor: "#f5f5f5", borderRadius: 1, px: 2, py: 1 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <div className="bg-[#804FE6] rounded-full outline outline-[#804FE6] outline-2 shadow-md w-full sm:w-auto overflow-hidden">
            <RadioGroup
              value={entity ? "guest" : entity2 ? "customer" : ""}
              onValueChange={(value) => {
                if (value === "guest") {
                  handleBillToGuest({ target: { checked: true } } as any);
                } else if (value === "customer") {
                  handleBillToGuest2({ target: { checked: true } } as any);
                }
              }}
              className="flex gap-0.5 sm:gap-1 flex-nowrap"
            >
              {[
                { value: "guest", label: "Bill to Guest" },
                { value: "customer", label: "Bill to Customer" },
              ].map((option) => (
                <div key={option.value} className="flex items-center">
                  <RadioGroupItem
                    value={option.value}
                    id={`bill-${option.value}`}
                    className="sr-only"
                  />
                  <label
                    htmlFor={`bill-${option.value}`}
                    className={`
                      px-2 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap
                      ${(option.value === "guest" && entity) || (option.value === "customer" && entity2)
                        ? "bg-white text-[#804FE6] shadow-sm"
                        : "text-white hover:bg-white/10"
                      }
                    `}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </Box>
        {entity && (
          <GuestDefaultSelect
            register={register}
            errors={{}}
            entity={guest}
            setEntity={setGuest}
            search={{ TransactionID: TransactionID }}
          />
        )}
        {entity2 && (
          <CustomerSelect
            register={register}
            errors={{}}
            isCustomSelect={true}
          />
        )}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained">Submit</Button>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
        </Box>
      </Stack>
    </form>
  );
};

export default RoomCharge;
