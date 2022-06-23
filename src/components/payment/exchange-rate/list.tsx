import { format } from "date-fns";

import CustomTable from "components/common/custom-table";
import {
    ExchangeRateSWR,
    ExchangeRateAPI,
    listUrl,
} from "lib/api/exchange-rate";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Date",
        key: "BeginDate",
        dataIndex: "BeginDate",
        render: function render(id: any, value: any) {
            return (
                value &&
                format(
                    new Date(value.replace(/ /g, "T")),
                    "MM/dd/yyyy hh:mm:ss a"
                )
            );
        },
    },
    {
        title: "Country",
        key: "CountryName",
        dataIndex: "CountryName",
    },
    {
        title: "Currency",
        key: "CurrencyName",
        dataIndex: "CurrencyName",
    },
    {
        title: "Code",
        key: "CurrencyCode",
        dataIndex: "CurrencyCode",
    },
    {
        title: "Symbol",
        key: "CurrencySymbol",
        dataIndex: "CurrencySymbol",
    },
    {
        title: "Buy",
        key: "CurrencyID",
        dataIndex: "CurrencyID",
    },
    {
        title: "Sell",
        key: "CountryID",
        dataIndex: "CountryID",
    },
    {
        title: "Main",
        key: "Main",
        dataIndex: "Main",
    },
    {
        title: "User Name",
        key: "UserName",
        dataIndex: "UserName",
    },
];

const ExchangeRateList = ({ title }: any) => {
    const { data, error } = ExchangeRateSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={ExchangeRateAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="ExchangeRateID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default ExchangeRateList;
