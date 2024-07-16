import CustomTable from "components/common/custom-table";
import { useIntl } from "react-intl";
import {
    
    CurrencyExchangeRateHistorySWR,
    exchangeHistoryUrl,
} from "lib/api/currency";
import { format } from "date-fns";

import { formatPrice } from "lib/utils/helpers";


const History = ({ CurrencyID }: any) => {
    const intl = useIntl();
    const columns = [
        {   title: intl.formatMessage({id:"RowHeaderCountry"}),  key: "CountryName", dataIndex: "CountryName" },
        { title: intl.formatMessage({id:"RowHeaderCurrencyName"}),  key: "CurrencyName", dataIndex: "CurrencyName" },
        {
            title: intl.formatMessage({id:"RowHeaderCurrencyCode"}),
            key: "CurrencyCode",
            dataIndex: "CurrencyCode",
        },
        { title: intl.formatMessage({id:"RowHeaderCurrencySymbol"}), 
             key: "CurrencySymbol", dataIndex: "CurrencySymbol" },
        {
            title: intl.formatMessage({id:"RowHeaderBeginDate"}), 
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
            title: intl.formatMessage({id:"RowHeaderEndDate"}), 
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
            title: intl.formatMessage({id:"RowHeaderBuyRate"}), 
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
            title: intl.formatMessage({id:"TextSell"}), 
            key: "SellRate",
            dataIndex: "SellRate",
            renderCell: (element: any) => {
                return element.row.SellRate && formatPrice(element.row.SellRate);
            },
        },
        { title: intl.formatMessage({id:"RowHeaderUser"}), 
            key: "UserName", 
            dataIndex: "UserName" },
    ];
    
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
