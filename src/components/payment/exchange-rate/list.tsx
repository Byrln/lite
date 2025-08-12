import { format } from "date-fns";
import { Button } from "@mui/material";
import { useContext } from "react";
import { useIntl } from "react-intl";
import CustomTable from "components/common/custom-table";
import {
  ExchangeRateListSWR,
  ExchangeRateAPI,
  exchangeRateListUrl as listUrl,
} from "lib/api/exchange-rate";
import NewEdit from "./new-edit";
import { ModalContext } from "lib/context/modal";
import History from "./history";
import ToggleChecked from "components/common/custom-switch";

const ExchangeRateList = ({ title }: any) => {
  const intl = useIntl();
  const { data, error } = ExchangeRateListSWR();
  const { handleModal }: any = useContext(ModalContext);

  const columns = [
    {
      title: intl.formatMessage({ id: "TextDate" }),
      key: "BeginDate",
      dataIndex: "BeginDate",
      excelRenderPass: true,
      renderCell: (element: any) => {
        return (element.row.BeginDate && format(
          new Date(element.row.BeginDate.replace(/ /g, "T")),
          "MM/dd/yyyy hh:mm:ss a"
        ));
      },
    },
    {
      title: intl.formatMessage({ id: "RowHeaderCountry" }),
      key: "CountryName",
      dataIndex: "CountryName",
      renderCell: (element: any) => {
        return intl.formatMessage(
          { id: `${element.row.CountryName}` },
          { defaultMessage: element.row.CountryName }
        );
      },
    },
    {
      title: intl.formatMessage({ id: "RowHeaderExchangeRate" }),
      key: "CurrencyName",
      dataIndex: "CurrencyName",
    },
    {
      title: intl.formatMessage({ id: "RowHeaderCurrencyCode" }),
      key: "CurrencyCode",
      dataIndex: "CurrencyCode",
    },
    {
      title: intl.formatMessage({ id: "RowHeaderCurrencySymbol" }),
      key: "CurrencySymbol",
      dataIndex: "CurrencySymbol",
    },
    {
      title: intl.formatMessage({ id: "RowHeaderBuyRate" }),
      key: "BuyRate",
      dataIndex: "BuyRate",
    },
    {
      title: intl.formatMessage({ id: "RowHeaderSellRate" }),
      key: "SellRate",
      dataIndex: "SellRate",
    },
    {
      title: intl.formatMessage({ id: "RowHeaderMain" }),
      key: "IsCurrent",
      dataIndex: "IsCurrent",
      renderCell: (element: any) => {
        return (
          <ToggleChecked
            id={element.id}
            checked={element.row.IsCurrent}
            apiUrl="UpdateStatus"
            mutateUrl={`${listUrl}`}
            disabled={true}
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: "Default_LabelUserName" }),
      key: "UserName",
      dataIndex: "UserName",
    },
    {
      title: intl.formatMessage({ id: "RowHeaderAdditionalAction" }),
      key: "Action",
      dataIndex: "Action",
      excelRenderPass: true,
      renderCell: (element: any) => {
        return (
          <Button
            key={element.id}
            onClick={() => {
              handleModal(
                true,
                `${intl.formatMessage({ id: "TextExchangeRate" })}`,
                <History CurrencyID={element.row.CurrencyID} />,
                null,
                "large"
              );
            }}
          >
            {intl.formatMessage({ id: "TextHistory" })}
          </Button>
        );
      },
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={data}
      error={error}
      api={ExchangeRateAPI}
      hasNew={true}
      hasUpdate={true}
      hasDelete={true}
      id="CurrencyID"
      listUrl={listUrl}
      modalTitle={title}
      modalContent={<NewEdit />}
      excelName={title}
      modalsize="medium"
    />
  );
};

export default ExchangeRateList;
