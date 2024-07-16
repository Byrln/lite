import CustomTable from "components/common/custom-table";
import { useIntl } from "react-intl";
import { SalesListSWR, salestListUrl } from "lib/api/salesList";
import Search from "components/integration/search";

const SalesList = ({ title, search }: any) => {
    const intl = useIntl();
    const columns = [
        {
            title: intl.formatMessage({id:"TextDate"}), 
            key: "Date",
            dataIndex: "Date",
        },
        {
            title: "Дансны нэр ",
            key: "AccountName",
            dataindex: "AccountName",
            // renderCell: (element: any) =>
            //     element.row.IsDebit === false ? element.row.IsDebit : "",
        },
        {
            title: intl.formatMessage({id:"RowHeaderDebitAccount"}), 
            key: "DebitAccount",
            dataindex: "DebitAccount",
        },
        {
            title: intl.formatMessage({id:"RowHeaderDebitAccount"}), 
            key: "DebitAmount",
            dataindex: "DebitAmount",
        },
        {
            title: intl.formatMessage({id:"RowHeaderCustomerCode"}), 
            key: "CustomerCode",
            dataindex: "CustomerCode",
        },
        {
            title: intl.formatMessage({id:"RowHeaderCustomerName"}),
            key: "CustomerName",
            dataindex: "CustomerName",
        },
        {
            title: intl.formatMessage({id:"RowHeaderCurrencyCode"}),
            key: "CurrencyCode",
            dataindex: "CurrencyCode",
        },
        {
            title: intl.formatMessage({id:"RowHeaderExchangeRate"}),
            key: "ExchangeRate",
            dataindex: "ExchangeRate",
        },
        {
            title: intl.formatMessage({id:"ReportAmount"}),
            key: "Amount1",
            dataindex: "Amount1",
        },
        {
            title: intl.formatMessage({id:"RowHeaderCreditAccount"}),
            key: "CreditAccount",
            dataindex: "CreditAccount",
        },
        {
            title: intl.formatMessage({id:"RowHeaderCreditAmount"}),
            key: "CreditAmount",
            dataindex: "CreditAmount",
        },
    ];
    const { data, error } = SalesListSWR(search);

    return (
        <div>
            {/* <Search
                register={register}
                errors={errors}
                control={control}
                reset={reset}
            /> */}
            {title}

            <CustomTable id="No" columns={columns} data={data} error={error} />
        </div>
    );
};

export default SalesList;
