import {
    AccountListSWR,
    AccountingAPI,
    accountListUrl,
} from "lib/api/accounting";
import CustomTable from "components/common/custom-table";
const columns = [
    {
        title: "Дансны нэр ",
        key: "FinanceName",
    },
    {
        title: "Дебит данс ",
        key: "Debit account",
    },
    {
        title: "Кредит данс",
        key: "Credit account",
    },
];
const AccountingList = ({ title }: any) => {
    const { data, error } = AccountListSWR({});
    return (
        <div>
            {title}

            <CustomTable
                data={data}
                columns={columns}
                error={error}
                api={AccountingAPI}
                id="AccountID"
            />
        </div>
    );
};

export default AccountingList;
