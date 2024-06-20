import CustomTable from "components/common/custom-table";
import { SalesListSWR, salestListUrl } from "lib/api/salesList";
import Search from "components/integration/search";
const columns = [
    {
        title: "Өдөр ",
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
        title: "Дэбит данс",
        key: "DebitAccount",
        dataindex: "DebitAccount",
    },
    {
        title: "Дэбит дүн",
        key: "DebitAmount",
        dataindex: "DebitAmount",
    },
    {
        title: "Харилцагчийн код",
        key: "CustomerCode",
        dataindex: "CustomerCode",
    },
    {
        title: "Харилцагчийн нэр",
        key: "CustomerName",
        dataindex: "CustomerName",
    },
    {
        title: "Код",
        key: "CurrencyCode",
        dataindex: "CurrencyCode",
    },
    {
        title: "Ханш",
        key: "ExchangeRate",
        dataindex: "ExchangeRate",
    },
    {
        title: "Дүн",
        key: "Amount1",
        dataindex: "Amount1",
    },
    {
        title: "Кредит данс",
        key: "CreditAccount",
        dataindex: "CreditAccount",
    },
    {
        title: "Кредит дүн",
        key: "CreditAmount",
        dataindex: "CreditAmount",
    },
];
const SalesList = ({ title, search }: any) => {
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
