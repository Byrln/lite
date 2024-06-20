import CustomTable from "components/common/custom-table";
import { IncomeListSWR } from "lib/api/income-list";
const columns = [
    {
        title: "Дансны нэр",
        key: "AccountName",
        dataindex: "AccountName",
    },
    { title: "Дебит данс", key: "Debit", dataindex: "Debit" },
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
    { title: "Код", key: "CurrencyCode", dataindex: "CurrencyCode" },
    { title: "Ханш", key: "ExchangeRate", dataindex: "ExchangeRate" },
    { title: "Дүн", key: "Amount1", dataindex: "Amount1" },
    { title: "Нийлбэр дүн", key: "TotalAmount", dataindex: "TotalAmount" },
    { title: "Кредит данс", key: "Credit", dataindex: "Credit" },
    { title: "Кредит дүн ", key: "CreditAmount", dataindex: "CreditAmount" },
    { title: "Өдөр", key: "Date", dataindex: "Date" },
];
const IncomeList = ({ title, search }: any) => {
    const { data, error } = IncomeListSWR(search);
    return (
        <div>
            {title}
            <CustomTable id="No" data={data} error={error} columns={columns} />
        </div>
    );
};

export default IncomeList;
