import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Grid, Switch, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { RateSWR, listUrl, RateAPI } from "lib/api/rate";
import Search from "./search";
import { formatNumber } from "lib/utils/helpers";

const RateList = ({ title, taxData, setHasData = null }: any) => {
  const intl = useIntl();
  const validationSchema = yup.object().shape({
    SearchStr: yup.string().nullable(),
    RoomTypeID: yup.string().nullable(),
    RateTypeID: yup.string().nullable(),
    ChannelID: yup.string().nullable(),
    SourceID: yup.string().nullable(),
    RoomChargeDurationID: yup.string().nullable(),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm(formOptions);
  const [isChecked, setIsChecked] = useState(true);
  const [search, setSearch] = useState({});
  const [entity, setEntity] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { data, error } = RateSWR(search, isChecked);

  useEffect(() => {
    if (data) {
      setEntity(data);
      if (setHasData && data.length > 0) {
        setHasData(true);
      }
    }
  }, [data]);

  const onToggleChecked = async () => {
    setLoading(true);

    try {
      setIsChecked(!isChecked);
      setSearch({
        ...search,
        TaxIncluded: !isChecked,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "№",
      key: "test",
      dataIndex: "test",
    },
    {
      title: intl.formatMessage({ id: "TextRateType" }),
      key: "RateTypeName",
      dataIndex: "RateTypeName",
    },
    {
      title: intl.formatMessage({ id: "TextRoomType" }),
      key: "RoomTypeName",
      dataIndex: "RoomTypeName",
    },
    {
      title: intl.formatMessage({ id: "TextSeasonName" }),
      key: "SeasonName",
      dataIndex: "SeasonName",
    },
    {
      title: intl.formatMessage({ id: "TextSourceName" }),
      key: "SourceName",
      dataIndex: "SourceName",
    },
    {
      title: intl.formatMessage({ id: "ReportCompany" }),
      key: "CustomerName",
      dataIndex: "CustomerName",
    },
    {
      title: intl.formatMessage({ id: "RowHeaderDuration" }),
      key: "DurationName",
      dataIndex: "DurationName",
      renderCell: (element: any) => {
        return intl.formatMessage(
          { id: `${element.row.DurationName}` },
          { defaultMessage: element.row.DurationName }
        );
      },
      // render: (value: string) => {
      //   return intl.formatMessage(
      //     { id: `${value}` },
      //     { defaultMessage: value }
      //   );
      // },
    },
    {
      title: intl.formatMessage({ id: "BaseRate" }),
      key: "BaseRate",
      dataIndex: "BaseRate",
      excelRenderPass: true,

      render: function render(
        id: any,
        value: any,
        element: any,
        dataIndex: any
      ) {
        return (
          <TextField
            size="small"
            fullWidth
            value={
              entity &&
              entity[dataIndex] &&
              formatNumber(entity[dataIndex].BaseRate)
            }
            InputLabelProps={{
              shrink: true,
            }}
            margin="dense"
            onChange={(evt: any) => {
              let tempEntity = [...entity];
              tempEntity[dataIndex].BaseRate = parseFloat(
                evt.target.value.replace(/[^0-9.]/g, "")
              );
              setEntity(tempEntity);
            }}
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: "RowHeaderRateExtraAdult" }),
      key: "ExtraAdult",
      dataIndex: "ExtraAdult",
      excelRenderPass: true,

      render: function render(
        id: any,
        value: any,
        element: any,
        dataIndex: any
      ) {
        return (
          <TextField
            size="small"
            fullWidth
            value={
              entity &&
              entity[dataIndex] &&
              formatNumber(entity[dataIndex].ExtraAdult)
            }
            InputLabelProps={{
              shrink: true,
            }}
            margin="dense"
            onChange={(evt: any) => {
              let tempEntity = [...entity];
              tempEntity[dataIndex].ExtraAdult = parseFloat(
                evt.target.value.replace(/[^0-9.]/g, "")
              );
              setEntity(tempEntity);
            }}
          />
        );
      },
    },

    {
      title: intl.formatMessage({ id: "RowHeaderRateExtraChild" }),
      key: "ExtraChild",
      dataIndex: "ExtraChild",
      excelRenderPass: true,

      render: function render(
        id: any,
        value: any,
        element: any,
        dataIndex: any
      ) {
        return (
          <TextField
            size="small"
            // type="number"
            fullWidth
            value={
              entity &&
              entity[dataIndex] &&
              formatNumber(entity[dataIndex].ExtraChild)
            }
            InputLabelProps={{
              shrink: true,
            }}
            margin="dense"
            onChange={(evt: any) => {
              let tempEntity = [...entity];
              tempEntity[dataIndex].ExtraChild = parseFloat(
                evt.target.value.replace(/[^0-9.]/g, "")
              );
              setEntity(tempEntity);
            }}
          />
        );
      },
    },
  ];

  const onSubmit = async () => {
    setLoading(true);

    try {
      let tempValues = { RateList: entity };

      await RateAPI.insertWUList(tempValues);

      await mutate(listUrl);
      toast("Амжилттай.");
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
                @media print {
                    .rate-table-container {
                        width: 100% !important;
                        overflow: visible !important;
                        max-width: none !important;
                    }
                    
                    .rate-table-container .MuiTableContainer-root {
                        max-height: none !important;
                        overflow: visible !important;
                        width: 100% !important;
                    }
                    
                    .rate-table-container .MuiTable-root {
                        width: 100% !important;
                        table-layout: auto !important;
                        min-width: 100% !important;
                    }
                    
                    .rate-table-container .MuiTableCell-root {
                        white-space: nowrap !important;
                        font-size: 10px !important;
                        padding: 2px 4px !important;
                        border: 1px solid #ddd !important;
                    }
                    
                    .rate-table-container .MuiTextField-root {
                        width: 80px !important;
                        min-width: 80px !important;
                    }
                    
                    .rate-table-container .MuiTextField-root input {
                        font-size: 10px !important;
                        padding: 2px !important;
                    }
                    
                    .rate-table-container .indiana-scroll-container {
                        overflow: visible !important;
                        width: 100% !important;
                        max-width: none !important;
                    }
                    
                    @page {
                        size: A4 landscape;
                        margin: 0.5in;
                    }
                }
            `}</style>
      <LoadingButton loading={loading}>
        <Switch
          checked={isChecked}
          disabled={loading}
          onClick={onToggleChecked}
        />
      </LoadingButton>
      {intl.formatMessage({ id: "RateTaxIncluded" })}{" "}
      {console.log('Tax Data:', taxData)}
      {taxData &&
        taxData
          .filter((item: any) => item.Status === true)
          .map((item: any) => {
            console.log('Tax Item:', item);
            return (
              <span key={item.TaxID}>
                {item.TaxID != 1 && "+"}
                {item.TaxAmount}%
              </span>
            );
          })}{" "}
      {intl.formatMessage({ id: "RateTaxSuffix" })}
      <br />
      <Box className="rate-table-container">
        <CustomTable
          columns={columns}
          data={data}
          error={error}
          modalTitle={title}
          excelName={title}
          pagination={false}
          datagrid={false}
        />
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={5}></Grid>
        <Grid item xs={2}>
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={onSubmit}
            size="small"
            className="mt-3 "
            fullWidth
          >
            {intl.formatMessage({ id: "TextSave" })}
          </LoadingButton>
        </Grid>
        <Grid item xs={5}></Grid>
      </Grid>
    </>
  );
};

export default RateList;
