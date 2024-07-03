import { useIntl } from "react-intl";
import {
    AccountListSWR,
    AccountingAPI,
    accountListUrl,
} from "lib/api/accounting";
import CustomTable from "components/common/custom-table";

const AccountingList = ({ title }: any) => {
    const intl = useIntl();
    const columns = [
        {
            title: intl.formatMessage({id:"TextAccountName"}), 
            key: "TextAccountName",
            dataIndex: "TextAccountName",
        },
        {
            title: intl.formatMessage({id:"RowHeaderDebitAccount"}), 
            key: "RowHeaderDebitAccount",
            dataindex: "RowHeaderDebitAccount",
            renderCell: (element: any) =>
                element.row.IsDebit === false ? element.row.IsDebit : "",
        },
        {
            title: intl.formatMessage({id:"RowHeaderCreditAccount"}), 
            key: "RowHeaderCreditAccount",
            dataIndex: "RowHeaderCreditAccount",
            renderCell: (element: any) =>
                element.row.IsCredit === false ? element.row.IsCredit : "",
        },
    ];
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
