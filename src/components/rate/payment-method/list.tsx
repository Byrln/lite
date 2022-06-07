import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import {
    PaymentMethodSWR,
    PaymentMethodAPI,
    listUrl,
} from "lib/api/payment-method";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Group Name",
        key: "PaymentMethodGroupName",
        dataIndex: "PaymentMethodGroupName",
    },

    {
        title: "Payment Method",
        key: "PaymentMethodName",
        dataIndex: "PaymentMethodName",
    },
    {
        title: "Status",
        key: "Status",
        dataIndex: "Status",
        render: function render(id: any, value: any) {
            return (
                <ToggleChecked
                    id={id}
                    checked={value}
                    api={PaymentMethodAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const PaymentMethodList = ({ title }: any) => {
    const { data, error } = PaymentMethodSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={PaymentMethodAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="PaymentMethodID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default PaymentMethodList;
