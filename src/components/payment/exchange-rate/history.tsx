import CustomTable from "components/common/custom-table";
import {
    CurrencyExchangeRateHistorySWR,
    exchangeHistoryUrl,
} from "lib/api/currency";
import { format } from "date-fns";

import { formatPrice } from "lib/utils/helpers";

const columns = [
    { title: "Улс", key: "CountryName", dataIndex: "CountryName" },
    { title: "Ханш", key: "CurrencyName", dataIndex: "CurrencyName" },
    {
        title: "Код",
        key: "CurrencyCode",
        dataIndex: "CurrencyCode",
    },
    { title: "Тэмдэгт", key: "CurrencySymbol", dataIndex: "CurrencySymbol" },
    {
        title: "Эхлэх огноо",
        key: "BeginDate",
        dataIndex: "BeginDate",
        renderCell: (element: any) => {
            return (
                element.row.BeginDate &&
                format(
                    new Date(element.row.BeginDate.replace(/ /g, "T")),
                    "MM-dd-yyyy HH:MM:SS"
                )
            );
        },
    },
    {
        title: "Дуусах огноо",
        key: "EndDate",
        dataIndex: "EndDate",
        renderCell: (element: any) => {
            return (
                element.row.EndDate &&
                format(
                    new Date(element.row.EndDate.replace(/ /g, "T")),
                    "MM-dd-yyyy HH:MM:SS"
                )
            );
        },
    },
    {
        title: "Худ.авах",
        key: "CurrencyRate1",
        dataIndex: "CurrencyRate1",
        renderCell: (element: any) => {
            return (
                element.row.CurrencyRate1 &&
                formatPrice(element.row.CurrencyRate1)
            );
        },
    },
    {
        title: "Зарах",
        key: "SellRate",
        dataIndex: "SellRate",
        renderCell: (element: any) => {
            return element.row.SellRate && formatPrice(element.row.SellRate);
        },
    },
    { title: "Хэрэглэгч", key: "UserName", dataIndex: "UserName" },
];

const History = ({ CurrencyID }: any) => {
    const { data, error } = CurrencyExchangeRateHistorySWR({
        CurrencyID: CurrencyID,
    });

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                id="BeginDate"
                listUrl={exchangeHistoryUrl}
                excelName="Түүх"
                hasNew={false}
                hasDelete={false}
                hasShow={false}
            />
        </>
    );
};

export default History;
